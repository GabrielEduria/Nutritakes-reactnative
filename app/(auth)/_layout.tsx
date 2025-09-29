import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [splashMessage, setSplashMessage] = useState("Loading...");

  const fetchSession = useCallback(async () => {
    setLoadingSession(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session ?? null);
    } catch (err: any) {
      console.error("Failed to get session:", err);
      setError("Failed to fetch session");
    } finally {
      setLoadingSession(false);
    }
  }, []);


  const pollProfile = useCallback(async (userId: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const { data } = await supabase
        .from("user_profiles")
        .select("has_completed_onboarding")
        .eq("user_id", userId)
        .single<UserProfile>();

      if (data?.has_completed_onboarding) return data;
      await new Promise((res) => setTimeout(res, 1000));
    }
    return null;
  }, []);


  const fetchProfile = useCallback(
    async (forcePoll = false) => {
      if (!session?.user) {
        setProfile(null);
        return;
      }

      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("has_completed_onboarding")
          .eq("user_id", session.user.id)
          .single<UserProfile>();

        if (error) throw error;

        if (data?.has_completed_onboarding) {
          setProfile(data);
        } else if (forcePoll) {
          const polled = await pollProfile(session.user.id);
          setProfile(polled ?? data);
        } else {
          setProfile(data ?? null);
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to fetch profile");
      } finally {
        setLoadingProfile(false);
      }
    },
    [session, pollProfile]
  );

 
  useEffect(() => {
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setProfile(null); 
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchSession]);


  useEffect(() => {
    if (session?.user) {
      setSplashMessage("Fetching profile...");
      fetchProfile();
    }
  }, [session, fetchProfile]);

  
  if (loadingSession) return <SplashScreen />;
  if (loadingProfile) return <SplashScreen />;


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            fetchSession();
            if (session?.user) fetchProfile(true);
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
