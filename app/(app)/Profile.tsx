import { auth } from "@/lib/firebase";
import { sendPasswordReset } from "@/lib/firebaseHelpers";
import { getMeals } from "@/lib/MealService";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HistoryCard from "../components/cards/HistoryCard";
import ErrorModal from "../components/modals/ErrorModal";
import SuccessModal from "../components/modals/SuccessModal";
export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchMeals = async () => {
      try {
        const data = await getMeals(user.uid);
        setMeals(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch meals.");
      }
    };
    fetchMeals();
  }, [user]);

  const handleDeleteMeal = async (meal: any) => {
    try {
      await supabase.from("meals").delete().eq("id", meal.id);
      setMeals(meals.filter((m) => m.id !== meal.id));
      setSuccess("Meal deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete meal.");
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!user?.email) return setError("No email found for this account");
    try {
      await sendPasswordReset(user.email);
      setSuccess("Password reset email sent successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to send password reset email. Try again.");
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.replace("/(auth)/LoginScreen");
  };

  if (!user) return null;

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.infoCard}>
          <Text style={styles.email}>{user.email ?? "Email Placeholder"}</Text>
          <Text style={styles.verified}>
            {user.emailVerified ? "Account Verified ✅" : "Account Not Verified ❌"}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Your Meals</Text>
          {meals.length === 0 && <Text style={styles.noMeals}>No meals logged yet.</Text>}
          {meals.map((meal) => (
            <HistoryCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
          ))}
        </View>

        <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
        <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingBottom: 60, paddingTop: 20, alignItems: "center", width: "100%" },
  infoCard: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%", marginBottom: 20, elevation: 5 },
  email: { color: "#000", fontSize: 16, marginBottom: 6 },
  verified: { color: "#000", fontSize: 14 },
  actions: { marginTop: 10, width: "90%" },
  button: { backgroundColor: "#FF914D", paddingVertical: 12, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  logout: { backgroundColor: "#E63946" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  mealsSection: { width: "90%", marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  noMeals: { color: "#555", fontSize: 14, textAlign: "center", marginVertical: 12 },
});
