import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function MoreSection({
  darkMode,
  onToggleDarkMode,
  onHistory,
}: {
  darkMode: boolean;
  onToggleDarkMode: (v: boolean) => void;
  onHistory: () => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onHistory}>
        <Text style={styles.text}>Meal History</Text>
      </TouchableOpacity>
      <View style={[styles.button, { flexDirection: "row", justifyContent: "space-between" }]}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={onToggleDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", width: "90%", marginBottom: 20, justifyContent: "space-between" },
  button: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
