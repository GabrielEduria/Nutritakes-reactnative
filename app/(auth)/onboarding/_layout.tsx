import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="AgeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AgeScreen" />
      <Stack.Screen name="GenderScreen" />
      <Stack.Screen name="WeightScreen" />
      <Stack.Screen name="HeightScreen" />
      <Stack.Screen name="GoalScreen" />
      <Stack.Screen name="CaloriesTargetScreen" />
      <Stack.Screen name="ReviewAndSaveScreen" />
    </Stack>
  );
}