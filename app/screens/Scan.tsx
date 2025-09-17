// app/screens/Scan.tsx
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);

  // Correctly type the ref using InstanceType<typeof Camera>
  const cameraRef = useRef<InstanceType<typeof Camera> | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const handleFlipCamera = () => {
    setType(
      type === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const handleDetectFood = async () => {
    // Placeholder for real food detection logic
    // Example: capture photo, send to model/API
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Captured photo:", photo.uri);
      alert("Food detected! (placeholder)");
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleFlipCamera} style={styles.button}>
            <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDetectFood} style={styles.button}>
            <Ionicons name="nutrition-outline" size={32} color="#fff" />
            <Text style={styles.buttonText}>Detect Food</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, justifyContent: "flex-end" },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
