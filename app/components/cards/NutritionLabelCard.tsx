import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type NutritionInfo = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  servings?: number;
  description?: string;
};

export type MealWithId = NutritionInfo & {
  id: string;
  image_url?: string;
};

type NutritionLabelCardProps = {
  meal: MealWithId;
};

const NutritionLabelCard: React.FC<NutritionLabelCardProps> = ({ meal }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
      
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Facts</Text>
        </View>

        <View style={styles.thickLine} />

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{meal.name}</Text>
        </View>
        <View style={styles.line} />

        <View style={styles.row}>
          <Text style={[styles.label, styles.caloriesLabel]}>Calories</Text>
          <Text style={[styles.value, styles.caloriesValue]}>
            {meal.calories} kcal
          </Text>
        </View>
        <View style={styles.thickLine} />

        <View style={styles.row}>
          <Text style={[styles.label, styles.macroLabel]}>Protein</Text>
          <Text style={[styles.value, styles.macroValue]}>
            {meal.protein} g
          </Text>
        </View>
        <View style={styles.line} />

        <View style={styles.row}>
          <Text style={[styles.label, styles.macroLabel]}>Carbs</Text>
          <Text style={[styles.value, styles.macroValue]}>{meal.carbs} g</Text>
        </View>
        <View style={styles.line} />

        <View style={styles.row}>
          <Text style={[styles.label, styles.macroLabel]}>Fats</Text>
          <Text style={[styles.value, styles.macroValue]}>{meal.fats} g</Text>
        </View>

        {meal.fiber !== undefined && (
          <>
            <View style={styles.line} />
            <View style={styles.row}>
              <Text style={styles.label}>Fiber</Text>
              <Text style={styles.value}>{meal.fiber} g</Text>
            </View>
          </>
        )}

        {meal.servings !== undefined && (
          <>
            <View style={styles.line} />
            <View style={styles.row}>
              <Text style={styles.label}>Servings</Text>
              <Text style={styles.value}>{meal.servings}</Text>
            </View>
          </>
        )}

        {meal.description && (
          <>
            <View style={styles.bottomLine} />
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{meal.description}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "right",
  },
  thickLine: {
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    marginVertical: 4,
  },
  line: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 2,
  },
  bottomLine: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 6,
  },
  caloriesLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
  caloriesValue: {
    fontWeight: "bold",
    fontSize: 18,
  },
  macroLabel: {
    fontWeight: "bold",
  },
  macroValue: {
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginTop: 4,
  },
  description: {
    textAlign: "left",
    fontSize: 14,
    color: "#333",
  },
});

export default NutritionLabelCard;
