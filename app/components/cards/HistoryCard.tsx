import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NutritionLabelCard, { MealWithId } from "./NutritionLabelCard";

type HistoryCardProps = {
  meal: MealWithId;
  onDelete?: (meal: MealWithId) => void;
};

const HistoryCard: React.FC<HistoryCardProps> = ({ meal, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>

      <View style={styles.card}>
     
        {meal.image_url && (
          <Image source={{ uri: meal.image_url }} style={styles.thumbnail} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{meal.name}</Text>
          {meal.description && (
            <Text style={styles.description} numberOfLines={2}>
              {meal.description}
            </Text>
          )}
        </View>

        <View style={styles.metrics}>
          <Text style={styles.calories}>{meal.calories} kcal</Text>
          <View style={styles.macros}>
            <Text style={styles.macro}>P: {meal.protein}g</Text>
            <Text style={styles.macro}>C: {meal.carbs}g</Text>
            <Text style={styles.macro}>F: {meal.fats}g</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(meal)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {meal.image_url && (
              <Image source={{ uri: meal.image_url }} style={styles.modalImage} />
            )}
            <NutritionLabelCard meal={meal} />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8, marginHorizontal: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  thumbnail: { width: 60, height: 60, borderRadius: 12, marginRight: 10 },
  info: { flex: 2 },
  metrics: { flex: 1, alignItems: "flex-end" },
  name: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 12, color: "#555", marginTop: 2 },
  calories: { fontWeight: "bold", fontSize: 16 },
  macros: { marginTop: 4, alignItems: "flex-end" },
  macro: { fontSize: 12, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  viewBtn: { backgroundColor: "#4CAF50", padding: 6, borderRadius: 6, marginRight: 8 },
  deleteBtn: { backgroundColor: "#F44336", padding: 6, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center" },
  closeBtn: { marginTop: 12, backgroundColor: "#555", padding: 8, borderRadius: 6, alignSelf: "center" },
  modalImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
});

export default HistoryCard;
