import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function Gemini(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a helpful assistant that can answer questions about a given text.',
      },
    });
    return response;
  } catch (error) {
    console.error('Error in Gemini:', error);
    return null;
  }
}
