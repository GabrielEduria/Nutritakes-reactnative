
import { supabase } from "@/lib/supabase";
import { MealWithId } from "@/types/meal";

/**
 * Save a meal to Supabase for each auth'dd users
 * @param meal 
 */
export async function saveMeal(meal: MealWithId) {
  const { data } = await supabase.auth.getSession();
  const userId = data?.session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("meals")
    .insert([{ ...meal, user_id: userId }]);

  if (error) throw error;
  return true;
}

/**
 * Delete a meal by ID each auth'dd user
 * @param mealId string
 */
export async function deleteMeal(mealId: string) {
  const { data } = await supabase.auth.getSession();
  const userId = data?.session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}
