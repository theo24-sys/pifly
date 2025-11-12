// src/features/memories/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateSummary = async (content: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate a romantic, poetic 1-sentence summary for this couple's memory: ${content}. Make it heartfelt and magical.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'A beautiful moment captured in our hearts forever 💕';
  }
};