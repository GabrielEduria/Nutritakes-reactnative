import { Meal } from "@/app/data/meal";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";


export async function getUserProfile(uid: string) {
  const docRef = doc(db, "profiles", uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}


export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}


export const getUserMeals = async (uid: string): Promise<Meal[]> => {
  const snapshot = await getDocs(collection(db, `profiles/${uid}/meals`));
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Meal),
    id: doc.id,
  }));
};


export async function deleteMeal(uid: string, mealId: string) {
  const mealRef = doc(db, "profiles", uid, "meals", mealId);
  await deleteDoc(mealRef);
}


export async function logout() {
  await signOut(auth);
}
