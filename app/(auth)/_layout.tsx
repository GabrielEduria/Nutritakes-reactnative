import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AuthLayout() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setLoadingSession(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session ?? null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: any) {

      setError("Failed to fetch session");
    } finally {
      setLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchSession]);

  if (loadingSession) return <SplashScreen />;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            fetchSession();
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
