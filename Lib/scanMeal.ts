import { Meal } from "@/app/data/meal";
import { getAuth } from "firebase/auth";
import { uploadFileToStorage } from "./firebaseHelpers";
import { addMeal } from "./MealService";
import { recognizeMeal, RecognizeMealResponse } from "./openai";


export const scanAndSaveMeal = async (imageUri: string): Promise<Meal> => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const recognized: RecognizeMealResponse = await recognizeMeal(imageUri);

 
  const storagePath = `profiles/${user.uid}/meals/${Date.now()}.jpg`;
  const imageUrl = await uploadFileToStorage(storagePath, imageUri);

 
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


  await addMeal(newMeal);

  return newMeal;
};
