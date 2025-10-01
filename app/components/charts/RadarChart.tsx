import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

export type RadarChartData = {
  labels: string[];
  values: number[];
  targetValues?: number[]; 
  maxValue?: number;
  color?: string;
};

type Props = {
  data: RadarChartData;
  size?: number;
};

const RadarChart: React.FC<Props> = ({ data, size = 180 }) => {
  const { labels, values, targetValues, maxValue, color = "#FF638455" } = data;
  const N = labels.length;
  const center = size / 2;
  const radius = center * 0.8;
  const maxVal = maxValue ?? Math.max(...values, ...(targetValues || []), 1);


  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (v / maxVal) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  });


  const targetPoints = targetValues?.map((v, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const r = (v / maxVal) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  });

  const levels = 4;
  const gridCircles = Array.from({ length: levels }, (_, i) => (
    <Circle
      key={i}
      cx={center}
      cy={center}
      r={((i + 1) / levels) * radius}
      stroke="#ccc"
      strokeWidth={0.5}
      fill="none"
    />
  ));

  const axes = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return <Line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#ccc" strokeWidth={0.5} />;
  });

  const labelElements = labels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    const x = center + (radius + 14) * Math.cos(angle);
    const y = center + (radius + 14) * Math.sin(angle);
    return (
      <SvgText
        key={i}
        x={x}
        y={y}
        fill="#333"
        fontSize="12"
        fontWeight="600"
        textAnchor={x > center ? "start" : x < center ? "end" : "middle"}
        alignmentBaseline={y > center ? "hanging" : y < center ? "baseline" : "middle"}
      >
        {label}
      </SvgText>
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {gridCircles}
        {axes}
        {targetPoints && (
          <Polygon
            points={targetPoints.join(" ")}
            fill="rgba(200,200,200,0.2)"
            stroke="rgba(200,200,200,0.2)"
            strokeWidth={1}
          />
        )}
        <Polygon points={points.join(" ")} fill={color} stroke={color.replace("55", "")} strokeWidth={2} />
        {labelElements}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
});

export default RadarChart;
