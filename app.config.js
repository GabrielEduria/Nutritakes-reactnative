export default {
  expo: {
    name: "NutriTakes",
    slug: "NutriTakes-ReactNative",
    version: "1.0.0",
    scheme: "nutritakes",
    orientation: "portrait",
    icon: "./assets/images/NT.png",
    userInterfaceStyle: "automatic",
    ios: { supportsTablet: true },
    android: {
      package: "com.anonymous.NutriTakesReactNative",
      adaptiveIcon: {
        foregroundImage: "./assets/images/NT.png",
        backgroundColor: "#E6F4FE"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET"
      ],
      versionCode: 1,
      minSdkVersion: 21,
      targetSdkVersion: 33
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/NT.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
      "expo-camera"
    ],
    extra: {
      OPENAI_API_KEY: "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",
      SUPABASE_URL: "https://iexprssfhpppieowzouu.supabase.co",
      SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHByc3NmaHBwcGllb3d6b3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODE3MDQsImV4cCI6MjA3Mzg1NzcwNH0.6PRScjEYB9690qb_KHq-H9mpiQW1NPIOAaGVRGjt5CE",
      eas: { projectId: "4fd94f75-2e91-4bb2-8fe7-a2697b5daafc" }
    }
  }
};
