import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserProfile {
  has_completed_onboarding: boolean;
}

export default function AuthLayout() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) setSession(data.session ?? null);
      } catch (err: any) {
        console.error("Failed to get session:", err);
        if (isMounted) setError("Failed to fetch session");
      } finally {
        if (isMounted) setLoadingSession(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) setSession(newSession);
      if (isMounted) setProfile(null); 
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    let isMounted = true;
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("has_completed_onboarding")
          .eq("user_id", session.user.id)
          .single<UserProfile>();

        if (error) throw error;
        if (isMounted) setProfile(data ?? null);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        if (isMounted) setError("Failed to fetch profile");
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [session]);

  if (loadingSession || loadingProfile) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoadingSession(true);
            setLoadingProfile(true);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!session?.user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegisterScreen" />
      </Stack>
    );
  }

  if (!profile?.has_completed_onboarding) {
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFDD0",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5C00",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF5C00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
