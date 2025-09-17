import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart as RNPieChart } from "react-native-chart-kit";

export type PieChartData = {
  name: string; 
  value: number;
  color: string;
};

type PieChartProps = {
  data: PieChartData[];
  title?: string;
};

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const screenWidth = Dimensions.get("window").width - 40; 
  
  const chartData = data.map((d) => ({
    name: d.name,
    population: d.value,
    color: d.color,
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNPieChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: () => "#fff",
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
});

export default PieChart;
