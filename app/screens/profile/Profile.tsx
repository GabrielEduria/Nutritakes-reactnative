import { auth } from "@/Lib/firebase";
import { getUserMeals, getUserProfile, sendPasswordReset } from "@/Lib/firebaseHelpers";
import { Meal } from "@/app/data/meal";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import AccountSettings from "@/app/components/profile/AccountSettings";
import ActionsSection from "@/app/components/profile/ActionsSection";
import AvatarSection from "@/app/components/profile/AvatarSection";
import InfoCard from "@/app/components/profile/InfoCard";
import StatsSection from "@/app/components/profile/StatsSection";

// Define the UserProfile type
type UserProfile = {
  name?: string;
  photoURL?: string;
  createdAt?: any;
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);

        const history = await getUserMeals(user.uid);
        setMeals(history);
      } catch (err) {
        console.log("Error fetching profile:", err);
      }
    })();
  }, [user]);

  const handleResetPassword = async (): Promise<void> => {
    if (!user?.email) return;
    await sendPasswordReset(user.email);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.replace("/(auth)/LoginScreen");
  };

  const handleEditProfile = () => {
    router.push("/screens/profile/EditProfileScreen");
  };

  // Early return if user not logged in
  if (!user) return null;

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topSection}>
          <AvatarSection photoURL={profile?.photoURL ?? undefined} />
          <InfoCard
            name={profile?.name ?? user.displayName ?? "User"}
            email={user.email ?? undefined}
            verified={user.emailVerified}
          />
          <StatsSection meals={meals} />
        </View>

        <ActionsSection meals={meals} />

        <AccountSettings
          onEditProfile={handleEditProfile}
          onResetPassword={handleResetPassword}
          onLogout={handleLogout}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: "center",
    width: "100%",
  },
  topSection: {
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
  },
});
