import ConfirmationModal from "@/app/components/modals/ConfirmationModal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundPattern from "../components/background/BackgroundPattern";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: { emailRedirectTo: "nutritakes://auth/confirm" },
      });

      if (error) {
        console.error("SignUp Error:", error);
        setError(error.message);
      } else if (data.user) {
        setShowVerifyModal(true);
      } else {
        setError("Unexpected error during registration. Try again.");
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("Failed to register. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFFDD0", "#FFD580", "#FFB347"]}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <BackgroundPattern>
            <View style={styles.container}>
              <Image
                source={require("@/assets/images/icon/NT.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Creating Account..." : "Sign up"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Already have an account?{" "}
                  <Text style={styles.linkBold}>
                    <Link href="/(auth)/LoginScreen">Login</Link>
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </BackgroundPattern>
        </KeyboardAvoidingView>
      </ScrollView>

      <ConfirmationModal
        visible={showVerifyModal}
        message="We’ve sent you a link to verify your email. Please check your inbox before logging in."
        onClose={() => {
          setShowVerifyModal(false);
          router.replace("/(auth)/LoginScreen");
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#0d0d0d",
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#333",
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    marginBottom: height * 0.02,
    fontSize: width * 0.045,
    borderWidth: 1,
    borderColor: "#808080",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: height * 0.015,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: height * 0.022,
    borderRadius: 12,
    alignItems: "center",
    marginTop: height * 0.01,
    elevation: 2,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  linkContainer: { marginTop: height * 0.025, alignItems: "center" },
  linkText: { fontSize: width * 0.035, color: "#333" },
  linkBold: { color: "#FF5C00", fontWeight: "700" },
});
