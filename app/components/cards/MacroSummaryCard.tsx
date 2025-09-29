import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import RadarChart from "../charts/RadarChart";

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


  return (
    <View style={styles.card}>
      <Text style={styles.header}>Calorie Budget</Text>
      <Text style={styles.subHeader}>{totalCalories} kcal</Text>

      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: "#FF6384" }]}>Protein</Text>
          <Text style={styles.macroValue}>{macros.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: "#36A2EB" }]}>Carbs</Text>
          <Text style={styles.macroValue}>{macros.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: "#FFCE56" }]}>Fats</Text>
          <Text style={styles.macroValue}>{macros.fats}g</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <RadarChart
          data={{
            labels: ["Protein", "Carbs", "Fats"],
            values: [macros.protein, macros.carbs, macros.fats],
            color: "rgba(255,92,0,0.4)",
          }}
          size={Dimensions.get("window").width * 0.8}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  header: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  subHeader: { fontSize: 14, color: "#666", marginBottom: 12 },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  macroItem: { alignItems: "center" },
  macroLabel: { fontSize: 14, fontWeight: "600" },
  macroValue: { fontSize: 14, fontWeight: "700" },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});

export default MacroSummaryCard;
