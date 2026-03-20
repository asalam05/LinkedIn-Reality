import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
});

export type TranslationMode = "toReality" | "toLinkedIn";
export type Tone = "brutallyHonest" | "sarcastic" | "hustleCulture" | "corporateOverlord" | "passiveAggressive";

export interface TranslationResult {
  translation: string;
  cringeScore: number;
  buzzwords: string[];
}

const systemInstructions: Record<string, string | ((tone: Tone) => string)> = {
  toReality: `You are a "LinkedIn Reality Check" bot. Your job is to take over-dramatized, jargon-heavy LinkedIn posts and translate them into the simple, mundane action that actually occurred, but with a witty, relatable, and slightly unimpressed twist.
    
  You must return a JSON object with the following fields:
  - translation: The brief (under 12 words) witty reality check.
  - cringeScore: A number from 0 to 100 representing how "cringey" or "corporate" the original text is.
  - buzzwords: An array of the specific corporate buzzwords found in the text.
    
  Focus on the factual event, but phrase it in a way that mocks the self-importance of the original post. Use dry humor.
  
  IMPORTANT: Return ONLY a valid JSON object, no other text.`,
    
  toLinkedIn: (tone: Tone) => `You are a "Corporate Jargon Generator". Your job is to take simple, everyday tasks and turn them into epic, world-changing LinkedIn milestones.
    
  You must return a JSON object with the following fields:
  - translation: The over-the-top LinkedIn post.
  - cringeScore: A number from 0 to 100 representing how much "LinkedIn energy" this new post has.
  - buzzwords: An array of the buzzwords you added to make it sound professional.
    
  Tone: ${tone}.
  
  IMPORTANT: Return ONLY a valid JSON object, no other text.`
};

export const translateText = async (
  text: string, 
  mode: TranslationMode, 
  tone: Tone
): Promise<TranslationResult> => {
  const systemPrompt = mode === "toReality" 
    ? systemInstructions.toReality as string
    : (systemInstructions.toLinkedIn as (tone: Tone) => string)(tone);

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Translate the following text: "${text}". Return ONLY the JSON object.` }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
      max_tokens: 1024,
    });

    const data = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      translation: data.translation || "I'm speechless. Even I couldn't translate that.",
      cringeScore: data.cringeScore || 0,
      buzzwords: data.buzzwords || []
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      translation: "The corporate firewall blocked me. (Error translating text)",
      cringeScore: 0,
      buzzwords: []
    };
  }
};
