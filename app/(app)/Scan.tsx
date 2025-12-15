import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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

import BackgroundPattern from "@/app/components/background/BackgroundPattern";
import NutritionLabelCard from "@/app/components/cards/NutritionLabelCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import InternetRequiredModal from "@/app/components/modals/InternetRequiredModal";
import SuccessModal from "@/app/components/modals/SuccessModal";

import { predictDish as cnnPredictDish } from "@/lib/cnn/cnnModel";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { saveMeal } from "@/lib/MealService";
import { recognizeMeal } from "@/lib/openai";
import { MealWithId } from "@/types/meal";

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<MealWithId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { width } = useWindowDimensions();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setShowModal(!isOnline);
  }, [isOnline]);

  const pickImage = async () => {
    if (!isOnline) return setShowModal(true);

    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Gallery permission is required.");
      return;
    }

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
    if (!isOnline) return setShowModal(true);

    setError(null);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Camera permission is required.");
      return;
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
    if (!isOnline) return setShowModal(true);

    setLoading(true);
    setMeal(null);
    setError(null);
    setSuccess(null);

    try {
      // Optional CNN step (kept for architecture completeness)
      const cnnResult = await cnnPredictDish(uri);
      console.log("CNN prediction:", cnnResult);

      const detectedMeal = await recognizeMeal(uri);
      setMeal({ ...detectedMeal, image_url: uri });

    } catch (err) {
      if (__DEV__) {
        console.warn("Scan error:", err);
      }

      // ✅ CORE FIX: trust error.message
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Failed to analyze image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!meal) return;
    if (!isOnline) return setShowModal(true);

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
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Analyzing...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Pick from Gallery</Text>
              )}
            </TouchableOpacity>
          </View>

          {imageUri && !meal && !loading && (
            <Image
              source={{ uri: imageUri }}
              style={[styles.previewImage, { width: imageSize, height: imageSize }]}
            />
          )}

          {meal && (
            <View style={[styles.cardWrapper, { width: containerWidth }]}>
              {meal.image_url && (
                <Image
                  source={{ uri: meal.image_url }}
                  style={styles.capturedImage}
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
            message={error ?? ""}
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

          <InternetRequiredModal
            visible={showModal}
            onRetry={() => setShowModal(!isOnline)}
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
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
    color: "#212121",
  },
  actions: { alignItems: "center" },
  button: {
    width: "100%",
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loadingContainer: { flexDirection: "row", alignItems: "center" },
  previewImage: { borderRadius: 16, marginVertical: 20 },
  capturedImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardWrapper: { marginTop: 20 },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});
