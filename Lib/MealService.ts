import { NutritionInfo } from "@/app/components/cards/NutritionLabelCard";
import { supabase } from "@/lib/supabase";

export async function saveMeal(userId: string, meal: NutritionInfo) {
  const { error } = await supabase.from("meals").insert([
    {
      user_id: userId, 
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      fiber: meal.fiber,
      servings: meal.servings,
      description: meal.description,
    },
  ]);

  if (error) throw error;
}

export async function getMeals(userId: string) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
