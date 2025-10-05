import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import RadarChart, { RadarChartData } from "../charts/RadarChart";

type Macros = {
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  calories: number;
};

type Props = {
  macros: Macros;
  totalCalories: number;
  weeklyScore?: number;
};

const MacroSummaryCard: React.FC<Props> = ({ macros, totalCalories, weeklyScore }) => {
  const { width } = useWindowDimensions();


  const chartSize = Math.min(Math.max(width * 0.7, 160), 240);

  const radarLabels = ["Protein", "Carbs", "Fats", "Fiber"];
  const radarValues = [macros.protein, macros.carbs, macros.fats, macros.fiber || 0];

  const macroItems = [
    { label: "Calories", value: macros.calories },
    { label: "Protein", value: macros.protein },
    { label: "Carbs", value: macros.carbs },
    { label: "Fats", value: macros.fats },
    { label: "Fiber", value: macros.fiber || 0 },
  ];

  const radarData: RadarChartData = {
    labels: radarLabels,
    values: radarValues,
    color: "rgba(255,92,0,0.4)",
    strokeColor: "#FF5C00",
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.progressHeader}>Weekly Progress</Text>
        {weeklyScore !== undefined && (
          <Text style={styles.scoreText}>Weekly Food Score: {weeklyScore}/100</Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Weekly Macro Summary</Text>
          <Text style={styles.subHeader}>{totalCalories} kcal</Text>
        </View>

        <View style={styles.macroRow}>
          {macroItems.map((item) => (
            <View key={item.label} style={styles.macroItem}>
              <Text style={styles.macroLabel}>{item.label}</Text>
              <Text style={styles.macroValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.chartContainer, { height: chartSize + 30 }]}>
          <RadarChart data={radarData} size={chartSize} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginLeft: 4,
    marginTop: 10,
  },
  progressHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0d0d0d",
  },
  scoreText: {
    fontSize: 16,
    color: "#FF5C00",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  header: { fontSize: 16, fontWeight: "700", color: "#FF5C00" },
  subHeader: { fontSize: 14, color: "#666" },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  macroItem: {
    alignItems: "center",
    width: "20%",
    marginVertical: 4,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF5C00",
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    overflow: "visible",
  },
});

export default MacroSummaryCard;
