import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

import NutritionLabelCard, { NutritionInfo } from "@/app/components/cards/NutritionLabelCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import SuccessModal from "@/app/components/modals/SuccessModal";
import { saveMeal } from "@/lib/MealService";
import { recognizeMeal } from "@/lib/openai";
import { MealWithId } from "./Profile";

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<MealWithId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return setError("Gallery permission is required!");

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setMeal(null);

    try {
      const detected: NutritionInfo = await recognizeMeal(uri);
      const detectedWithId: MealWithId = { id: uuidv4(), ...detected, image_url: uri };
      setMeal(detectedWithId);
      setConfirmModalVisible(true); // show modal to confirm save
    } catch (err) {
      console.error(err);
      setError("Failed to recognize meal. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!meal) return;
    setConfirmModalVisible(false);
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
  
  const handleSkipSave = () => {
    setConfirmModalVisible(false);
    setMeal(null);
    setImageUri(null);
  };
  
  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Scan Your Meal</Text>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Analyzing..." : "Pick from Gallery"}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 18 }} />}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
        {meal && <View style={styles.cardWrapper}><NutritionLabelCard meal={meal} /></View>}

        {confirmModalVisible && meal && (
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 12 }}>Save this meal?</Text>
              <NutritionLabelCard meal={meal} />
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#4CAF50", marginRight: 8 }]}
                  onPress={handleSaveMeal}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#F44336" }]}
                  onPress={handleSkipSave}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
        <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingBottom: 40, paddingTop: 30, alignItems: "center", width: "100%" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#333" },
  button: { backgroundColor: "#FF914D", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12, alignItems: "center", marginBottom: 20, elevation: 3 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  previewImage: { width: 240, height: 240, borderRadius: 16, marginVertical: 20 },
  cardWrapper: { width: "90%", alignItems: "center" },
  modalBackground: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center" },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
});
