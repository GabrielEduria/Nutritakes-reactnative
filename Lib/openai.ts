import Constants from "expo-constants";

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
  description?: string;
};

export const recognizeMeal = async (imageUri: string): Promise<RecognizeMealResponse> => {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          type: "input_text",
          content: `
Identify the meal in this image and return a JSON object with the following structure:
{
  "name": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "description": "string"
}
Respond only with JSON, no extra text.
`,
        },
        {
          role: "user",
          type: "input_image",
          content: imageUri,
        },
      ],
    }),
  });

  let data: any;
  try {
    data = await response.json();
  } catch (e) {
    const text = await response.text();
    console.error("OpenAI returned invalid JSON:", text);
    throw new Error("Failed to parse OpenAI response");
  }

  // Extract text content (GPT output) from the API response
  const textOutput = data.output?.[0]?.content?.[0]?.text || "{}";

  // Safely parse JSON
  let meal: RecognizeMealResponse;
  try {
    meal = JSON.parse(textOutput);
  } catch (e) {
    console.error("Failed to parse GPT JSON:", textOutput);
    // fallback
    meal = {
      name: "Unknown Meal",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      description: textOutput,
    };
  }

  return meal;
};
