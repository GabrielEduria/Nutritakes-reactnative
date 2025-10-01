import { MealWithId } from "@/types/meal";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HistoryCardProps = {
  meal: MealWithId;
  onView: (meal: MealWithId) => void;
  onDelete: (meal: MealWithId) => void;
};

const HistoryCard: React.FC<HistoryCardProps> = ({ meal, onView, onDelete }) => {
  return (
    <View style={styles.card}>
    
      {meal.image_url ? (
        <Image source={{ uri: meal.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{meal.name}</Text>
        <Text style={styles.macro}>Calories: {meal.calories} kcal</Text>
        <Text style={styles.macro}>Protein: {meal.protein} g</Text>
        <Text style={styles.macro}>Carbs: {meal.carbs} g</Text>
        <Text style={styles.macro}>Fats: {meal.fats} g</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => onView(meal)}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(meal)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 3,
    width: "100%",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#999", fontSize: 12 },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#000" },
  macro: { fontSize: 13, color: "#555" },
  actions: {
    flexDirection: "column",
    marginLeft: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    alignItems: "center",
  },
  viewButton: { backgroundColor: "#FF5C00" }, 
  deleteButton: { backgroundColor: "#E53935" }, 
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});

export default HistoryCard;
