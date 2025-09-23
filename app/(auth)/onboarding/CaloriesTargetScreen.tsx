import { saveProfileField } from "@/lib/profileService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = { 
  onNext: () => void; 
  onBack?: () => void;   
};

export default function CaloriesTargetScreen({ onNext }: Props) {
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const parsed = parseInt(val.replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed) || parsed <= 0) return Alert.alert("Invalid", "Enter a valid weekly calorie target.");
    try {
      setSaving(true);
      await saveProfileField({ weekly_target_calories: parsed });
      onNext();
    } catch (err: any) {
      Alert.alert("Save failed", err.message || "Could not save target.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly calorie target (kcal)</Text>
      <TextInput keyboardType="numeric" value={val} onChangeText={setVal} placeholder="e.g. 14000" style={styles.input} />
      <TouchableOpacity style={styles.nextBtn} onPress={submit} disabled={saving}>
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
