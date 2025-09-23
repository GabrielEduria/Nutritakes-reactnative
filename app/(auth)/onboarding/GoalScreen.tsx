// app/(auth)/onboarding/GoalScreen.tsx
import { saveProfileField } from "@/lib/profileService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { 
  onNext: () => void; 
  onBack?: () => void;   
};

export default function GoalScreen({ onNext }: Props) {
  const [saving, setSaving] = useState(false);

  const choose = async (goal: "lose_weight" | "maintain" | "gain_muscle") => {
    try {
      setSaving(true);
      await saveProfileField({ goal });
      onNext();
    } catch (err: any) {
      Alert.alert("Save failed", err.message || "Could not save goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What&apos;s your main goal?</Text>
      <View style={styles.col}>
        <TouchableOpacity style={styles.option} onPress={() => choose("lose_weight")}>
          <Text style={styles.optionText}>Lose weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => choose("maintain")}>
          <Text style={styles.optionText}>Maintain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => choose("gain_muscle")}>
          <Text style={styles.optionText}>Gain muscle</Text>
        </TouchableOpacity>
      </View>
      {saving && <ActivityIndicator style={{ marginTop: 12 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFFDD0" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  col: { marginTop: 12, gap: 12 },
  option: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginVertical: 8, alignItems: "center" },
  optionText: { fontSize: 16, fontWeight: "700" },
});
