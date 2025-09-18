import React from "react";
import { StyleSheet, Text, View } from "react-native";

type InfoCardProps = {
  name?: string;
  email?: string;
  verified?: boolean;
};

const InfoCard: React.FC<InfoCardProps> = ({ name, email, verified }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name || "User"}</Text>
      <Text style={styles.email}>{email || "example@email.com"}</Text>
      <Text style={[styles.verified, verified ? styles.verifiedTrue : styles.verifiedFalse]}>
        {verified ? " Verified Email" : " Not Verified"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0d0d0d",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  verified: {
    fontSize: 14,
  },
  verifiedTrue: {
    color: "green",
  },
  verifiedFalse: {
    color: "red",
  },
});

export default InfoCard;
