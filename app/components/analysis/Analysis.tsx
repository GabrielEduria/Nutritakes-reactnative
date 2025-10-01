import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width * 0.9;
const DEFAULT_WEEKLY_TARGET = 14000; // default weekly calories

export default function Analysis() {
  const [loading, setLoading] = useState(true);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let channelMeals: any = null;

    async function fetchWeeklyCalories() {
      try {
        setLoading(true);
        const userRes = await supabase.auth.getUser();
        const userId = userRes?.data?.user?.id;
        if (!userId) {
          setMessage("Log in to see your analysis.");
          setWeeklyCalories(0);
          setProgress(0);
          return;
        }

        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        // Fetch weekly meals
        const { data: mealsResp, error: mealsError } = await supabase
          .from("meals")
          .select("calories,created_at")
          .eq("user_id", userId)
          .gte("created_at", startOfWeek.toISOString());

        if (mealsError) throw mealsError;

        const meals = mealsResp ?? [];
        const totalCalories = meals.reduce((acc, meal: any) => acc + (meal.calories || 0), 0);

        setWeeklyCalories(totalCalories);

        const ratio = DEFAULT_WEEKLY_TARGET > 0 ? Math.min(totalCalories / DEFAULT_WEEKLY_TARGET, 1) : 0;
        setProgress(ratio);

        setMessage(
          `You consumed ${totalCalories} kcal this week (${Math.round(ratio * 100)}% of the default ${DEFAULT_WEEKLY_TARGET} kcal goal).`
        );
      } catch (err: any) {
        console.error("Analysis fetchWeeklyCalories error:", err);
        setMessage("Failed to load analysis.");
        setProgress(0);
        setWeeklyCalories(0);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyCalories();

    // Real-time subscription to meals
    (async () => {
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id;
      if (!userId) return;

      channelMeals = supabase
        .channel(`meals_ws:${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "meals", filter: `user_id=eq.${userId}` },
          () => fetchWeeklyCalories()
        )
        .subscribe();
    })();

    return () => {
      if (channelMeals) supabase.removeChannel(channelMeals);
    };
  }, []);

  const score = Math.round(progress * 100);
  const feedback =
    score === 0
      ? "📸 Snap your first meal to start tracking."
      : score < 40
      ? "🚀 You're warming up! Keep logging!"
      : score < 70
      ? "🔥 Good job! Keep consistency!"
      : score < 100
      ? "🌟 Almost there. You can do it!"
      : "🏆 Goal crushed! Great work!";

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Weekly Analysis</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 12 }} />
      ) : (
        <>
          <ProgressChart
            data={{ data: [Math.min(Math.max(progress, 0), 1)] }}
            width={screenWidth}
            height={160}
            strokeWidth={8}
            radius={36}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(255,92,0, ${opacity})`,
              labelColor: () => "#444",
            }}
            hideLegend={true}
          />
          <Text style={styles.scoreText}>
            {weeklyCalories}/{DEFAULT_WEEKLY_TARGET} kcal
          </Text>
          <Text style={styles.summaryText}>{message}</Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  scoreText: { fontSize: 22, fontWeight: "700", marginTop: 8, color: "#FF5C00" },
  summaryText: { marginTop: 10, fontSize: 14, color: "#333", textAlign: "center" },
  feedbackText: { marginTop: 8, fontSize: 15, fontWeight: "600" },
});
