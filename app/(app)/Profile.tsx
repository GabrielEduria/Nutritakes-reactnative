import { auth } from "@/lib/firebase";
import { logout, sendPasswordReset } from "@/lib/firebaseHelpers";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleResetPassword = async (): Promise<void> => {
    if (!user?.email) return;
    await sendPasswordReset(user.email);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/LoginScreen");
  };

  if (!user) return null;

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
    
        <View style={styles.infoCard}>
          <Text style={styles.email}>
            {user.email ?? "Email Placeholder"}
          </Text>
          <Text style={styles.verified}>
            {user.emailVerified ? "Account Verified ✅" : "Account Not Verified ❌"}
          </Text>
        </View>

     
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logout]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>


{/* add meal history later after supabase integration
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Your Meals</Text>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text>{meal.calories} kcal</Text>
              <Text>Protein: {meal.protein}g</Text>
              <Text>Carbs: {meal.carbs}g</Text>
              <Text>Fats: {meal.fats}g</Text>
        </View> */}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    paddingBottom: 60,
    paddingTop: 20,
    alignItems: "center",
    width: "100%",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "left",
    width: "90%",
    marginBottom: 20,
    elevation: 5
  },
  email: {
    color: "#000",
    fontSize: 16,
    marginBottom: 6,
  },
  verified: {
    color: "#000",
    fontSize: 14,
  },
  actions: {
    marginTop: 10,
    width: "90%",
  },
  button: {
    backgroundColor: "#FF914D",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logout: {
    backgroundColor: "#E63946",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
