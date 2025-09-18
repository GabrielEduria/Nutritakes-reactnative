import React from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfileModal({
  visible,
  newName,
  setNewName,
  onCancel,
  onSave,
}: {
  visible: boolean;
  newName: string;
  setNewName: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Edit Profile</Text>
          <TextInput
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { backgroundColor: "#fff", width: "80%", borderRadius: 12, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, width: "100%" },
  button: {
    backgroundColor: "#FF5C00",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
