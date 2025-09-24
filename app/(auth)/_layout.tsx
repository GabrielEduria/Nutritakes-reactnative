import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.error("Failed to get session:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);


  useEffect(() => {
    if (!loading && session?.user) {
      console.log("Session loaded:", session.user.id);
      const checkOnboarding = async () => {
        try {
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("has_completed_onboarding")
            .eq("user_id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            console.log("Profile fetched:", profile);
          }

          if (!profile?.has_completed_onboarding) {
            router.replace("/(auth)/onboarding");
          } else {
            router.replace("/(app)/Home");
          }
        } catch (err) {
          console.error("Check onboarding failed:", err);
          router.replace("/(auth)/onboarding");
        }
      };
      checkOnboarding();
    } else if (!loading) {
      console.log("No session, showing login");
      router.replace("/(auth)/LoginScreen");
    }
  }, [loading, session, router]);


  if (loading) return <SplashScreen />;


  if (!session?.user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegisterScreen" />
      </Stack>
    );
  }


  return null;
}
