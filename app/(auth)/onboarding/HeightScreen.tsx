import { saveProfileField } from "@/lib/profileService";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = { 
  onNext: () => void; 
  onBack?: () => void;   
};

export default function HeightScreen({ onNext }: Props) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    const parsed = parseFloat(value.replace(/[^\d.]/g, ""));
    if (Number.isNaN(parsed) || parsed <= 0) return Alert.alert("Invalid value", "Enter a valid weight.");
    try {
      setSaving(true);
      await saveProfileField({ weight: parsed });
      onNext();
    } catch (err: any) {
      Alert.alert("Save failed", err.message || "Could not save weight.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What&apos;s your height (ft)?</Text>
      <TextInput style={styles.input} placeholder="e.g. 70" keyboardType="numeric" value={value} onChangeText={setValue} />
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