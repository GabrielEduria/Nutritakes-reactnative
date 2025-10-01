import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import 'react-native-get-random-values';

import NutritionLabelCard from "@/app/components/cards/NutritionLabelCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import SuccessModal from "@/app/components/modals/SuccessModal";
import { saveMeal } from "@/lib/MealService";
import { NotFilipinoFoodError, recognizeMeal } from "@/lib/openai";
import { MealWithId } from "@/types/meal";
import BackgroundPattern from "../components/background/BackgroundPattern";

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<MealWithId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pickImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return setError("Gallery permission is required!");

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processImage(uri);
    }
  };

  const openCamera = async () => {
    setError(null);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return setError("Camera permission is required!");

    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    setLoading(true);
    setMeal(null);
    setError(null);
    setSuccess(null);

    try {
      const detectedMeal = await recognizeMeal(uri);
      setMeal(detectedMeal);
    } catch (err) {
      if (err instanceof NotFilipinoFoodError) {
        setError(err.message); 
      } else {
        console.error(err);
        setError("Failed to recognize meal. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!meal) return;
    setLoading(true);
    try {
      await saveMeal(meal);
      setSuccess(`Meal saved! Logged ${meal.name}`);
      setMeal(null);
      setImageUri(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save meal. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <BackgroundPattern>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Scan Your Meal</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={openCamera}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{"Open Camera"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={pickImage}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Analyzing..." : "Pick from Gallery"}</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 20 }} />}
          {imageUri && !meal && !loading && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          {meal && (
            <View style={styles.cardWrapper}>
              <NutritionLabelCard meal={meal} />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          )}

          <ErrorModal
            visible={!!error}
            message={error ?? "Scanned food failed. Please try again!"}
            onClose={() => {
              setError(null);
              setMeal(null);
              setImageUri(null);
            }}
          />

          <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
          <View style={{ height: 100 }} />
        </ScrollView>
      </BackgroundPattern>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingTop: 20, paddingBottom: 40, alignItems: "center", width: "100%" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#212121" },

  actions: {
    width: "90%",
    marginTop: 10,
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  previewImage: { width: 240, height: 240, borderRadius: 16, marginVertical: 20 },
  cardWrapper: { width: "90%", alignItems: "center", marginTop: 20 },

  saveButton: {
    marginTop: 12,
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
