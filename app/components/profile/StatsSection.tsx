import { Meal } from "@/app/data/meal";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type ActionsSectionProps = {
  meals: Meal[];
};

const ActionsSection: React.FC<ActionsSectionProps> = ({ meals }) => {
  if (meals.length === 0) {
    return <Text style={styles.emptyText}>No meals logged yet.</Text>;
  }

  const renderMeal = ({ item }: { item: Meal }) => (
    <View style={styles.mealCard}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.mealImage} />
      )}
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        {item.description && <Text style={styles.mealDesc}>{item.description}</Text>}
        <View style={styles.macroRow}>
          <Text style={styles.macroText}>Cal: {item.calories}</Text>
          <Text style={styles.macroText}>P: {item.protein}</Text>
          <Text style={styles.macroText}>C: {item.carbs}</Text>
          <Text style={styles.macroText}>F: {item.fats}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id || item.name}
      renderItem={renderMeal}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={false} 
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mealCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    justifyContent: "center",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  mealDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  macroText: {
    fontSize: 12,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default ActionsSection;
