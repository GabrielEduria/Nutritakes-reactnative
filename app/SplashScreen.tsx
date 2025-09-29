import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SplashProps {
  loading?: boolean;
}

export default function SplashScreen({ loading = false }: SplashProps) {
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [logoAnim]);

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
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
          NutriTakes: A Filipino Food Nutritional Content Analysis
        </Animated.Text>

        {loading && (
          <Animated.Text
            style={[styles.text, { marginTop: 20, fontSize: 14 }]}
          >
            Loading...
          </Animated.Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#212121",
  },
});
