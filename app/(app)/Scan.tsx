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
  useWindowDimensions,
  View,
} from "react-native";
import "react-native-get-random-values";

import NutritionLabelCard from "@/app/components/cards/NutritionLabelCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import SuccessModal from "@/app/components/modals/SuccessModal";
import { predictDish as cnnPredictDish } from "@/lib/cnn/cnnModel";
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
  const { width } = useWindowDimensions();

  const pickImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return setError("Gallery permission is required!");

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
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
    setMeal(null);
    setError(null);
    setSuccess(null);

    try {
      const cnnResult = await cnnPredictDish(uri);
      console.log("CNN prediction (fake):", cnnResult);

      const detectedMeal = await recognizeMeal(uri);

      // ✅ Attach the image URI to the detected meal
      const mealWithImage: MealWithId = {
        ...detectedMeal,
        image_url: uri,
      };

      setMeal(mealWithImage);
    } catch (err) {
      if (err instanceof NotFilipinoFoodError) {
        setError(err.message);
      } else {
        if (__DEV__) console.error("Scan processImage error:", err);
        setError("Failed to recognize meal. Please try again.");
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
      if (__DEV__) console.error("Save meal error:", err);
      setError("Failed to save meal. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSmallScreen = width < 380;
  const containerWidth = isSmallScreen ? "90%" : "85%";
  const imageSize = isSmallScreen ? 180 : 240;

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <BackgroundPattern>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingHorizontal: isSmallScreen ? 12 : 20, paddingBottom: 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { fontSize: isSmallScreen ? 20 : 22 }]}>
            Scan Your Meal
          </Text>

          <View style={[styles.actions, { width: containerWidth }]}>
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={openCamera}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={pickImage}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Analyzing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Pick from Gallery</Text>
              )}
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 20 }} />}

          {imageUri && !meal && !loading && (
            <Image
              source={{ uri: imageUri }}
              style={[styles.previewImage, { width: imageSize, height: imageSize }]}
              resizeMode="cover"
            />
          )}

          {meal && (
            <View style={[styles.cardWrapper, { width: containerWidth }]}>
              {meal.image_url && (
                <Image
                  source={{ uri: meal.image_url }}
                  style={[styles.capturedImage, { height: isSmallScreen ? 180 : 220 }]}
                  resizeMode="cover"
                />
              )}
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

          <SuccessModal
            visible={!!success}
            message={success ?? ""}
            onClose={() => setSuccess(null)}
          />
        </ScrollView>
      </BackgroundPattern>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    paddingTop: 20,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212121",
    textAlign: "center",
  },
  actions: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    minWidth: 260,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    borderRadius: 16,
    marginVertical: 20,
    alignSelf: "center",
  },
  capturedImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 16,
  },
  cardWrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    marginTop: 12,
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
