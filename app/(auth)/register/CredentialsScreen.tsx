import ConfirmationModal from "@/app/components/modals/ConfirmationModal";
import ErrorModal from "@/app/components/modals/ErrorModal";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../Lib/firebase";

type CredentialsScreenProps = {
  name: string;
  photo: string | null;
};

const firebaseErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
};


export default function CredentialsScreen({ name, photo }: CredentialsScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

const handleRegister = async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCred.user, { displayName: name, photoURL: photo || "" });
    await sendEmailVerification(userCred.user);

    await setDoc(doc(db, "profiles", userCred.user.uid), {
      name,
      email,
      photoURL: photo || "",
      createdAt: serverTimestamp(),
    });

    setConfirmationVisible(true);

  } catch (err: any) {

    const friendlyMessage = err.code ? firebaseErrorMessages[err.code] : "Something went wrong. Please try again.";
    setErrorMessage(friendlyMessage);
    setErrorVisible(true);
  }
};


  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("@/assets/images/icon/NT.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Almost done! Let’s set up your email and password.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>


      <ConfirmationModal
        visible={confirmationVisible}
        message="Registration successful! Please verify your email."
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
  logo: { width: 140, height: 140, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { width: "100%", height: 55, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: "#808080" },
  button: { width: "100%", height: 55, backgroundColor: "#FF5C00", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
