import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


type NameScreenProps = {
  onNext?: (enteredName: string) => void; 
};

export default function NameScreen({ onNext }: NameScreenProps) {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (name.trim() === "") return;


    if (onNext) onNext(name);


    router.push({ pathname: "/(auth)/register/PhotoScreen", params: { name } });
  };

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.container}>
      <View style={styles.inner}>
           <Image
              source={require("@/assets/images/icon/NT.png")}
              style={styles.logo}
              resizeMode="contain"
            />
        <Text style={styles.title}>What&apos;s your name?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  logo: { width: 140, height: 140, marginBottom: 20 },
  input: {
    width: "100%",
    height: 55,
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
    height: 55,
    backgroundColor: "#FF5C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
