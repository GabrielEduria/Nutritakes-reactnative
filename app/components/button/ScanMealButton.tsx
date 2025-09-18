import { Meal } from "@/app/data/meal";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  onMealSaved?: (meal: Meal) => void; 
};

export default function ScanMealButton({ onMealSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);

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
    <View style={styles.container}>
      <Button title="Scan Meal" onPress={pickImage} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }} />}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
      {meal && (
        <View style={styles.mealCard}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text>{meal.description}</Text>
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
  container: { width: "100%", alignItems: "center", marginVertical: 10 },
  previewImage: { width: 200, height: 200, marginVertical: 10, borderRadius: 12 },
  mealCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    width: "90%",
    marginTop: 10,
    elevation: 2,
  },
  mealName: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
});
