// app/(auth)/onboarding/AgeScreen.tsx
import { saveProfileField } from "@/lib/profileService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = { 
  onNext: () => void; 
  onBack?: () => void;   
};

export default function AgeScreen({ onNext }: Props) {
  const [age, setAge] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    const parsed = parseInt(age.replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed) || parsed <= 0) return Alert.alert("Invalid age", "Please enter a valid age.");
    try {
      setSaving(true);
      await saveProfileField({ age: parsed });
      onNext();
    } catch (err: any) {
      Alert.alert("Save failed", err.message || "Could not save age.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How old are you?</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="e.g. 28"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        editable={!saving}
      />

      <TouchableOpacity style={styles.nextBtn} onPress={onSubmit} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextText}>Next</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFFDD0" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fff" },
  nextBtn: { marginTop: 16, backgroundColor: "#FF5C00", padding: 12, borderRadius: 10, alignItems: "center" },
  nextText: { color: "#fff", fontWeight: "700" },
});
