import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import MacroSummaryCard from "@/app/components/cards/MacroSummaryCard";
import TodayCard from "@/app/components/cards/TodayCard";
import ErrorModal from "@/app/components/modals/ErrorModal";
import BackgroundPattern from "../components/background/BackgroundPattern";

type Macros = { protein: number; carbs: number; fats: number; fiber: number; calories: number };

export default function Dashboard() {
  const { width, height } = useWindowDimensions();
  const scale = width / 375; // iPhone X baseline for responsiveness

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayMacros, setTodayMacros] = useState<Macros>({
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    calories: 0,
  });
  const [weeklyMacros, setWeeklyMacros] = useState<Macros>({
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    calories: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prevWeeklyMacros, setPrevWeeklyMacros] = useState<Macros | undefined>(undefined);

  const dailyGoals = { protein: 100, carbs: 250, fats: 70, fiber: 30, calories: 2000 };

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

        const startOfPrevWeek = new Date(now);
        startOfPrevWeek.setDate(now.getDate() - 13);
        startOfPrevWeek.setHours(0, 0, 0, 0);

        const { data: meals, error: mealsError } = await supabase
          .from("meals")
          .select("id, calories, protein, carbs, fats, fiber, created_at")
          .eq("user_id", userId)
          .gte("created_at", startOfPrevWeek.toISOString())
          .order("created_at", { ascending: true });

        if (mealsError) throw mealsError;

        const calcMacros = (mealArray: any[]): Macros =>
          mealArray.reduce(
            (acc: Macros, meal: any) => ({
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fats: acc.fats + (meal.fats || 0),
              fiber: acc.fiber + (meal.fiber || 0),
              calories: acc.calories + (meal.calories || 0),
            }),
            { protein: 0, carbs: 0, fats: 0, fiber: 0, calories: 0 }
          );

        const todayTotals = calcMacros((meals || []).filter((m: any) => new Date(m.created_at) >= startOfDay));
        const weekTotals = calcMacros((meals || []).filter((m: any) => new Date(m.created_at) >= startOfWeek));
        const prevWeekTotals = calcMacros(
          (meals || []).filter(
            (m: any) => new Date(m.created_at) >= startOfPrevWeek && new Date(m.created_at) < startOfWeek
          )
        );

        setTodayMacros(todayTotals);
        setWeeklyMacros(weekTotals);
        setPrevWeeklyMacros(prevWeekTotals);

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

  const weeklyScore = Math.min(Math.round((weeklyMacros.calories / (dailyGoals.calories * 7)) * 100), 100);

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { padding: 16 * scale, paddingBottom: height * 0.1 },
        ]}
      >
        <BackgroundPattern>
          <Text style={[styles.header, { fontSize: 28 * scale }]}>Progress Report</Text>
          <Text style={[styles.subHeader, { fontSize: 14 * scale }]}>
            Track your daily & weekly progress
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FF5C00" style={{ marginTop: 40 * scale }} />
          ) : (
            <>
              <TodayCard macros={todayMacros} dailyGoal={dailyGoals.calories} />
              <MacroSummaryCard
                macros={weeklyMacros}
                totalCalories={weeklyMacros.calories}
                weeklyScore={weeklyScore}
              />
              <View style={{ width: "100%", marginVertical: 16 * scale }}>
                <Text style={[styles.analysisHeader, { fontSize: 16 * scale }]}>
                  Analysis & Insights
                </Text>
              </View>
            </>
          )}
        </BackgroundPattern>
        <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "stretch",
  },
  header: {
    fontWeight: "700",
    color: "#0d0d0d",
    marginBottom: 4,
    textAlign: "left",
  },
  subHeader: {
    color: "#333",
    marginBottom: 12,
    textAlign: "left",
  },
  analysisHeader: {
    fontWeight: "700",
    marginBottom: 8,
  },
});
