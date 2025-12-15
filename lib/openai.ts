import { MealWithId } from "@/types/meal";
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

Carefully analyze the image and do ONE of the following:

1) If the food is a clear Filipino dish:
Return STRICTLY VALID JSON in this EXACT format:
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

2) Otherwise, return EXACTLY ONE of these strings (no punctuation, no extra words):
NOT_FILIPINO
BAD_CAMERA_ANGLE
BLURRY_IMAGE
UNKNOWN_FOOD

Rules:
- Output must be EITHER valid JSON OR one of the exact strings above
- Do NOT include explanations, markdown, or extra text
- Use realistic portion sizes based on Filipino meals
`
              },
              { type: "input_image", image_url: imageDataUrl },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    let textOutputRaw: string = data.output?.[0]?.content?.[0]?.text ?? "";
    let textOutput = textOutputRaw.trim();

    const upperText = textOutput.toUpperCase();
    if (upperText === "NOT_FILIPINO") {
      throw new NotFilipinoFoodError("This does not look like Filipino food. Please scan a Filipino dish.");
    }
    if (upperText === "BAD_CAMERA_ANGLE") {
      throw new NotFilipinoFoodError("Please retake the photo from above with the full plate visible.");
    }
    if (upperText === "BLURRY_IMAGE") {
      throw new NotFilipinoFoodError("The image is blurry. Please retake the photo clearly.");
    }
    if (upperText === "UNKNOWN_FOOD") {
      throw new NotFilipinoFoodError("Food could not be recognized. Try again.");
    }

    let mealData: any;
    try {
      mealData = JSON.parse(textOutput);
    } catch {
      throw new NotFilipinoFoodError("Scanned food could not be recognized as Filipino.");
    }

    if (!mealData.name || mealData.name === "Unknown Meal") {
      throw new NotFilipinoFoodError("Error please scan again!");
    }

    const originalProtein = mealData.protein ?? 0;
    const adjustedProtein =
      originalProtein > 30 ? Math.max(originalProtein - 10, 0) : originalProtein;

    const meal: MealWithId = {
      id: uuidv4(),
      name: mealData.name, 
      calories: mealData.calories ?? 0,
      protein: adjustedProtein,
      carbs: mealData.carbs ?? 0,
      fats: mealData.fats ?? 0,
      fiber: mealData.fiber ?? 0,
      servings: mealData.servings ?? 1,
      description: mealData.description ?? "",
      image_url: imageUri,
      created_at: new Date().toISOString(),
    };

    return meal;

  } catch (err) {
    if (__DEV__) console.warn("OpenAI recognizeMeal handled error:", err);

    if (err instanceof NotFilipinoFoodError) throw err;

    throw new NotFilipinoFoodError("An unexpected error occurred while scanning. Try again.");
  }
};
