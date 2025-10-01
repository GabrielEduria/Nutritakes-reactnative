import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";


import MacroSummaryCard from "@/app/components/cards/MacroSummaryCard";
import TodayCard from "@/app/components/cards/TodayCard";
import ErrorModal from "@/app/components/modals/ErrorModal";

type Macros = { protein: number; carbs: number; fats: number; calories: number };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayMacros, setTodayMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0, calories: 0 });
  const [weeklyMacros, setWeeklyMacros] = useState<Macros>({ protein: 0, carbs: 0, fats: 0, calories: 0 });

  useEffect(() => {
    let channel: any = null;

    const fetchMeals = async () => {
      try {
        setLoading(true);
        const userRes = await supabase.auth.getUser();
        const userId = userRes?.data?.user?.id;
        if (!userId) throw new Error("User not logged in");

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);

        const { data: meals, error: mealsError } = await supabase
          .from("meals")
          .select("id, calories, protein, carbs, fats, created_at")
          .eq("user_id", userId)
          .gte("created_at", startOfWeek.toISOString())
          .order("created_at", { ascending: false });

        if (mealsError) throw mealsError;

        // Daily macros
        const todayTotals = (meals || [])
          .filter((m: any) => new Date(m.created_at) >= startOfDay)
          .reduce(
            (acc: Macros, meal: any) => ({
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fats: acc.fats + (meal.fats || 0),
              calories: acc.calories + (meal.calories || 0),
            }),
            { protein: 0, carbs: 0, fats: 0, calories: 0 }
          );

        // Weekly macros (totals)
        const weekTotals = (meals || []).reduce(
          (acc: Macros, meal: any) => ({
            protein: acc.protein + (meal.protein || 0),
            carbs: acc.carbs + (meal.carbs || 0),
            fats: acc.fats + (meal.fats || 0),
            calories: acc.calories + (meal.calories || 0),
          }),
          { protein: 0, carbs: 0, fats: 0, calories: 0 }
        );

        setTodayMacros(todayTotals);
        setWeeklyMacros(weekTotals);

        if (!channel) {
          channel = supabase
            .channel(`meals:${userId}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "meals", filter: `user_id=eq.${userId}` },
              () => fetchMeals()
            )
            .subscribe();
        }
      } catch (err: any) {
        console.error("Dashboard fetchMeals error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();

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
            <TodayCard macros={todayMacros} dailyGoal={2000} />

            <MacroSummaryCard macros={weeklyMacros} totalCalories={weeklyMacros.calories} />

       
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
});
