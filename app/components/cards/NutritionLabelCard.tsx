import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

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
  meal?: MealWithId;
  loading?: boolean;
};

const NutritionLabelCard: React.FC<NutritionLabelCardProps> = ({
  meal,
  loading = false,
}) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const fontScale = isSmall ? 0.9 : 1;

  if (loading || !meal) {

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#f2f2f2", "#e0e0e0", "#f2f2f2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.card, styles.skeletonCard]}
        >
          <ActivityIndicator size="large" color="#FF5C00" />
          <Text style={styles.loadingText}>Analyzing nutrition...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { fontSize: 22 * fontScale },
            ]}
            numberOfLines={1}
          >
            Nutrition Facts
          </Text>
        </View>

        <View style={styles.thickLine} />

        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: 16 * fontScale }]}>Name</Text>
          <Text
            style={[styles.value, { fontSize: 16 * fontScale }]}
            numberOfLines={2}
          >
            {meal.name}
          </Text>
        </View>

        <View style={styles.line} />

        <View style={styles.row}>
          <Text
            style={[styles.label, styles.caloriesLabel, { fontSize: 18 * fontScale }]}
          >
            Calories
          </Text>
          <Text
            style={[styles.value, styles.caloriesValue, { fontSize: 18 * fontScale }]}
          >
            {meal.calories} kcal
          </Text>
        </View>

        <View style={styles.thickLine} />

        <MacroRow label="Protein" value={`${meal.protein} g`} fontScale={fontScale} />
        <MacroRow label="Carbs" value={`${meal.carbs} g`} fontScale={fontScale} />
        <MacroRow label="Fats" value={`${meal.fats} g`} fontScale={fontScale} />

        {meal.fiber !== undefined && (
          <MacroRow label="Fiber" value={`${meal.fiber} g`} fontScale={fontScale} />
        )}

        {meal.servings !== undefined && (
          <MacroRow label="Servings" value={`${meal.servings}`} fontScale={fontScale} />
        )}

        {meal.description && (
          <>
            <View style={styles.bottomLine} />
            <View style={styles.descriptionContainer}>
              <Text style={[styles.description, { fontSize: 14 * fontScale }]}>
                {meal.description}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const MacroRow = ({
  label,
  value,
  fontScale,
}: {
  label: string;
  value: string;
  fontScale: number;
}) => (
  <>
    <View style={styles.line} />
    <View style={styles.row}>
      <Text style={[styles.label, styles.macroLabel, { fontSize: 16 * fontScale }]}>
        {label}
      </Text>
      <Text style={[styles.value, styles.macroValue, { fontSize: 16 * fontScale }]}>
        {value}
      </Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    width: "90%",
    elevation: 3,
  },
  skeletonCard: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
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
    fontWeight: "500",
  },
  value: {
    fontWeight: "400",
    textAlign: "right",
    flexShrink: 1,
    maxWidth: "60%",
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
  },
  caloriesValue: {
    fontWeight: "bold",
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
    color: "#333",
  },
});

export default NutritionLabelCard;
