// components/BackgroundPattern.tsx
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const icons = [
  require("@/assets/icons/selfie.png"),
  require("@/assets/icons/rice.png"),
  require("@/assets/icons/salad.png"),
];

const ICON_SIZE = 150;
const ICON_SPACING = 280;

export default function BackgroundPattern({ children }: { children?: React.ReactNode }) {
  const rows = Math.ceil(height / ICON_SPACING);
  const cols = Math.ceil(width / ICON_SPACING);

  const grid = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const icon = icons[(row + col) % icons.length]; 
      grid.push({
        id: `${row}-${col}`,
        top: row * ICON_SPACING,
        left: col * ICON_SPACING,
        icon,
      });
    }
  }

  return (
    <View style={styles.container}>
      {grid.map(({ id, top, left, icon }) => (
        <Image
          key={id}
          source={icon}
          style={[styles.icon, { top, left, width: ICON_SIZE, height: ICON_SIZE }]}
          resizeMode="contain"
        />
      ))}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  icon: {
    position: "absolute",
    opacity: 0.03, 
  },
  overlay: {
    flex: 1,
  },
});
