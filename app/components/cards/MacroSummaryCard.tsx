import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PieChart, { PieChartData } from "../charts/PieChart";

type Macros = {
  protein: number;
  carbs: number;
  fats: number;
};

type Props = {
  macros: Macros;
  totalCalories: number;
};

const MacroSummaryCard: React.FC<Props> = ({ macros, totalCalories }) => {
  const pieData: PieChartData[] = [
    { name: "Protein", value: macros.protein, color: "#FF6384" },
    { name: "Carbs", value: macros.carbs, color: "#36A2EB" },
    { name: "Fats", value: macros.fats, color: "#FFCE56" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Calorie Budget</Text>
      <Text style={styles.subHeader}>{totalCalories} kcal</Text>

      <PieChart data={pieData} height={240} />

      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{macros.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{macros.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroValue}>{macros.fats}g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  macroItem: {
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MacroSummaryCard;
