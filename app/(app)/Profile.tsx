import { Meal } from "@/app/data/meal";
import { auth } from "@/lib/firebase";
import {
  getUserMeals,
  getUserProfile,
  sendPasswordReset,
} from "@/lib/firebaseHelpers";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // Instead of pushing to a screen, this could open your EditProfileModal
    // router.push("/screens/profile/EditProfileScreen");
  };

  if (!user) return null;

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topSection}>
          {/* ✅ Avatar as rectangle card */}
          {profile?.photoURL ? (
            <Image
              source={{ uri: profile.photoURL }}
              style={styles.avatarRect}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatarRect, styles.avatarPlaceholder]}>
              <Text style={styles.avatarPlaceholderText}>
                {profile?.name?.charAt(0) ??
                  user.displayName?.charAt(0) ??
                  "U"}
              </Text>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.name}>
              {profile?.name ?? user.displayName ?? "User"}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.verified}>
              {user.emailVerified ? "Verified ✅" : "Not Verified ❌"}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  avatarRect: {
    width: 140,
    height: 90,
    borderRadius: 12, // ✅ rounded rectangle, not a circle
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#555",
  },
  infoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  verified: {
    fontSize: 12,
    color: "#888",
  },
  actions: {
    marginTop: 20,
    width: "90%",
  },
  button: {
    backgroundColor: "#FF914D",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logout: {
    backgroundColor: "#E63946",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
