// app/components/DishCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type DishCardProps = {
  name: string;
  image: string; // URI of the dish
  description?: string;
};

export default function DishCard({ name, image, description }: DishCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  description: { fontSize: 14, color: "#555", textAlign: "center" },
});
