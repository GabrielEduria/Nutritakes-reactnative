import NutritionLabelCard, { NutritionInfo } from "@/app/components/cards/NutritionLabelCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import { saveMeal } from "@/lib/MealService";
import { auth } from "@/lib/firebase";
import { recognizeMeal } from "@/lib/openai";
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
import SuccessModal from "../components/modals/SuccessModal";

export default function Scan() {
  const [loading, setLoading] = useState(false); // for recognition
  const [saving, setSaving] = useState(false); // for saving to Supabase
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Gallery permission is required!");
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

  const processImage = async (uri: string) => {
    setError(null);
    setSuccess(null);
    setMeal(null);
    setLoading(true);

    // 1) Recognize
    let detected: NutritionInfo;
    try {
      detected = await recognizeMeal(uri);
      setMeal(detected);
    } catch (err) {
      console.error("Recognition error:", err);
      setError("Failed to analyze the image. Try again.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    // 2) Try to save if user logged in
    const user = auth.currentUser;
    if (!user) {
      setSuccess(`Detected: ${detected.name} (not saved — sign in to save).`);
      return;
    }

    setSaving(true);
    try {
      await saveMeal(user.uid, detected);
      setSuccess(`Meal saved! Logged ${detected.name}`);
    } catch (err) {
      console.error("Save error:", err);
      setError("Detected meal but failed to save to server. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Scan Your Meal</Text>

        <TouchableOpacity
          style={[styles.button, (loading || saving) && { opacity: 0.7 }]}
          onPress={pickImage}
          disabled={loading || saving}
        >
          <Text style={styles.buttonText}>
            {loading ? "Analyzing..." : saving ? "Saving..." : "Pick from Gallery"}
          </Text>
        </TouchableOpacity>

        {(loading || saving) && (
          <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 18 }} />
        )}

        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        {meal && (
          <View style={styles.cardWrapper}>
            <NutritionLabelCard meal={meal} />
          </View>
        )}

       
        <View style={{ height: 100 }} />

        <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
        <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    paddingBottom: 40,
    paddingTop: 30,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FF914D",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 16,
    marginVertical: 20,
  },
  cardWrapper: {
    width: "90%",
    alignItems: "center",
  },
});
