import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  isHalal: boolean;
  isVeg: boolean;
  freshnessScore: number; // 1-10
  safetyCheck: boolean;
  tags: string[];
}

export const analyzeFoodImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini");
    // Return mock data if no key for demo purposes
    return {
      title: "Detected Food Item",
      description: "AI analysis unavailable (Missing Key). Please fill details manually.",
      category: "Unknown",
      isHalal: false,
      isVeg: false,
      freshnessScore: 8,
      safetyCheck: true,
      tags: ["Pending"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, can detect from file
              data: base64Image
            }
          },
          {
            text: `Analyze this food image for a food sharing app. 
            Identify the food, suggest a title, short description, category (e.g., Rice, Pasta, Bakery, Fruit, Veg, Meat), 
            determine if it looks vegetarian/halal based on visual ingredients, 
            estimate a freshness score (1-10), check if it looks safe to eat (no mold/rot), 
            and provide 3 tags.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            isHalal: { type: Type.BOOLEAN },
            isVeg: { type: Type.BOOLEAN },
            freshnessScore: { type: Type.NUMBER },
            safetyCheck: { type: Type.BOOLEAN },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
