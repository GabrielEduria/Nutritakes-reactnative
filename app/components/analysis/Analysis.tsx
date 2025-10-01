import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width * 0.8;
const DEFAULT_WEEKLY_TARGET = 14000; 

export default function Analysis() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let channelMeals: any = null;

    const fetchWeeklyData = async () => {
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

        const { data: meals, error } = await supabase
          .from("meals")
          .select("calories,created_at")
          .eq("user_id", userId)
          .gte("created_at", startOfWeek.toISOString());

        if (error) throw error;

        const totalCalories = (meals || []).reduce(
          (acc, meal: any) => acc + (meal.calories || 0),
          0
        );
        setWeeklyCalories(totalCalories);

        const ratio = Math.min(totalCalories / DEFAULT_WEEKLY_TARGET, 1);
        setProgress(ratio);

        setMessage(
          `You consumed ${totalCalories} kcal this week (${Math.round(ratio * 100)}% of your default goal ${DEFAULT_WEEKLY_TARGET} kcal).`
        );
      } catch (err: any) {
        console.error("Analysis fetchWeeklyData error:", err);
        setMessage("Failed to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();

    (async () => {
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id;
      if (!userId) return;

      channelMeals = supabase
        .channel(`meals_ws:${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "meals", filter: `user_id=eq.${userId}` },
          () => fetchWeeklyData()
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
            data={{ data: [progress] }}
            width={screenWidth}
            height={160}
            strokeWidth={14}
            radius={36}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(255,92,0, ${opacity})`,
              labelColor: () => "#444",
            }}
            hideLegend={true}
          />

          <Text style={styles.scoreText}>{score}/100</Text>
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
  scoreText: { fontSize: 28, fontWeight: "800", marginTop: 8, color: "#FF5C00" },
  summaryText: { marginTop: 10, fontSize: 14, color: "#333", textAlign: "center" },
  feedbackText: { marginTop: 8, fontSize: 15, fontWeight: "600" },
});
