import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../Lib/firebase";
import ErrorModal from "../components/ErrorModal";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    // --- Client-side validation ---
    if (!email.trim()) {
      setErrorMessage("Email is required.");
      setModalVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setModalVisible(true);
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setModalVisible(true);
      return;
    }

    // --- Firebase registration ---
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      setErrorMessage(
        "A verification email has been sent. Please check your inbox before logging in."
      );
      setModalVisible(true);

      // Clear input fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("❌ Register error:", error.message);
      setErrorMessage(error.message);
      setModalVisible(true);
    }
  };

  return (
    <>
      <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
        <View style={styles.inner}>
          <Image
            source={require("@/assets/images/icon/NT.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/(auth)/LoginScreen" style={styles.loginLink}>
              Login here
            </Link>
          </View>
        </View>
      </LinearGradient>

      <ErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 30, color: "#0d0d0d" },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  loginContainer: { flexDirection: "row", marginTop: 20 },
  loginText: { fontSize: 15, color: "#333" },
  loginLink: { fontSize: 15, fontWeight: "600", color: "#FF5C00" },
});
