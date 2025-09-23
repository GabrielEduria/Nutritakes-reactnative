// app/components/cards/WeeklyGoalCard.tsx
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Profile = {
  id: string;
  user_id: string;
  weekly_target_calories?: number | null;
};

export default function WeeklyGoalCard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let channel: any = null;

    async function fetchProfile() {
      try {
        setLoading(true);
        const userRes = await supabase.auth.getUser();
        const userId = userRes?.data?.user?.id;
        if (!userId) {
          setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from("user_profiles")
          .select("id,user_id,weekly_target_calories")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows (some supabase versions); handle gracefully
          throw error;
        }
        setProfile(data ?? null);

        // subscribe to profile changes so the card updates live
        channel = supabase
          .channel(`user_profile:${userId}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "user_profiles", filter: `user_id=eq.${userId}` },
            () => fetchProfile()
          )
          .subscribe();
      } catch (err: any) {
        console.error("WeeklyGoalCard fetchProfile error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const openEditor = () => {
    if (!profile) {
      Alert.alert(
        "Profile missing",
        "Set up your profile (age / weight / height) first to configure weekly goals.",
        [{ text: "OK" }]
      );
      return;
    }
    setInputValue(String(profile.weekly_target_calories ?? ""));
    setModalVisible(true);
  };

  const saveGoal = async () => {
    const parsed = parseInt(inputValue.replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid value", "Please enter a valid number for weekly target calories.");
      return;
    }

    try {
      setSaving(true);
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id;
      if (!userId) throw new Error("Not authenticated");

      if (profile && profile.id) {
        const { error } = await supabase
          .from("user_profiles")
          .update({ weekly_target_calories: parsed })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // If profile missing, do not insert incomplete profile — prompt user instead
        Alert.alert(
          "Complete profile first",
          "Please complete your profile (onboarding) so we can save personalized goals."
        );
        setModalVisible(false);
        return;
      }

      setModalVisible(false);
    } catch (err: any) {
      console.error("WeeklyGoalCard saveGoal error:", err);
      Alert.alert("Save failed", err.message || "Unable to save goal.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Goal</Text>
        <ActivityIndicator style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Weekly Goal</Text>

      <Text style={styles.goalText}>
        {profile?.weekly_target_calories
          ? `${profile.weekly_target_calories} kcal / week`
          : "No weekly target set"}
      </Text>

      <TouchableOpacity style={styles.button} onPress={openEditor}>
        <Text style={styles.buttonText}>{profile ? "Edit Goal" : "Set Goal"}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set weekly target (kcal)</Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g. 14000"
              keyboardType="numeric"
              style={styles.input}
              editable={!saving}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)} disabled={saving}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveBtn]} onPress={saveGoal} disabled={saving}>
                {saving ? <ActivityIndicator /> : <Text style={[styles.modalButtonText, styles.saveText]}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  goalText: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#333" },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "stretch",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 8,
  },
  modalButtonText: { fontSize: 15, color: "#333", fontWeight: "600" },
  saveBtn: { backgroundColor: "#FF5C00" },
  saveText: { color: "#fff" },
});
