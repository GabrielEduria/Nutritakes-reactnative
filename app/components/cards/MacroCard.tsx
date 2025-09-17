import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Meal } from "../../data/meal";
import PieChart, { PieChartData } from "../charts/PieChart";

type MacroCardProps = {
  meal: Meal;
};

const MacroCard: React.FC<MacroCardProps> = ({ meal }) => {
  const chartData: PieChartData[] = [
    { name: "Protein", value: meal.protein, color: "#4caf50" },
    { name: "Carbs", value: meal.carbs, color: "#2196f3" },
    { name: "Fats", value: meal.fats, color: "#ff9800" },
  ];

  return (
    <View style={styles.container}>
      <Image source={{ uri: meal.image }} style={styles.image} />
      <Text style={styles.name}>{meal.name}</Text>
      <Text style={styles.calories}>{meal.calories} kcal</Text>
      <PieChart data={chartData} title="Macros" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
});

export default MacroCard;
