import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
  
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    initAuth();

 
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session ? (
        <>
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="RegisterScreen" />
        </>
      ) : (
        <Stack.Screen name="(app)" />
      )}
    </Stack>
  );
}
