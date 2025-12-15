import AppHeader from "@/app/components/ui/AppHeader";
import SplashScreen from "@/app/SplashScreen";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width / 375;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        const iconName: React.ComponentProps<typeof Ionicons>["name"] =
          route.name === "Dashboard"
            ? "bar-chart-outline"
            : route.name === "Profile"
            ? "person-outline"
            : "camera-outline";

        if (route.name === "Scan") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => router.push("/Scan")}
              style={styles.scanButtonContainer}
            >
              <View style={styles.scanButton}>
                <Ionicons name={iconName} size={28 * scale} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
            <Ionicons
              name={iconName}
              size={24 * scale}
              color={isFocused ? "#FF5C00" : "#777"}
            />
            <Text
              style={{
                color: isFocused ? "#FF5C00" : "#777",
                fontSize: 12 * scale,
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
    let isMounted = true;

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted) setUser(session?.user ?? null);
      } catch (err) {
        console.error("Failed to get session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <SplashScreen />;
  if (!user) return null;

  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => <AppHeader title={options.title as string} />, 
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="Scan" options={{ title: "Scan" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: Platform.OS === "ios" ? height * 0.07 : height * 0.05,
    left: width * 0.02,
    right: width * 0.02,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  scanButtonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -height * 0.03,
  },
  scanButton: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: "#FF5C00",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
});
