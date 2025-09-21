import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing. Check your .env and app.config.js");
}

export type RecognizeMealResponse = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  servings?: number;
  description?: string;
  isFilipino: boolean;
};

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

export const recognizeMeal = async (imageUri: string): Promise<RecognizeMealResponse> => {
  const imageDataUrl = await uriToBase64DataUrl(imageUri);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: 
                `
                  You are a Filipino cuisine macro expert. Identify ONLY the Filipino food in this image. 
                  Also identify the type of meat and dish if possible. 
                  Return valid JSON ONLY:
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
                  If the food is NOT Filipino, respond with "NOT_FILIPINO".
                  Respond ONLY with JSON or NOT_FILIPINO.
                `,
              },
              {
                type: "input_image",
                image_url: imageDataUrl,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    let textOutput: string = data.output?.[0]?.content?.[0]?.text || "{}";

    textOutput = textOutput.replace(/```json|```/gi, "").trim();

    if (textOutput.toUpperCase() === "NOT_FILIPINO") {
      throw new NotFilipinoFoodError("This food is not Filipino.");
    }

    let meal: RecognizeMealResponse;
    try {
      meal = JSON.parse(textOutput);
      meal.isFilipino = true; 
    } catch (err) {
      console.error("Failed to parse GPT JSON:", textOutput, err);
      throw new Error("Failed to parse GPT JSON.");
    }

    if (meal.protein !== undefined && meal.protein > 0) {
      meal.protein = Math.max(0, meal.protein - meal.protein / 2);
    }

    return meal;

  } catch (err) {
    console.error("OpenAI recognizeMeal error:", err);
    if (err instanceof NotFilipinoFoodError) throw err;

    return {
      name: "Unknown Meal",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      servings: 1,
      description: "Failed to analyze meal",
      isFilipino: false
    };
  }
};
