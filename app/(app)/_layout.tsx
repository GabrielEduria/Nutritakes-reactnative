import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const icon = (() => {
          switch (route.name) {
            case "Home":
              return "home-outline";
            case "Profile":
              return "person-outline";
            case "Scan":
              return "camera-outline";
            default:
              return "ellipse-outline";
          }
        })();

        if (route.name === "Scan") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.scanButtonContainer}
            >
              <View style={styles.scanButton}>
                <Ionicons name={icon} size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={icon}
              size={24}
              color={isFocused ? "#FF5C00" : "#777"}
            />
            <Text
              style={{
                color: isFocused ? "#FF5C00" : "#777",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function AppLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <SplashScreen />; 
  if (!user) return null; 

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#FFD580" },
        headerTintColor: "#0d0d0d",
        tabBarStyle: { height: 70, backgroundColor: "transparent" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" options={{ title: "Home" }} />
      <Tabs.Screen name="Scan" options={{ title: "Scan" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#FFD580",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  scanButtonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -20,
  },
  scanButton: {
    width: 60,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FF5C00",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
});
