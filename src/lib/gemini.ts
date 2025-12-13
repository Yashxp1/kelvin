import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function Gemini(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You prepare complete updated source files for GitHub pull requests. Never output partial code. Never output reasoning.',
        temperature: 0.2,
      },
    });
    return response;
  } catch (error) {
    console.error('Error in Gemini:', error);
    return null;
  }
}
