import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function Gemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an AI developer that prepares pull requests. Given a task, output the exact file changes needed and a clear PR title and description. Do not include reasoning or commentary.',
    },
  });

  return response;
}

