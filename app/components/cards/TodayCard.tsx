import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

type Macros = { protein: number; carbs: number; fats: number; calories: number };

type TodayCardProps = {
  macros: Macros;
  dailyGoal: number;
};

export default function TodayCard({ macros, dailyGoal }: TodayCardProps) {
  const { width } = useWindowDimensions();
  const scale = width / 375; // iPhone X baseline
  const caloriesRemaining = Math.max(dailyGoal - macros.calories, 0);
  const progress = Math.min(macros.calories / dailyGoal, 1) * 100;

  const todayDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={[styles.card, { padding: 16 * scale, borderRadius: 16 * scale }]}>
      <Text style={[styles.header, { fontSize: 18 * scale }]}>
        Today - {todayDate}
      </Text>
      <Text style={[styles.calories, { fontSize: 20 * scale }]}>
        {macros.calories} kcal consumed
      </Text>
      <Text style={[styles.dailyGoal, { fontSize: 14 * scale }]}>
        Daily Goal: {dailyGoal} kcal
      </Text>

      <View style={[styles.progressBackground, { height: 10 * scale }]}>
        <View style={[styles.progressBar, { width: `${progress}%`, height: 10 * scale }]} />
      </View>

      <Text style={[styles.remaining, { fontSize: 12 * scale }]}>
        {caloriesRemaining} kcal remaining
      </Text>

      <View style={styles.macrosRow}>
        <Text style={[styles.macro, { fontSize: 12 * scale }]}>Protein: {macros.protein}g</Text>
        <Text style={[styles.macro, { fontSize: 12 * scale }]}>Carbs: {macros.carbs}g</Text>
        <Text style={[styles.macro, { fontSize: 12 * scale }]}>Fats: {macros.fats}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { fontWeight: "700", marginBottom: 8 },
  calories: { fontWeight: "700", color: "#FF5C00", marginBottom: 4 },
  dailyGoal: { color: "#555", marginBottom: 8 },
  progressBackground: {
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: { backgroundColor: "#FF5C00" },
  remaining: { color: "#555", marginBottom: 12 },
  macrosRow: { flexDirection: "row", justifyContent: "space-between" },
  macro: { color: "#333" },
});
  