import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Macros = { protein: number; carbs: number; fats: number; calories: number };

type TodayCardProps = {
  macros: Macros;
  dailyGoal: number;
};

export default function TodayCard({ macros, dailyGoal }: TodayCardProps) {
  const caloriesRemaining = Math.max(dailyGoal - macros.calories, 0);
  const progress = Math.min(macros.calories / dailyGoal, 1) * 100;

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Today - {todayDate}</Text>
      <Text style={styles.calories}>{macros.calories} kcal consumed</Text>
      <Text style={styles.dailyGoal}>Daily Goal: {dailyGoal} kcal</Text>

      <View style={styles.progressBackground}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.remaining}>{caloriesRemaining} kcal remaining</Text>

      <View style={styles.macrosRow}>
        <Text style={styles.macro}>Protein: {macros.protein}g</Text>
        <Text style={styles.macro}>Carbs: {macros.carbs}g</Text>
        <Text style={styles.macro}>Fats: {macros.fats}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  calories: { fontSize: 20, fontWeight: "700", color: "#FF5C00", marginBottom: 4 },
  dailyGoal: { fontSize: 14, color: "#555", marginBottom: 8 },
  progressBackground: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: { height: 10, backgroundColor: "#FF5C00" },
  remaining: { fontSize: 12, color: "#555", marginBottom: 12 },
  macrosRow: { flexDirection: "row", justifyContent: "space-between" },
  macro: { fontSize: 12, color: "#333" },
});
