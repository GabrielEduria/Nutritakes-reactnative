import { supabase } from "@/lib/supabase";
import { MealWithId } from "@/types/meal";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 380;
  const containerWidth = isSmallScreen ? "90%" : "85%";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const modalImageHeight = isSmallScreen ? 180 : 220;

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

    Alert.alert("Delete Meal", `Are you sure you want to delete "${meal.name}"?`, [
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
            setMeals((prev) => prev.filter((m) => m.id !== meal.id));
            setSuccess("Meal deleted successfully!");
            setSelectedMeal(null);
          }
        },
      },
    ]);
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
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
          <View style={[styles.infoCard, { width: containerWidth }]}>
            <Text style={[styles.email, { fontSize: isSmallScreen ? 15 : 16 }]}>
              {user.email ?? "Email Placeholder"}
            </Text>
            <Text style={[styles.verified, { fontSize: isSmallScreen ? 13 : 14 }]}>
              ✅ Account Verified
            </Text>
          </View>

          <View style={[styles.actions, { width: containerWidth }]}>
            <TouchableOpacity style={styles.button} onPress={() => setFeedbackVisible(true)}>
              <Text style={styles.buttonText}>Give Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logout]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mealsSection, { width: containerWidth }]}>
            <Text style={[styles.sectionTitle, { fontSize: isSmallScreen ? 17 : 18 }]}>
              Your Meals
            </Text>
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
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              >
                <View style={styles.modalContent}>
                  <ScrollView
                    contentContainerStyle={styles.modalScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {selectedMeal?.image_url && (
                      <Image
                        source={{ uri: selectedMeal.image_url }}
                        style={styles.modalImage}
                        resizeMode="cover"
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
                        onPress={() => selectedMeal && handleDelete(selectedMeal)}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedMeal(null)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
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

          <ErrorModal
            visible={!!error}
            message={error ?? ""}
            onClose={() => setError(null)}
          />
          <SuccessModal
            visible={!!success}
            message={success ?? ""}
            onClose={() => setSuccess(null)}
          />
        </ScrollView>
      </BackgroundPattern>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { paddingTop: 20, alignItems: "center", width: "100%" },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
  },
  email: { color: "#000", marginBottom: 6 },
  verified: { color: "#000" },
  actions: { marginTop: 10 },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  logout: { backgroundColor: "#E53935" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  mealsSection: { marginTop: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 10, color: "#000" },
  emptyText: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 10 },

modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
modalContent: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  width: "95%",
  maxHeight: "auto",
  justifyContent: "flex-start",
},
modalScrollContent: {
  paddingBottom: 120, 
  alignItems: "center",
},
modalImage: {
  width: "100%",
  height: 180,
  borderRadius: 10,
  marginBottom: 5,
  marginTop: 25,
},
modalActions: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
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
