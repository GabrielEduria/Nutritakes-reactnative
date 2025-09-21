import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams<{ welcome?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NutriTakes!</Text>
      {params.welcome && (
        <Text style={styles.subtitle}>Message: {params.welcome}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/Scan")}
      >
        <Text style={styles.buttonText}>Scan a Meal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  button: {
    backgroundColor: "#FF5C00",
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
