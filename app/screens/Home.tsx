import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DishCard from "../components/DishCard";

export default function Home() {
  const router = useRouter();

  const recentMeals = [
    {
      name: "Chicken Adobo",
      image: "https://example.com/adobo.jpg",
      description: "Classic Filipino chicken adobo with soy sauce and garlic",
    },
    {
      name: "Sinigang na Baboy",
      image: "https://example.com/sinigang.jpg",
      description: "Sour pork soup with vegetables",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Good Morning, User!</Text>
      <Text style={styles.subtitle}>Track your meals and stay healthy</Text>

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

      <Text style={styles.sectionTitle}>Recent Meals</Text>
      {recentMeals.map((meal, index) => (
        <DishCard
          key={index}
          name={meal.name}
          image={meal.image}
          description={meal.description}
        />
      ))}

      <Text style={styles.sectionTitle}>Tips & Recommendations</Text>
      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          Drink at least 8 glasses of water daily. Balanced meals help you stay energized!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  greeting: { fontSize: 26, fontWeight: "700", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  actionsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  actionButton: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  tipCard: {
    backgroundColor: "#FFFDD0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  tipText: { fontSize: 16, color: "#333" },
});
