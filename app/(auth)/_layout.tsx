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
      if (!loading) {
        if (session?.user) {
          const checkProfile = async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("age, gender, weight, height, goal")
              .eq("id", session.user.id)
              .single();

            if (!profile || !profile.age || !profile.gender) {
              router.replace("/(auth)/onboarding");
            } else {
              router.replace("/(app)/Home");
            }
          };
          checkProfile();
        } else {
          router.replace("/(auth)/LoginScreen");
        }
      }
    }, [loading, session, router]);


  if (loading) return <SplashScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
    </Stack>
  );
}
