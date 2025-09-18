import { auth, db, storage } from "@/Lib/firebase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

 
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoURL(result.assets[0].uri);
    }
  };


  const handleSave = async () => {
    if (!user) return;

    setUploading(true);

    try {
      let downloadURL = photoURL;

  
      if (photoURL && !photoURL.startsWith("https://")) {
        const response = await fetch(photoURL);
        const blob = await response.blob();

        const storageRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }


      const profileRef = doc(db, `profiles/${user.uid}`);
      await updateDoc(profileRef, {
        name,
        photoURL: downloadURL,
      });

   
    await firebaseUpdateProfile(user, { displayName: name, photoURL: downloadURL });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        <Image
          source={{ uri: photoURL || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <Text style={styles.changeText}>Change Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={uploading}>
        <Text style={styles.saveText}>{uploading ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  avatarContainer: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  changeText: { marginTop: 8, color: "#007BFF", fontWeight: "500" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#FFD580",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { fontSize: 16, fontWeight: "700", color: "#0d0d0d" },
});
