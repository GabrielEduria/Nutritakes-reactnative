import ErrorModal from "@/app/components/modals/ErrorModal";
import SuccessModal from "@/app/components/modals/SuccessModal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, } from "react";
import {
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["#FFFDD0", "#FFD580", "#FFB347"]}
          style={styles.background}
        >
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

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Don’t have an account?{" "}
                <Text style={styles.linkBold} onPress={() => router.push("/(auth)/RegisterScreen")}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>

      <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
      <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 140, height: 140, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#0d0d0d", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 30 },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#808080",
    width: "100%",
  },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
  button: { backgroundColor: "#FF5C00", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 10, elevation: 2, width: "100%" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { fontSize: 14, color: "#333" },
  linkBold: { color: "#FF5C00", fontWeight: "700" },
});
