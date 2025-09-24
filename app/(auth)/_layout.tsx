import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

interface UserProfile {
  has_completed_onboarding: boolean;
}

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session ?? null);
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
    if (loading) return;

    const checkOnboarding = async () => {
      if (!session?.user) {
        console.log("No session, showing login");
        router.replace("/(auth)/LoginScreen");
        return;
      }

      console.log("Session loaded:", session.user.id);

      try {
     
        let { data: profile, error } = await supabase
          .from("user_profiles")
          .select("has_completed_onboarding")
          .eq("user_id", session.user.id)
          .maybeSingle<UserProfile>();

        if (error) {
          console.error("Error fetching profile:", error);
        }

        if (!profile) {
          const { data: newProfile, error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              user_id: session.user.id,
              has_completed_onboarding: false,
            })
            .select()
            .maybeSingle<UserProfile>();

          if (insertError) {
            console.error("Error creating profile:", insertError);
            router.replace("/(auth)/onboarding");
            return;
          }

          profile = newProfile;
        }

        if (!profile) {
          console.error("Profile is still null after fetch/insert.");
          router.replace("/(auth)/onboarding");
          return;
        }

        console.log("Profile fetched:", profile);

        if (!profile.has_completed_onboarding) {
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
