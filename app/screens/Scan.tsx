import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import DishCard from "../components/DishCard";
import NutritionCard from "../components/NutritionCard";

export default function Scan() {
  // Example placeholder data
  const dish = {
    name: "Adobo",
    image: "https://example.com/adobo.jpg",
    description: "A classic Filipino chicken adobo with garlic and soy sauce.",
    nutrition: { calories: 350, protein: 25, carbs: 10, fat: 20 },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DishCard name={dish.name} image={dish.image} description={dish.description} />
      <NutritionCard {...dish.nutrition} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
