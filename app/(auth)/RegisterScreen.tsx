import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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

import ConfirmationModal from "@/app/components/modals/ConfirmationModal";

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

  setLoading(true);
  setError("");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'nutritakes://auth/confirm',
    },
  });

  if (error) {
    setError(error.message);
  } else {
    setShowVerifyModal(true);
  }

  setLoading(false);
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
                {loading ? "Creating Account..." : "Register"}
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
        </LinearGradient>
      </KeyboardAvoidingView>

 
      <ConfirmationModal
        visible={showVerifyModal}
        message="We’ve sent you a link to verify your email. Please check your inbox before logging in."
        onClose={() => {
          setShowVerifyModal(false);
          router.replace("/(auth)/LoginScreen");
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: { width: 140, height: 140, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0d0d0d",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
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
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#333",
  },
  linkBold: {
    color: "#FF5C00",
    fontWeight: "700",
  },
});
