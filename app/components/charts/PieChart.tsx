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
  const screenWidth = Dimensions.get("window").width * 0.8; 

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
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
        hasLegend={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default PieChart;
