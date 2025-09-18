import { Meal } from "@/app/data/meal";
import { getAuth } from "firebase/auth";
import { uploadFileToStorage } from "./firebaseHelpers";
import { addMeal } from "./MealService";
import { recognizeMeal, RecognizeMealResponse } from "./OpenAi";

export const ScanAndSaveMeal = async (localUri: string): Promise<Meal> => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  // 1️⃣ Upload image first
  const storagePath = `profiles/${user.uid}/meals/${Date.now()}.jpg`;
  let imageUrl: string;
  try {
    imageUrl = await uploadFileToStorage(storagePath, localUri);
    console.log("Image uploaded to Firebase Storage:", imageUrl);
  } catch (err) {
    console.error("Firebase Storage upload failed:", err);
    throw new Error("Failed to upload image to Firebase");
  }

  // 2️⃣ Recognize meal using GPT with public URL
  let recognized: RecognizeMealResponse;
  try {
    recognized = await recognizeMeal(imageUrl);
    console.log("GPT Recognized Meal JSON:", recognized);
  } catch (err) {
    console.error("GPT recognition failed:", err);
    recognized = {
      name: "Unknown Meal",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      description: "",
    };
  }

  // 3️⃣ Create Meal object
  const newMeal: Meal = {
    name: recognized.name,
    description: recognized.description,
    calories: recognized.calories,
    protein: recognized.protein,
    carbs: recognized.carbs,
    fats: recognized.fats,
    servings: 1,
    image: imageUrl,
  };

  // 4️⃣ Save to Firestore
  try {
    await addMeal(newMeal);
  } catch (err) {
    console.error("Failed to save meal to Firestore:", err);
    throw new Error("Failed to save meal");
  }

  return newMeal;
};
