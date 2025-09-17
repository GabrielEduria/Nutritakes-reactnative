import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../Lib/firebase";
import ErrorModal from "../components/modals/ErrorModal";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setErrorMessage(
          "Please verify your email first. Check your inbox or spam folder."
        );
        setModalVisible(true);
        return;
      }

      console.log("Successfully Logged in:", user.email);

      router.replace("/screens/AppLayout");
    } catch (error: any) {
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

          <Text style={styles.title}>NutriTakes Login</Text>

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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don’t have an account? </Text>
            <Link href="/(auth)/register/NameScreen" style={styles.registerLink}>
              Register here
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
  logo: { width: 140, height: 140, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 30, color: "#0d0d0d" },
  input: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#808080",
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: { fontSize: 20, fontWeight: "600", color: "#fff" },
  registerContainer: { flexDirection: "row", marginTop: 20 },
  registerText: { fontSize: 16, color: "#333" },
  registerLink: { fontSize: 16, fontWeight: "600", color: "#FF5C00" },
});
