import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// --- Provider Setup ---
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

// --- Types ---
export type TranslationMode = "toReality" | "toLinkedIn";
export type Tone = "brutallyHonest" | "sarcastic" | "hustleCulture" | "corporateOverlord" | "passiveAggressive";
export type Provider = "gemini" | "groq";

export interface TranslationResult {
  translation: string;
  cringeScore: number;
  buzzwords: string[];
  provider: Provider;
}

// --- Prompts ---
const systemInstructions = {
  toReality: `You are a "LinkedIn Reality Check" bot. Your job is to expose the mundane, often underwhelming truth hidden beneath exaggerated, jargon-heavy LinkedIn posts.
    
  **YOUR TONE MUST BE**: Witty, relatable, slightly unimpressed, and deeply cynical of corporate "hustle culture." Don't just summarize; provide a sharp, one-sentence "Reality Check."
  
  **EXAMPLES OF GOOD OUTPUT:**
  - Original: "I am thrilled to announce my promotion to Senior Associate Lead!"
  - Reality Check: "Finally got a slightly better desk and a $1 raise."
  - Original: "After 20 years, I've decided to move on to my next adventure..."
  - Reality Check: "I got laid off and I'm trying to look busy on the internet."
  
  **JSON OUTPUT REQUIREMENTS:**
  - translation: A brief (under 12 words), sharp, witty reality check. No summary tags. Just the joke.
  - cringeScore: 0-100 (Higher = more corporate jargon used).
  - buzzwords: Array of the worst corporate words found.
    
  Return ONLY valid JSON.`,

  toLinkedIn: (tone: Tone) => `You are a "Corporate Jargon Generator". Your job is to take simple, everyday tasks and turn them into epic, world-changing LinkedIn milestones.
    
  You must return a JSON object with the following fields:
  - translation: The over-the-top LinkedIn post.
  - cringeScore: A number from 0 to 100 representing how much "LinkedIn energy" this new post has.
  - buzzwords: An array of the buzzwords you added to make it sound professional.
    
  Tone: ${tone}.
  Return ONLY valid JSON.`,
};

function getSystemPrompt(mode: TranslationMode, tone: Tone): string {
  return mode === "toReality"
    ? systemInstructions.toReality
    : systemInstructions.toLinkedIn(tone);
}

function getUserPrompt(text: string, mode: TranslationMode, tone: Tone): string {
  return `Translate the following text: "${text}" using the ${mode} mode and the ${tone} tone. Return ONLY the JSON object.`;
}

// --- Gemini Provider ---
async function callGemini(text: string, mode: TranslationMode, tone: Tone): Promise<TranslationResult> {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: getUserPrompt(text, mode, tone),
    config: {
      systemInstruction: getSystemPrompt(mode, tone),
      temperature: 0.8,
      responseMimeType: "application/json",
    },
  });

  const data = JSON.parse(response.text || "{}");
  return {
    translation: data.translation || "I'm speechless. Even I couldn't translate that.",
    cringeScore: data.cringeScore || 0,
    buzzwords: data.buzzwords || [],
    provider: "gemini",
  };
}

// --- Groq Provider ---
async function callGroq(text: string, mode: TranslationMode, tone: Tone): Promise<TranslationResult> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: getSystemPrompt(mode, tone) },
      { role: "user", content: getUserPrompt(text, mode, tone) },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
    max_tokens: 1024,
  });

  const data = JSON.parse(response.choices[0]?.message?.content || "{}");
  return {
    translation: data.translation || "I'm speechless. Even I couldn't translate that.",
    cringeScore: data.cringeScore || 0,
    buzzwords: data.buzzwords || [],
    provider: "groq",
  };
}

// --- Auto-Switch: Gemini first, fallback to Groq ---
export const translateText = async (
  text: string,
  mode: TranslationMode,
  tone: Tone
): Promise<TranslationResult> => {
  // Try Gemini first
  try {
    console.log("🔄 Trying Gemini...");
    const result = await callGemini(text, mode, tone);
    console.log("✅ Gemini succeeded");
    return result;
  } catch (geminiError) {
    console.warn("⚠️ Gemini failed, switching to Groq:", (geminiError as Error).message?.substring(0, 100));
  }

  // Fallback to Groq
  try {
    console.log("🔄 Trying Groq...");
    const result = await callGroq(text, mode, tone);
    console.log("✅ Groq succeeded");
    return result;
  } catch (groqError) {
    console.error("❌ Groq also failed:", (groqError as Error).message?.substring(0, 100));
  }

  // Both failed
  return {
    translation: "Both AI providers are down. Please try again in a minute.",
    cringeScore: 0,
    buzzwords: [],
    provider: "gemini",
  };
};
