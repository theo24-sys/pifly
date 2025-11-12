export interface Memory {
  id: string;
  type: 'photo' | 'voice' | 'text' | 'ai_summary';
  content: string;  // URL for photo/voice, text for others
  timestamp: Date;
  mood: 'happy' | 'romantic' | 'excited' | 'calm';
  generatedBy: 'userA' | 'userB';
  aiSummary?: string;  // Gemini-generated description
}