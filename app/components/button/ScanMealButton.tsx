import { recognizeMeal } from "@/lib/openai";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NutritionInfo } from "../cards/NutritionLabelCard";

type Props = {
  onMealSaved?: (meal: NutritionInfo) => void;
};

export default function ScanMealButton({ onMealSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<NutritionInfo | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Camera permission is required!");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    setLoading(true);
    try {
      const newMeal = await recognizeMeal(uri);
      setMeal(newMeal);
      if (onMealSaved) onMealSaved(newMeal);
      Alert.alert("Meal saved!", `Logged ${newMeal.name}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to process meal. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Scanning..." : "Scan"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 15 }} />}

      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

      {meal && (
        <View style={styles.mealCard}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text>Calories: {meal.calories}</Text>
          <Text>Protein: {meal.protein}g</Text>
          <Text>Carbs: {meal.carbs}g</Text>
          <Text>Fats: {meal.fats}g</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", marginVertical: 20 },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  previewImage: {
    width: 220,
    height: 220,
    marginVertical: 15,
    borderRadius: 14,
  },
  mealCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    width: "90%",
    marginTop: 10,
    elevation: 3,
  },
  mealName: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
});
