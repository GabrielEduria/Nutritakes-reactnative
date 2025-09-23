import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const logoAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [logoAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/icon/NT.png")}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: logoAnim,
            transform: [
              {
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        NutriTakes: A Food Nutritional Content Analysis
      </Animated.Text>
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
