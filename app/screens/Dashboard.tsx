import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DishCard from "../components/DishCard";

const Dashboard: React.FC = () => {
  const stats = [
    { label: "Calories Today", value: 1450 },
    { label: "Meals Logged", value: 5 },
    { label: "Dishes Recognized", value: 12 },
  ];

  const recentDishes = [
    { name: "Adobo", image: "https://via.placeholder.com/150" },
    { name: "Sinigang", image: "https://via.placeholder.com/150" },
    { name: "Kare-Kare", image: "https://via.placeholder.com/150" },
  ];

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Welcome Back!</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Dishes */}
        <Text style={styles.sectionTitle}>Recent Dishes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentDishes.map((dish, index) => (
            <DishCard key={index} name={dish.name} image={dish.image} />
          ))}
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#0d0d0d" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  statLabel: { fontSize: 14, textAlign: "center", color: "#555" },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12, color: "#0d0d0d" },
});

export default Dashboard;
