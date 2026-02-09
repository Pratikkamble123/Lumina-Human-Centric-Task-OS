
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "./types";

/**
 * Creates a fresh instance of the AI client.
 * Using a factory function ensures we don't crash at module-load time if process.env is unstable.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const getWeeklySummary = async (tasks: Task[]) => {
  const ai = getAIClient();
  const taskSummary = tasks.map(t => `- ${t.title} (${t.status}, Priority: ${t.priority})`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a natural, human-toned weekly productivity summary for the following task list. 
      Analyze progress, suggest focus areas for next week, and provide a "Burnout Risk" score (0-100) based on task density and priority. 
      Be supportive, clear, and empathetic. 
      Tasks:\n${taskSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            burnoutRisk: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "burnoutRisk", "suggestions", "focusAreas"]
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Summary Error:", error);
    return null;
  }
};

export const getSmartSuggestions = async (tasks: Task[]) => {
  const ai = getAIClient();
  const taskContext = tasks.filter(t => t.status !== 'Done').map(t => t.title).join(', ');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these active tasks: [${taskContext}], suggest 3 sub-tasks or "next logical steps" that would help maintain momentum. Keep them actionable and short.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Smart Suggestions Error:", error);
    return [];
  }
};
