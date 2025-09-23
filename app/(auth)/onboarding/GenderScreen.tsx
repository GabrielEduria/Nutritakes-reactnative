// app/(auth)/onboarding/GenderScreen.tsx
import { saveProfileField } from "@/lib/profileService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { 
  onNext: () => void; 
  onBack?: () => void;   
};

export default function GenderScreen({ onNext }: Props) {
  const [saving, setSaving] = useState(false);
  const choose = async (gender: "male" | "female") => {
    try {
      setSaving(true);
      await saveProfileField({ gender });
      onNext();
    } catch (err: any) {
      Alert.alert("Save failed", err.message || "Could not save gender.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your gender?</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.option} onPress={() => choose("male")}>
          <Text style={styles.optionText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => choose("female")}>
          <Text style={styles.optionText}>Female</Text>
        </TouchableOpacity>
      </View>
      {saving && <ActivityIndicator style={{ marginTop: 12 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFFDD0" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  option: { backgroundColor: "#fff", padding: 18, borderRadius: 10, minWidth: 120, alignItems: "center" },
  optionText: { fontSize: 16, fontWeight: "700" },
});
