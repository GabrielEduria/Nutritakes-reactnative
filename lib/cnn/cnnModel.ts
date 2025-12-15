import { MealWithId } from '@/types/meal';

export async function predictDish(image: string): Promise<MealWithId> {

  return {
    id: 'cnn-' + Date.now(),
    name: "Adobo",
    calories: 350,
    protein: 20,
    carbs: 15,
    fats: 25,
    fiber: 3,
    servings: 1,
    description: "A traditional Filipino dish for documentation purposes",
    image_url: image,
    created_at: new Date().toISOString(),
  };
}