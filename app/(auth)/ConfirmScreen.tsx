import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ConfirmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Confirmed!</Text>
      <Text style={styles.subtitle}>You can now log in to your account.</Text>
      <Link href="/(auth)/LoginScreen" style={styles.link}>
        Go to Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  link: { fontSize: 16, color: "#FF5C00", fontWeight: "600" }
});
