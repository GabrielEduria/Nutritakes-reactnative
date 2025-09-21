import { recognizeMeal } from "@/lib/openai";
import { LinearGradient } from "expo-linear-gradient";

import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import NutritionLabelCard, { NutritionInfo } from "../components/cards/NutritionLabelCard";
import PieChart from "../components/charts/PieChart";
import ErrorModal from "../components/modals/ErrorModal";

export default function Home() {

  const [meal, setMeal] = useState<NutritionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const analyzeMeal = async (uri: string) => {
    setLoading(true);
    setMeal(null);
    setShowModal(false);

    try {
      const detectedMeal = await recognizeMeal(uri);
      if (!detectedMeal.isFilipino) setShowModal(true);
      setMeal(detectedMeal);
    } catch (err) {
      console.error("Error recognizing meal:", err);
      Alert.alert("Error", "Failed to analyze the meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading && <ActivityIndicator size="large" color="#FF5C00" style={{ marginVertical: 20 }} />}

        {meal && (
          <>
            <NutritionLabelCard meal={meal} />
            <PieChart
              data={[
                { name: "Protein", value: meal.protein, color: "#FF6384" },
                { name: "Carbs", value: meal.carbs, color: "#36A2EB" },
                { name: "Fats", value: meal.fats, color: "#FFCE56" },
              ]}
             
            />
          </>
        )}

        {showModal && (
          <ErrorModal
            visible={true}
            message="Sorry, only Filipino food is supported!"
            onClose={() => setShowModal(false)}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    padding: 20,
    alignItems: "center",
  },
});
