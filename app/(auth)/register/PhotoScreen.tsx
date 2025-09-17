import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PhotoScreenProps = {
  name: string;
  onNext: (selectedPhoto: string | null) => void; 
};

export default function PhotoScreen({ name, onNext }: PhotoScreenProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };


  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  
  const handleNext = () => {
    if (onNext) {
      onNext(photo ?? null);
    } else {
      // fallback route
      router.push({ pathname: "/(auth)/register/CredentialsScreen", params: { name, photo } });
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("@/assets/images/icon/NT.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>No photo selected</Text>
          </View>
        )}
        <Text style={styles.title}>Add a profile photo</Text>
        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhotoWithCamera}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 18, fontWeight: "400", marginBottom: 10, textAlign: "center" },
  logo: { width: 140, height: 140, marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#808080",
  },
  photoPlaceholderText: { color: "#777", textAlign: "center" },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
