import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { db } from "../../Lib/firebase";
import NutritionLabelCard from "../components/cards/NutritionLabelCard";
import { Meal } from "../data/meal";

export default function Scan() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [recognizedMeal, setRecognizedMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  // Step 1: Capture Photo
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    await analyzePhoto(photo.base64, photo.uri);
  };

  // Step 2: Send to OpenAI API for recognition
  const analyzePhoto = async (base64Image: string, uri: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual OpenAI call
      // For now, mock response
      const fakeMeal: Meal = {
        timestamp: new Date(),
        name: "Chicken Adobo",
        image: uri,
        description: "Recognized Filipino dish",
        calories: 350,
        protein: 25,
        carbs: 20,
        fats: 15,
        servings: 1,
      };

      setRecognizedMeal(fakeMeal);
    } catch (err) {
      console.error("Recognition failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save confirmed meal to Firestore
  const handleConfirm = async () => {
    if (!recognizedMeal) return;
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, `profiles/${user.uid}/meals`), {
        ...recognizedMeal,
        timestamp: serverTimestamp(),
      });
      setRecognizedMeal(null);
    } catch (err) {
      console.error("Error saving meal:", err);
    }
  };

  return (
    <View style={styles.container}>
      {!recognizedMeal ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
          <Button title="Capture" onPress={takePhoto} />
        </>
      ) : (
        <>
          <NutritionLabelCard meal={recognizedMeal} />
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Retake" onPress={() => setRecognizedMeal(null)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
});
