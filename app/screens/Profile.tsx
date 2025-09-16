// app/screens/Profile.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../Lib/firebase";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/LoginScreen"); // redirect to login
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* User Info */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  label: { fontSize: 16, color: "#555", marginBottom: 5 },
  value: { fontSize: 18, fontWeight: "600" },
  logoutButton: {
    width: "100%",
    backgroundColor: "#FF5C00",
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
