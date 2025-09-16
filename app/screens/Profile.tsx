import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../Lib/firebase";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  // Placeholder stats
  const stats = [
    { label: "Meals Logged", value: 42 },
    { label: "Calories Today", value: 1450 },
    { label: "Dishes Recognized", value: 18 },
  ];

  // Placeholder profile image
  const avatar = "https://via.placeholder.com/120";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/LoginScreen");
    } catch (error: any) {
      alert("Logout Failed: " + error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: avatar }} style={styles.avatar} />

        <Text style={styles.greeting}>Hello, {user?.displayName || "User"}!</Text>
        <Text style={styles.subtitle}>Manage your account & track your stats</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Email Verified:</Text>
          <Text style={styles.value}>
            {user?.emailVerified ? "Yes ✅" : "No ❌"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingBottom: 30, paddingTop: 20, alignItems: "center" },

  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  greeting: { fontSize: 26, fontWeight: "700", color: "#0d0d0d", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#333", marginBottom: 20 },

  infoCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  label: { fontSize: 14, color: "#555", marginTop: 8 },
  value: { fontSize: 16, fontWeight: "600", color: "#0d0d0d" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
    alignSelf: "flex-start",
    marginLeft: 20,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 14, color: "#555", textAlign: "center", marginTop: 4 },

  actionsContainer: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 20 },
  actionButton: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  logoutButton: {
    width: "90%",
    backgroundColor: "#FF5C00",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
