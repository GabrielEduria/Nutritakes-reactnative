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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [weeklyTarget, setWeeklyTarget] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let channelMeals: any = null;
    let channelProfile: any = null;

    async function fetchAll() {
      try {
        setLoading(true);
        const userRes = await supabase.auth.getUser();
        const userId = userRes?.data?.user?.id;
        if (!userId) {
          setMessage("Log in to see your analysis.");
          setWeeklyCalories(0);
          setWeeklyTarget(null);
          setProgress(0);
          return;
        }

  
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const [mealsResp, profileResp] = await Promise.all([
          supabase
            .from("meals")
            .select("calories,created_at")
            .eq("user_id", userId)
            .gte("created_at", startOfWeek.toISOString()),
          supabase.from("user_profiles").select("weekly_target_calories").eq("user_id", userId).single(),
        ]);

        if (mealsResp.error && mealsResp.error.code !== "PGRST116") throw mealsResp.error;
        if (profileResp.error && profileResp.error.code !== "PGRST116") throw profileResp.error;

        const meals = mealsResp.data ?? [];
        const total = meals.reduce((acc: number, m: any) => acc + (m.calories || 0), 0);
        setWeeklyCalories(total);

        const target = profileResp.data?.weekly_target_calories ?? null;
        setWeeklyTarget(target);

        const effectiveTarget = target ?? DEFAULT_WEEKLY_TARGET;
        const ratio = effectiveTarget > 0 ? Math.min(total / effectiveTarget, 1) : 0;
        setProgress(ratio);

        if (!target) {
          setMessage(`You're at ${Math.round((ratio || 0) * 100)}% of a default goal (${DEFAULT_WEEKLY_TARGET} kcal). Set a personal weekly target for better tracking.`);
        } else {
          setMessage(`You consumed ${total} kcal this week (${Math.round(ratio * 100)}% of your ${target} kcal target).`);
        }
      } catch (err: any) {
        console.error("Analysis fetchAll error:", err);
        setMessage("Failed to load analysis.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();

    (async () => {
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id;
      if (!userId) return;

      channelMeals = supabase
        .channel(`meals_ws:${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "meals", filter: `user_id=eq.${userId}` },
          () => fetchAll()
        )
        .subscribe();

      channelProfile = supabase
        .channel(`profile_ws:${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "user_profiles", filter: `user_id=eq.${userId}` },
          () => fetchAll()
        )
        .subscribe();
    })();

    return () => {
      if (channelMeals) supabase.removeChannel(channelMeals);
      if (channelProfile) supabase.removeChannel(channelProfile);
    };
  }, []);

  const score = Math.round(progress * 100);
  const feedback =
    score === 0
      ? "📸 Snap your first meal to start tracking."
      : score < 40
      ? "🚀 You're warming up! keep logging!"
      : score < 70
      ? "🔥 Good job! keep consistency!"
      : score < 100
      ? "🌟 Almost there. you can do it!"
      : "🏆 Goal crushed! great work!";

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
