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


export const recognizeMeal = async (
  imageUri: string
): Promise<RecognizeMealResponse> => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "meal.jpg",
  } as any);

  
  const response = await fetch("https://api.openai.com/v1/images/recognitions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();


  return {
    name: data.name || "Unknown Meal",
    calories: data.calories || 0,
    protein: data.protein || 0,
    carbs: data.carbs || 0,
    fats: data.fats || 0,
    description: data.description || "",
  };
};
