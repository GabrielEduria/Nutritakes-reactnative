import Analysis from "@/app/components/analysis/Analysis";
import MacroSummaryCard from "@/app/components/cards/MacroSummaryCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

type Macros = { protein: number; carbs: number; fats: number; calories: number };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [macros, setMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0, calories: 0 });

  useEffect(() => {
    let channel: any = null;

    const fetchTodayMeals = async () => {
      try {
        setLoading(true);

        const userRes = await supabase.auth.getUser();
        const userId = userRes?.data?.user?.id;
        if (!userId) throw new Error("User not logged in");

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // ✅ Only fetch actual meal columns, ignore feedback
        const { data: meals, error: mealsError } = await supabase
          .from("meals")
          .select(
            "id, name, calories, protein, carbs, fats, fiber, servings, description, image_url, created_at"
          )
          .eq("user_id", userId)
          .gte("created_at", startOfDay.toISOString())
          .order("created_at", { ascending: false });

        if (mealsError) throw mealsError;

        const totals = (meals || []).reduce(
          (acc: Macros, meal: any) => ({
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fats: acc.fats + (meal.fats || 0),
            calories: acc.calories + (meal.calories || 0),
          }),
          { protein: 0, carbs: 0, fats: 0, calories: 0 }
        );

        setMacros(totals);

        if (!channel) {
          channel = supabase
            .channel(`meals_today:${userId}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "meals", filter: `user_id=eq.${userId}` },
              () => fetchTodayMeals()
            )
            .subscribe();
        }
      } catch (err: any) {
        console.error("Dashboard fetchTodayMeals error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayMeals();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Welcome to NutriTakes!</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 40 }} />
        ) : (
          <>
            <MacroSummaryCard macros={macros} totalCalories={macros.calories} />

            <View style={{ width: "100%", marginVertical: 16 }}>
              <Analysis />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Eating Activity</Text>
              <Text style={styles.cardText}>
                Today: {macros.calories} kcal • {macros.protein}g protein • {macros.carbs}g carbs •{" "}
                {macros.fats}g fats
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming Features</Text>
              <Text style={styles.cardText}>New widgets and insights will appear here.</Text>
            </View>
          </>
        )}

        <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 16, alignItems: "stretch" },
  header: { fontSize: 24, fontWeight: "700", color: "#0d0d0d", marginBottom: 16, textAlign: "center" },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  cardText: { fontSize: 14, color: "#333" },
});
