import { Meal } from "@/app/data/meal";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ActionsSectionProps = {
  meals: Meal[];
};

export default function ActionsSection({ meals }: ActionsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealDesc}>{meal.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No meals logged yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  mealCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  mealName: { fontSize: 16, fontWeight: "700" },
  mealDesc: { fontSize: 14, color: "#555" },
  emptyText: { fontSize: 16, color: "#777" },
});
