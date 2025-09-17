import ConfirmationModal from "@/app/components/modals/ConfirmationModal";
import ErrorModal from "@/app/components/modals/ErrorModal";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../Lib/firebase";

export default function CredentialsScreen() {
  const { name, photo } = useLocalSearchParams<{ name: string; photo: string }>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      setErrorVisible(true);
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCred.user, { displayName: name, photoURL: photo });
      await sendEmailVerification(userCred.user);

      await setDoc(doc(db, "profiles", userCred.user.uid), {
        name,
        email,
        photoURL: photo,
        createdAt: serverTimestamp(),
      });

      setConfirmationVisible(true); // Show confirmation modal
    } catch (err: any) {
      console.error("Register error:", err.message);
      setErrorMessage(err.message);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Almost done! Let’s set up your email and password.</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation modal navigates to LoginScreen */}
      <ConfirmationModal
        visible={confirmationVisible}
        message="Registration successful! Please check your email for verification."
        onClose={() => router.replace("/(auth)/LoginScreen")}
      />

      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#808080",
    fontSize: 16,
  },
  button: { width: "100%", height: 55, backgroundColor: "#FF5C00", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
