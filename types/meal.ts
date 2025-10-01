export type MealWithId = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  servings?: number;
  description?: string;
  image_url?: string;
  created_at: string;
  feedback?: string; 
};
