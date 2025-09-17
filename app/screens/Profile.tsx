import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db, storage } from "../../Lib/firebase";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<{ name?: string; picture?: string; email?: string }>({});
  const [meals, setMeals] = useState<any[]>([]);
  const [stats, setStats] = useState({ mealsLogged: 0, caloriesToday: 0, dishesRecognized: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, "profiles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile({ email: user.email, name: user.displayName, picture: user.photoURL });
      }
    };

    const fetchMeals = async () => {
      const mealsCol = collection(db, "profiles", user.uid, "meals");
      const mealDocs = await getDocs(mealsCol);
      const mealsData = mealDocs.docs.map((d) => d.data());
      setMeals(mealsData);

      const today = new Date();
      const caloriesToday = mealsData
        .filter((meal) => {
          const mealDate = meal.timestamp?.toDate ? meal.timestamp.toDate() : new Date(meal.timestamp);
          return (
            mealDate.getDate() === today.getDate() &&
            mealDate.getMonth() === today.getMonth() &&
            mealDate.getFullYear() === today.getFullYear()
          );
        })
        .reduce((sum, meal) => sum + (meal.calories || 0), 0);

      const uniqueDishes = new Set(mealsData.map((meal) => meal.name));
      setStats({ mealsLogged: mealsData.length, caloriesToday, dishesRecognized: uniqueDishes.size });
      setLoading(false);
    };

    fetchProfile();
    fetchMeals();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/LoginScreen");
    } catch (error: any) {
      alert("Logout Failed: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert("Password Reset", "Password reset email sent successfully!");
    } catch (err: any) {
      Alert.alert("Error", "Failed to send reset email: " + err.message);
    }
  };

  const handleEditProfile = async () => {
    let newName = profile.name || "";
    let newImageUri: string | null = null;


    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) newImageUri = result.uri;

    Alert.prompt("Edit Name", "Enter your new display name", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async (text) => {
          newName = text || newName;

          let photoURL = user?.photoURL;

          if (newImageUri) {
            const response = await fetch(newImageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profiles/${user?.uid}/avatar.jpg`);
            await uploadBytes(storageRef, blob);
            photoURL = await getDownloadURL(storageRef);
          }


          await updateProfile(user!, { displayName: newName, photoURL });

          await setDoc(doc(db, "profiles", user!.uid), { name: newName, picture: photoURL }, { merge: true });

          setProfile({ ...profile, name: newName, picture: photoURL });
        },
      },
    ]);
  };

  if (loading) return <Text style={{ flex: 1, textAlign: "center", marginTop: 50 }}>Loading...</Text>;

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>

        <Image source={{ uri: profile.picture || user?.photoURL || "https://via.placeholder.com/120" }} style={styles.avatar} />


        <Text style={styles.greeting}>Hello, {profile.name || "User"}!</Text>
        <Text style={styles.subtitle}>Manage your account & track your stats</Text>


        <View style={styles.infoCard}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email || user?.email}</Text>

          <Text style={styles.label}>Email Verified:</Text>
          <Text style={styles.value}>{user?.emailVerified ? "Yes ✅" : "No ❌"}</Text>
        </View>


        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.mealsLogged}</Text>
            <Text style={styles.statLabel}>Meals Logged</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.caloriesToday}</Text>
            <Text style={styles.statLabel}>Calories Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.dishesRecognized}</Text>
            <Text style={styles.statLabel}>Dishes Recognized</Text>
          </View>
        </View>

  
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
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
