import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DishCard from "../components/DishCard";

export default function Home() {
  const router = useRouter();

  const recentMeals = [
    {
      name: "Chicken Adobo",
      image: "https://via.placeholder.com/150",
      description: "Classic Filipino chicken adobo with soy sauce and garlic",
    },
    {
      name: "Sinigang na Baboy",
      image: "https://via.placeholder.com/150",
      description: "Sour pork soup with vegetables",
    },
    {
      name: "Kare-Kare",
      image: "https://via.placeholder.com/150",
      description: "Peanut-based oxtail stew with vegetables",
    },
  ];

  const tips = [
    "Drink at least 8 glasses of water daily.",
    "Include protein and fiber in each meal to stay full longer.",
    "Track your meals for better nutrition awareness.",
  ];

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.greeting}>Good Morning, User!</Text>
        <Text style={styles.subtitle}>Track your meals and stay healthy</Text>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/screens/Scan")}
          >
            <Text style={styles.actionText}>Scan a Dish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/screens/Dashboard")}
          >
            <Text style={styles.actionText}>View Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Meals */}
        <Text style={styles.sectionTitle}>Recent Meals</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            {recentMeals.map((meal, index) => (
              <DishCard
                key={index}
                name={meal.name}
                image={meal.image}
                description={meal.description}
              />
            ))}
          </ScrollView>

        {/* Tips & Recommendations */}
        <Text style={styles.sectionTitle}>Tips & Recommendations</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingBottom: 30, paddingTop: 20 },

  greeting: { fontSize: 26, fontWeight: "700", color: "#0d0d0d", marginHorizontal: 16 },
  subtitle: { fontSize: 16, color: "#333", marginTop: 4, marginBottom: 20, marginHorizontal: 16 },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 12, marginHorizontal: 16 },

  horizontalScroll: { paddingLeft: 16 },

  tipCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 2,
  },
  tipText: { fontSize: 16, color: "#0d0d0d" },
});
