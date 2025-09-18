import { Meal } from "@/app/data/meal";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";


export const addMeal = async (meal: Omit<Meal, "timestamp">) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const mealsCol = collection(db, `profiles/${user.uid}/meals`);

  await addDoc(mealsCol, {
    ...meal,
    timestamp: serverTimestamp(), 
  });
};


export const getMeals = async (): Promise<Meal[]> => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const mealsCol = collection(db, `profiles/${user.uid}/meals`);
  const snapshot = await getDocs(mealsCol);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      name: data.name,
      image: data.image,
      description: data.description || "",
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats,
      servings: data.servings,
      timestamp: data.timestamp
        ? (data.timestamp as Timestamp).toDate()
        : new Date(),
    } as Meal;
  });
};


export const deleteMeal = async (mealId: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const mealRef = doc(db, `profiles/${user.uid}/meals/${mealId}`);
  await deleteDoc(mealRef);
};
