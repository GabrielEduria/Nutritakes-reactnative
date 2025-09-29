import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function RootLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(app)/Dashboard"); 
      } else {
        router.replace("/(auth)/LoginScreen"); 
      }
    }
  }, [loading, router, user]);

  if (loading) return <SplashScreen />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
