import { supabase } from "@/lib/supabase";

export type Meal = {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servings?: number;
  description?: string;
  image_url?: string;
  timestamp?: string;
};

// Add meal with optional image
export async function addMeal(meal: Meal, firebaseUid: string) {
  const { data, error } = await supabase
    .from("meals")
    .insert([{ ...meal, user_id: firebaseUid }])
    .select();

  if (error) throw error;
  return data[0];
}

// Get meals for a Firebase UID
export async function getMeals(firebaseUid: string) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", firebaseUid)
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data;
}


export async function deleteMeal(mealId: string, firebaseUid: string) {
  const { data, error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", firebaseUid);

  if (error) throw error;
  return data;
}
