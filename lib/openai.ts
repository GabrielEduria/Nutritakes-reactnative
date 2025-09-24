import { MealWithId } from "@/app/(app)/Profile";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import { v4 as uuidv4 } from "uuid";

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing. Check your .env and app.config.js");
}

export class NotFilipinoFoodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFilipinoFoodError";
  }
}

async function uriToBase64DataUrl(uri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
  return `data:image/jpeg;base64,${base64}`;
}

export const recognizeMeal = async (imageUri: string): Promise<MealWithId> => {
  const imageDataUrl = await uriToBase64DataUrl(imageUri);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
                  You are a Filipino cuisine nutrition expert with detailed knowledge of Filipino dishes, ingredients, and protein sources.
                  Carefully analyze the image and identify ONLY Filipino dishes. Include the specific meat or protein in the dish.
                  Your response MUST be strictly valid JSON in this exact format:
                  {
                    "name": "string",
                    "calories": number,
                    "protein": number,
                    "carbs": number,
                    "fats": number,
                    "fiber": number,
                    "servings": number,
                    "description": "string"
                  }
                  If the dish is NOT Filipino, respond exactly with "NOT A FILIPINO DISH".
                  Guidelines:
                  - Include multiple items if present.
                  - Prioritize Filipino dishes over generic or non-local foods.
                  - Do not include explanations, extra text, or code blocks — only valid JSON or NOT A FILIPINO DISH.
                  - Use realistic portion sizes and nutritional estimates based on standard Filipino meals.
                `
              },
              { type: "input_image", image_url: imageDataUrl },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    let textOutput: string = data.output?.[0]?.content?.[0]?.text || "{}";
    textOutput = textOutput.replace(/```json|```/gi, "").trim();

    if (textOutput.toUpperCase() === "NOT A FILIPINO DISH") {
      throw new NotFilipinoFoodError("This food is not Filipino.");
    }

    const mealData = JSON.parse(textOutput);

    const meal: MealWithId = {
      id: uuidv4(),
      name: mealData.name || "Unknown Meal",
      calories: mealData.calories ?? 0,
      protein: mealData.protein ?? 0,
      carbs: mealData.carbs ?? 0,
      fats: mealData.fats ?? 0,
      fiber: mealData.fiber ?? 0,
      servings: mealData.servings ?? 1,
      description: mealData.description ?? "",
      image_url: imageUri,
    };

    return meal;

  } catch (err) {
    console.error("OpenAI recognizeMeal error:", err);
    if (err instanceof NotFilipinoFoodError) throw err;

    return {
      id: uuidv4(),
      name: "Unknown Meal",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      servings: 1,
      description: "Failed to analyze meal",
      image_url: imageUri,
    };
  }
};
