import React from "react";
import { Image, StyleSheet, View } from "react-native";

type AvatarSectionProps = {
  photoURL?: string;
};

const AvatarSection: React.FC<AvatarSectionProps> = ({ photoURL }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoURL || "https://via.placeholder.com/100" }}
        style={styles.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default AvatarSection;
