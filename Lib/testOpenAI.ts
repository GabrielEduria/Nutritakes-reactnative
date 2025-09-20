import { Buffer } from "buffer";
import Constants from "expo-constants";
import { OpenAI } from "./openai";
const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function detectMealFromImage(imageUri: string) {
  try {
    // fetch image
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // send to OpenAI
    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Identify this meal and return JSON: name, calories, protein, carbs, fats, description",
            },
            { type: "input_image", image: base64 },
          ],
        },
      ],
    });

    return result.output_text;
  } catch (err) {
    console.error("OpenAI error:", err);
    throw err;
  }
}
