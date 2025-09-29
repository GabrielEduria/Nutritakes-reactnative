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
const ICON_OPACITY = 0.03;

export default function BackgroundPattern({ children }: { children: React.ReactNode }) {
  // calculate how many rows and columns are needed to cover the screen
  const rows = Math.ceil(height / ICON_SPACING) + 1;
  const cols = Math.ceil(width / ICON_SPACING) + 1;

  const grid = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const icon = icons[(r + c) % icons.length]; // cycle through icons
      grid.push({
        id: id++,
        top: r * ICON_SPACING,
        left: c * ICON_SPACING,
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
          style={[
            styles.icon,
            { top, left, width: ICON_SIZE, height: ICON_SIZE, opacity: ICON_OPACITY },
          ]}
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
  },
  overlay: {
    flex: 1,
  },
});
