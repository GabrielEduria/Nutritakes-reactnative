import { Meal } from "@/app/data/meal";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type NutritionLabelCardProps = {
  meal: Meal;
};

const NutritionLabelCard: React.FC<NutritionLabelCardProps> = ({ meal }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nutrition Facts</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{meal.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Calories:</Text>
        <Text style={styles.value}>{meal.calories} kcal</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Protein:</Text>
        <Text style={styles.value}>{meal.protein} g</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Carbs:</Text>
        <Text style={styles.value}>{meal.carbs} g</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Fats:</Text>
        <Text style={styles.value}>{meal.fats} g</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Servings:</Text>
        <Text style={styles.value}>{meal.servings}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
  },
});

export default NutritionLabelCard;
