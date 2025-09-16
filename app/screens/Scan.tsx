// app/screens/Scan.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Scan() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan Screen - Capture Dish for Recognition</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "600", textAlign: "center" },
});
