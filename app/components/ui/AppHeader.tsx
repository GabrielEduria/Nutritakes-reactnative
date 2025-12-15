import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "",
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
}) => {
  return (
    <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.header}>
      <View style={styles.headerContent}>

        {showBack ? (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <Image
            source={require("@/assets/images/NT.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress}>
            <Ionicons name={rightIcon} size={22} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} /> 
        )}
      </View>
    </LinearGradient>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 14,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
});
