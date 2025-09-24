// app/(auth)/onboarding/ReviewAndSaveScreen.tsx
import { fetchProfile } from "@/lib/profileService";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { 
  onDone: () => void; 
  onBack?: () => void;   
};

export default function ReviewAndSaveScreen({ onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await fetchProfile();
      setProfile(p);
      setLoading(false);
    };
    load();
  }, []);

  const finish = async () => {
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id;
      if (userId) {
        await supabase
          .from("user_profiles")
          .update({ has_completed_onboarding: true })
          .eq("user_id", userId);
      }

      router.replace("/(app)/Home");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review your info</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{profile?.age ?? "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{profile?.gender ?? "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weight (kg)</Text>
            <Text style={styles.value}>{profile?.weight ?? "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height (cm)</Text>
            <Text style={styles.value}>{profile?.height ?? "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>{profile?.goal ?? "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weekly Target</Text>
            <Text style={styles.value}>{profile?.weekly_target_calories ?? "—"}</Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 18 }}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#eee" }]} onPress={() => onBack?.()}>
              <Text style={{ fontWeight: "700" }}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, { backgroundColor: "#FF5C00", marginLeft: 12 }]} onPress={finish}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Start Using App</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#FFFDD0" },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 18, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 16, fontWeight: "700" },
  btn: { padding: 12, borderRadius: 10 },
});
