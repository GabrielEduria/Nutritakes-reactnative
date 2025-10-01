import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import RadarChart, { RadarChartData } from "../charts/RadarChart";

type Macros = {
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
};

type Props = {
  macros: Macros;
  totalCalories: number;
};

const MacroSummaryCard: React.FC<Props> = ({ macros, totalCalories }) => {
  const radarLabels = ["Protein", "Carbs", "Fats", "Fiber"];
  const radarValues = [
    macros.protein,
    macros.carbs,
    macros.fats,
    macros.fiber || 0,
  ];

  const macroItems = [
    { label: "Protein", value: macros.protein },
    { label: "Carbs", value: macros.carbs },
    { label: "Fats", value: macros.fats },
    { label: "Fiber", value: macros.fiber || 0 },
  ];

  // Radar chart data object
  const radarData: RadarChartData & { strokeColor?: string } = {
    labels: radarLabels,
    values: radarValues,
    color: "rgba(255,92,0,0.4)", // FF5C00 fill
    strokeColor: "#FF5C00",      // FF5C00 stroke
  };

  return (
    <View style={{ width: "100%" }}>
      {/* Daily Food Log header outside the card */}
      <Text style={styles.logHeader}>Daily Food Log</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Daily Macro Summary</Text>
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

        <View style={styles.chartContainer}>
          <RadarChart
            data={radarData}
            size={Dimensions.get("window").width * 0.8}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20, // increased padding to avoid cutoff
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
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  macroItem: { alignItems: "center", width: 70 },
  macroLabel: { fontSize: 14, fontWeight: "600", color: "#333", textAlign: "center" },
  macroValue: { fontSize: 14, fontWeight: "700", color: "#FF5C00", textAlign: "center" },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});

export default MacroSummaryCard;
