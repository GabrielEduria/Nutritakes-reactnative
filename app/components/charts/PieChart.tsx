// components/charts/PieChart.tsx
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart as RNPieChart } from "react-native-chart-kit";

export type PieChartData = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  data: PieChartData[];
  title?: string;
};

const PieChart: React.FC<Props> = ({ data, title }) => {
  const screenWidth = Dimensions.get("window").width * 0.8;

  const chartData = data.map((d) => ({
    name: d.name,
    population: d.value,
    color: d.color,
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNPieChart
        data={chartData}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
    alignItems: "center",
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default PieChart;
