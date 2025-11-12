// services/geminiService.ts
export const generateWorld = async (prompt: string) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  return response.json();
};