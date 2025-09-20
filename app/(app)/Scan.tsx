import { recognizeMeal } from "@/lib/openai";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [meal, setMeal] = useState<any | null>(null);

  const pickImage = async (fromGallery = false) => {
    const permission = fromGallery
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission required", "Camera or Gallery access required");

    const result = fromGallery
      ? await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      testOpenAI(uri);
    }
  };

  const testOpenAI = async (uri: string) => {
    setLoading(true);
    try {
      const detectedMeal = await recognizeMeal(uri);
      console.log("OpenAI detected meal:", detectedMeal);
      Alert.alert("Detected Meal", JSON.stringify(detectedMeal, null, 2));
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Scan a Meal</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}><Text>Camera</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}><Text>Gallery</Text></TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {meal && <Text style={{ marginTop: 20 }}>Meal Name: {meal.name}</Text>}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  actions: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  button: { backgroundColor: "#FF5C00", padding: 14, borderRadius: 12, flex: 1, marginHorizontal: 5, alignItems: "center" },
  image: { width: 250, height: 250, marginTop: 20, borderRadius: 12 },
});
