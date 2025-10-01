import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export type MealFeedbackModalProps = {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
  onSubmit?: (feedback: string) => void; 
  onSuccess?: (msg: string) => void; 
  onError?: (msg: string) => void;
};

const MealFeedbackModal: React.FC<MealFeedbackModalProps> = ({
  visible,
  onClose,
  userId,
  onSubmit,
  onSuccess,
  onError,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      onError?.("Feedback cannot be empty");
      return;
    }

    try {
      onSubmit?.(feedback.trim());
      onSuccess?.("Feedback submitted successfully!");
      setFeedback("");
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      onError?.("Failed to submit feedback");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Meal Feedback</Text>

          <TextInput
            style={styles.input}
            placeholder="Write your feedback..."
            placeholderTextColor="#999"
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.submit]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
    color: "#000",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancel: {
    backgroundColor: "#aaa",
  },
  submit: {
    backgroundColor: "#FF5C00", 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MealFeedbackModal;
