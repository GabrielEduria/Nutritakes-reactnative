import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.card}>
      <View style={styles.inlineContainer}>
  
        <PieChart data={pieData} height={140} style={{ width: screenWidth * 0.35 }} />


        <View style={styles.infoContainer}>
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
        </View>
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
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    fontSize: 16,
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
    justifyContent: "space-between",
  },
  macroItem: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  macroLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default MacroSummaryCard;
