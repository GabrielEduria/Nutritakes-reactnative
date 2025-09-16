import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon/NT.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        NutriTakes: A Food Nutritional Content Analysis
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDD0", 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
