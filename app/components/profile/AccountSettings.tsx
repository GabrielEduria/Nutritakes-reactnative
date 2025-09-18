import ConfirmationModal from "@/app/components/modals/ConfirmationModal";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AccountSettingsProps = {
  onEditProfile: () => void;
  onResetPassword: () => void;
  onLogout: () => void;
};

const AccountSettings: React.FC<AccountSettingsProps> = ({
  onEditProfile,
  onResetPassword,
  onLogout,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmReset = () => {
    setShowResetModal(false);
    onResetPassword();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>

   
      <TouchableOpacity style={styles.button} onPress={onEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setShowResetModal(true)}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

  
      <ConfirmationModal
        visible={showResetModal}
        title="Reset Password"
        message="Send password reset link to your email?"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0d0d0d",
  },
  button: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d0d0d",
  },
  logoutButton: {
    backgroundColor: "#FF5C00",
  },
  logoutText: {
    color: "#fff",
  },
});

export default AccountSettings;
