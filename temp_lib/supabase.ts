import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.SUPABASE_URL;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or ANON KEY is missing. Check app.config.js / .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,    
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, 
  },
});
