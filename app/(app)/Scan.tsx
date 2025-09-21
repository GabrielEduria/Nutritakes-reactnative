import { recognizeMeal } from "@/lib/openai";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NutritionLabelCard, { NutritionInfo } from "../components/cards/NutritionLabelCard";

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<NutritionInfo | null>(null);

  const pickImage = async (fromGallery = false) => {
    const permission = fromGallery
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted)
      return Alert.alert("Permission required", "Camera or Gallery access required");

    const result = fromGallery
      ? await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      analyzeMeal(uri);
    }
  };

  const analyzeMeal = async (uri: string) => {
    setLoading(true);
    setMeal(null);
    try {
      const detectedMeal = await recognizeMeal(uri);
      setMeal(detectedMeal);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "OpenAI failed to detect meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Scan a Meal</Text>

        <Text style={styles.subtitle}>
          Snap a photo or upload one to analyze its nutrition instantly.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 30 }} />
        )}

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        )}

        {meal && (
          <View style={{ width: "100%", marginTop: 25 }}>
            <NutritionLabelCard meal={meal} />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0d0d0d",
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 14,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});
