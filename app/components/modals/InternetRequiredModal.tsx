import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function InternetRequiredModal({
  visible,
  onRetry,
}: {
  visible: boolean;
  onRetry: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <LinearGradient
        colors={["#FFFDD0", "#FFD580", "#FFB347"]}
        style={styles.modalBackground}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Internet Required</Text>
          <Text style={styles.message}>
            NutriTakes requires an internet connection to analyze meals and access your data.
          </Text>

          <TouchableOpacity onPress={onRetry} style={styles.button}>
            <Text style={styles.buttonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5C00",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF5C00",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
