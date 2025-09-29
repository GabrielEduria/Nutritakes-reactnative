import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

interface UserProfile {
  has_completed_onboarding: boolean;
}

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);


  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session ?? null);
      } catch (err) {
        console.error("Failed to get session:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("has_completed_onboarding")
          .eq("user_id", session.user.id)
          .single<UserProfile>();

        if (error) throw error;
        setProfile(data);
        console.log("Fetched profile:", data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      }
    };

    loadProfile();
  }, [session]);

  if (loading) return <SplashScreen />;

  if (!session?.user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegisterScreen" />
      </Stack>
    );
  }

  if (!profile || !profile.has_completed_onboarding) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/AgeScreen" />
        <Stack.Screen name="onboarding/GenderScreen" />
        <Stack.Screen name="onboarding/WeightScreen" />
        <Stack.Screen name="onboarding/HeightScreen" />
        <Stack.Screen name="onboarding/GoalScreen" />
        <Stack.Screen name="onboarding/CaloriesTargetScreen" />
        <Stack.Screen name="onboarding/ReviewAndSaveScreen" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)/Dashboard" />
    </Stack>
  );
}
