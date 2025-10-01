import NutritionLabelCard from "@/app/components/cards/NutritionLabelCard";
import { MealWithId } from "@/types/meal";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  meal: MealWithId;
  visible: boolean;
  onSave: () => void;
  onSkip: () => void;
}

export default function ScanMealModal({ meal, visible, onSave, onSkip }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Save this meal?</Text>
        <NutritionLabelCard meal={meal} />
        <View style={styles.modalActions}>
          <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#FF5C00", marginRight: 8 }]} onPress={onSave}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#E53935" }]} onPress={onSkip}>
            <Text style={styles.modalButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: { fontWeight: "700", fontSize: 18, marginBottom: 12 },
  modalActions: { flexDirection: "row", marginTop: 16 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "700" },
});
