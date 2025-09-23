import React, { useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AgeScreen from "./AgeScreen";
import CaloriesTargetScreen from "./CaloriesTargetScreen";
import GenderScreen from "./GenderScreen";
import GoalScreen from "./GoalScreen";
import HeightScreen from "./HeightScreen";
import ReviewAndSaveScreen from "./ReviewAndSaveScreen";
import WeightScreen from "./WeightScreen";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const steps = [
  { key: "age", title: "Age" },
  { key: "gender", title: "Gender" },
  { key: "weight", title: "Weight" },
  { key: "height", title: "Height" },
  { key: "goal", title: "Goal" },
  { key: "calories", title: "Weekly Calories" },
  { key: "review", title: "Review" },
];

export default function OnboardingLayout() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    if (i < 0 || i >= steps.length) return;
    setIndex(i);
    scrollRef.current?.scrollTo({ x: i * PAGE_WIDTH, animated: true });
  };
  const goNext = () => goTo(index + 1);
  const goBack = () => goTo(index - 1);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{steps[index].title}</Text>
        <Text style={styles.headerProgress}>{index + 1}/{steps.length}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        scrollEnabled={false} 
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ width: PAGE_WIDTH }}>
          <AgeScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <GenderScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <WeightScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <HeightScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <GoalScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <CaloriesTargetScreen onNext={goNext} onBack={goBack} />
        </View>

        <View style={{ width: PAGE_WIDTH }}>
          <ReviewAndSaveScreen onDone={() => goTo(steps.length - 1)} onBack={goBack} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {steps.map((s, i) => (
          <TouchableOpacity key={s.key} onPress={() => goTo(i)} style={[styles.dot, index === i && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerText: { fontSize: 18, fontWeight: "700" },
  headerProgress: { fontSize: 12, color: "#666", marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "center", padding: 12, backgroundColor: "transparent" },
  dot: { width: 10, height: 10, borderRadius: 6, backgroundColor: "#eee", margin: 6 },
  dotActive: { backgroundColor: "#FF5C00" },
});
