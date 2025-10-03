import 'dotenv/config';

export default {
  expo: {
    name: "NutriTakes",
    slug: "NutriTakes-ReactNative",   
    version: "1.0.0",
    scheme: "nutritakes",
    orientation: "portrait",
    icon: "./assets/images/NT.png",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/NT.png",
        backgroundColor: "#E6F4FE"
      },
      package: "com.anonymous.NutriTakesReactNative",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
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
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "4fd94f75-2e91-4bb2-8fe7-a2697b5daafc"
      }
    }
  }
};
