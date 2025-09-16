// app/components/NutritionCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type NutritionCardProps = {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
};

export default function NutritionCard({ calories, protein, carbs, fat }: NutritionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nutrition Facts</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Calories:</Text>
        <Text style={styles.value}>{calories} kcal</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Protein:</Text>
        <Text style={styles.value}>{protein} g</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Carbs:</Text>
        <Text style={styles.value}>{carbs} g</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Fat:</Text>
        <Text style={styles.value}>{fat} g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  label: { fontSize: 16, color: "#555" },
  value: { fontSize: 16, fontWeight: "600" },
});
