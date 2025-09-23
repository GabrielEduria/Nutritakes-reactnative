import { supabase } from "@/lib/supabase";

type PartialProfile = {
  age?: number;
  gender?: "male" | "female";
  weight?: number;
  height?: number;
  goal?: "lose_weight" | "maintain" | "gain_muscle";
  weekly_target_calories?: number;
};

export async function saveProfileField(fields: PartialProfile) {
  const userRes = await supabase.auth.getUser();
  const userId = userRes?.data?.user?.id;
  if (!userId) throw new Error("Not authenticated");


  const existing = await supabase.from("user_profiles").select("id").eq("user_id", userId).limit(1).maybeSingle();
  

  if (existing?.data?.id) {
    const { error } = await supabase.from("user_profiles").update(fields).eq("user_id", userId);
    if (error) throw error;
  } else {
    const payload = { user_id: userId, ...fields };
    const { error } = await supabase.from("user_profiles").insert([payload]);
    if (error) throw error;
  }
  return true;
}

export async function fetchProfile() {
  const userRes = await supabase.auth.getUser();
  const userId = userRes?.data?.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single();
  if (error) {
   
    return null;
  }
  return data;
}
