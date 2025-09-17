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
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {user?.displayName || "User"}!</Text>
        <Text style={styles.subtitle}>Manage your account & track your stats</Text>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Verified</Text>
            <Text style={styles.value}>{user?.emailVerified ? "Yes ✅" : "No ❌"}</Text>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Actions */}
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 50,
  },

  avatarWrapper: {
    borderRadius: 70,
    padding: 4,
    backgroundColor: "#FF5C00",
    marginBottom: 16,
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },

  greeting: { fontSize: 28, fontWeight: "800", color: "#0d0d0d", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 24, textAlign: "center" },

  infoCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  infoRow: { marginBottom: 12 },
  label: { fontSize: 14, color: "#888" },
  value: { fontSize: 16, fontWeight: "700", color: "#0d0d0d", marginTop: 2 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0d0d0d",
    marginLeft: 20,
    alignSelf: "flex-start",
    marginVertical: 14,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: "#FF5C00" },
  statLabel: { fontSize: 14, color: "#555", marginTop: 6, textAlign: "center" },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FF5C00",
    paddingVertical: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5C00",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logoutButton: {
    width: "90%",
    backgroundColor: "#FF5C00",
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5C00",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
