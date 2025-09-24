import PieChart, { PieChartData } from "@/app/components/charts/PieChart";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DashboardProps = {
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
};

const Dashboard: React.FC<DashboardProps> = ({ macros }) => {
  const chartData: PieChartData[] = [
    { name: "Protein", value: macros?.protein || 0, color: "#FF6384" },
    { name: "Carbs", value: macros?.carbs || 0, color: "#36A2EB" },
    { name: "Fats", value: macros?.fats || 0, color: "#FFCE56" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Daily Macros Summary</Text>

      <PieChart data={chartData} title="Macros Breakdown" />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Protein: {macros?.protein || 0} g</Text>
        <Text style={styles.summaryText}>Carbs: {macros?.carbs || 0} g</Text>
        <Text style={styles.summaryText}>Fats: {macros?.fats || 0} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  summary: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 16,
  },
  summaryText: {
    fontSize: 14,
    marginVertical: 2,
    color: "#333",
  },
});

export default Dashboard;
