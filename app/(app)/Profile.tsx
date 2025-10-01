import { supabase } from "@/lib/supabase";
import { MealWithId } from "@/types/meal";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundPattern from "../components/background/BackgroundPattern";
import HistoryCard from "../components/cards/HistoryCard";
import NutritionLabelCard from "../components/cards/NutritionLabelCard";
import ErrorModal from "../components/modals/ErrorModal";
import FeedbackModal from "../components/modals/FeedbackModal";
import SuccessModal from "../components/modals/SuccessModal";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [meals, setMeals] = useState<MealWithId[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedMeal, setSelectedMeal] = useState<MealWithId | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      setLoadingSession(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoadingSession(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMeals = async () => {
      setLoadingMeals(true);
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to fetch meals.");
      } else {
        setMeals(data as MealWithId[]);
      }
      setLoadingMeals(false);
    };

    fetchMeals();
  }, [user?.id]);

  const handleDelete = (meal: MealWithId) => {
    if (!user?.id) return;

    Alert.alert(
      "Delete Meal",
      `Are you sure you want to delete "${meal.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("meals")
              .delete()
              .eq("id", meal.id)
              .eq("user_id", user.id);

            if (error) {
              setError("Failed to delete meal.");
            } else {
              setMeals(prev => prev.filter(m => m.id !== meal.id));
              setSuccess("Meal deleted successfully!");
              setSelectedMeal(null);
            }
          }
        }
      ]
    );
  };

  const handleResetPassword = async () => {
    if (!user?.email) return setError("No email found for this account");

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: "exp://127.0.0.1:19000",
    });
    if (error) {
      setError("Failed to send password reset email. Try again.");
    } else {
      setSuccess("Password reset email sent successfully!");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError("Failed to log out.");
    } else {
      setMeals([]);
      setUser(null);
      router.replace("/(auth)/LoginScreen");
    }
  };

  if (loadingSession) {
    return (
      <View style={[styles.background, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FF5C00" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
      <BackgroundPattern>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.infoCard}>
            <Text style={styles.email}>{user.email ?? "Email Placeholder"}</Text>
            <Text style={styles.verified}>
              {user.emailVerified ? "Account Verified" : "Account Not Verified"}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setFeedbackVisible(true)}>
              <Text style={styles.buttonText}>Give Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mealsSection}>
            <Text style={styles.sectionTitle}>Your Meals</Text>
            {loadingMeals ? (
              <ActivityIndicator size="large" color="#FF5C00" />
            ) : meals.length === 0 ? (
              <Text style={styles.emptyText}>No meals logged yet.</Text>
            ) : (
              meals.map((meal) => (
                <HistoryCard
                  key={meal.id}
                  meal={meal}
                  onDelete={handleDelete}
                  onView={() => setSelectedMeal(meal)}
                />
              ))
            )}
          </View>

          <Modal
            visible={!!selectedMeal}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedMeal(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedMeal?.image_url && (
                  <Image
                    source={{ uri: selectedMeal.image_url }}
                    style={styles.modalImage}
                  />
                )}
                {selectedMeal && <NutritionLabelCard meal={selectedMeal} />}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={() => setFeedbackVisible(true)}
                  >
                    <Text style={styles.buttonText}>Feedback</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(selectedMeal)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedMeal(null)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <FeedbackModal
            visible={feedbackVisible}
            onClose={() => setFeedbackVisible(false)}
            userId={user?.id ?? ""}
            onSubmit={(feedback) => console.log("Feedback:", feedback)}
            onSuccess={(msg) => setSuccess(msg ?? null)}
            onError={(msg) => setError(msg ?? null)}
          />

          <ErrorModal visible={!!error} message={error ?? ""} onClose={() => setError(null)} />
          <SuccessModal visible={!!success} message={success ?? ""} onClose={() => setSuccess(null)} />
        </ScrollView>
      </BackgroundPattern>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    paddingBottom: 60,
    paddingTop: 20,
    alignItems: "center",
    width: "100%",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    marginBottom: 20,
    elevation: 5,
  },
  email: { color: "#000", fontSize: 16, marginBottom: 6 },
  verified: { color: "#000", fontSize: 14 },
  actions: { marginTop: 10, width: "90%" },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logout: { backgroundColor: "#E53935" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  mealsSection: { width: "90%", marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#000" },
  emptyText: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 10 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    maxHeight: "85%",
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  feedbackButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#FF5C00",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#E53935",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
