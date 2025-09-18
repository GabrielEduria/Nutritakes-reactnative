import { scanAndSaveMeal } from "@/Lib/scanMeal";
import { Meal } from "@/app/data/meal";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onMealSaved?: (meal: Meal) => void;
};

export default function Scan({ onMealSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);

  const pickImage = async (fromGallery = false) => {
    const permission = fromGallery
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert(
        "Permission required",
        fromGallery ? "Gallery access is required" : "Camera access is required"
      );
    }

    const result = fromGallery
      ? await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    setLoading(true);
    try {
      const newMeal = await scanAndSaveMeal(uri);
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
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Scan a Meal</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        {meal && (
          <View style={styles.mealCard}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealDesc}>{meal.description}</Text>
            <Text>Calories: {meal.calories}</Text>
            <Text>Protein: {meal.protein}g</Text>
            <Text>Carbs: {meal.carbs}g</Text>
            <Text>Fats: {meal.fats}g</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingTop: 20, paddingBottom: 40, alignItems: "center", width: "100%" },

  sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  previewImage: { width: 250, height: 250, marginTop: 20, borderRadius: 12 },

  mealCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    marginTop: 20,
    elevation: 2,
  },
  mealName: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  mealDesc: { fontSize: 14, color: "#555", marginBottom: 8 },
});
