import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type TranslationMode = "toReality" | "toLinkedIn";
export type Tone = "brutallyHonest" | "sarcastic" | "hustleCulture" | "corporateOverlord" | "passiveAggressive";

export interface TranslationResult {
  translation: string;
  cringeScore: number;
  buzzwords: string[];
}

export const translateText = async (text: string, mode: TranslationMode, tone: Tone): Promise<TranslationResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstructions = {
    toReality: `You are a "LinkedIn Reality Check" bot. Your job is to take over-dramatized, jargon-heavy LinkedIn posts and translate them into the simple, mundane action that actually occurred, but with a witty, relatable, and slightly unimpressed twist.
    
    You must return a JSON object with the following fields:
    - translation: The brief (under 12 words) witty reality check.
    - cringeScore: A number from 0 to 100 representing how "cringey" or "corporate" the original text is.
    - buzzwords: An array of the specific corporate buzzwords found in the text.
    
    Focus on the factual event, but phrase it in a way that mocks the self-importance of the original post. Use dry humor.`,
    
    toLinkedIn: `You are a "Corporate Jargon Generator". Your job is to take simple, everyday tasks and turn them into epic, world-changing LinkedIn milestones.
    
    You must return a JSON object with the following fields:
    - translation: The over-the-top LinkedIn post.
    - cringeScore: A number from 0 to 100 representing how much "LinkedIn energy" this new post has.
    - buzzwords: An array of the buzzwords you added to make it sound professional.
    
    Tone: ${tone}.`
  };

  const prompt = `Translate the following text: "${text}" using the ${mode} mode and the ${tone} tone. Return ONLY the JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemInstructions[mode],
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
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
