import ErrorModal from "@/app/components/modals/ErrorModal";
import SuccessModal from "@/app/components/modals/SuccessModal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
    } else if (data.user) {
      setSuccess("Login successful!");
      router.replace("/(app)/Dashboard");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp://127.0.0.1:19000", 
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
    }
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login with your email</Text>

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

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={{ color: "#FF5C00", fontSize: width * 0.035, textAlign: "right" }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkContainer}>
                <Text style={styles.linkText}>
                  Don’t have an account?{" "}
                  <Text
                    style={styles.linkBold}
                    onPress={() => router.push("/(auth)/RegisterScreen")}
                  >
                    Sign Up
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </BackgroundPattern>
        </KeyboardAvoidingView>

        <ErrorModal
          visible={!!error}
          message={error ?? ""}
          onClose={() => setError(null)}
        />
        <SuccessModal
          visible={!!success}
          message={success ?? ""}
          onClose={() => setSuccess(null)}
        />
      </ScrollView>
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
  error: { color: "red", marginBottom: height * 0.015, textAlign: "center" },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: height * 0.022,
    borderRadius: 12,
    alignItems: "center",
    marginTop: height * 0.01,
    elevation: 2,
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: width * 0.045, fontWeight: "600" },
  linkContainer: { marginTop: height * 0.025, alignItems: "center" },
  linkText: { fontSize: width * 0.035, color: "#333" },
  linkBold: { color: "#FF5C00", fontWeight: "700" },
});
