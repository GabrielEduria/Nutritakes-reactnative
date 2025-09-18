import { Meal } from "@/app/data/meal";
import {
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { auth, db, storage } from "./firebase";

export async function getUserProfile(uid: string) {
  const docRef = doc(db, "profiles", uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}


export async function updateUserProfile(user: User, name: string, photoURL?: string) {
  await updateProfile(user, { displayName: name, photoURL });
  const userRef = doc(db, "profiles", user.uid);
  await updateDoc(userRef, { name, photoURL });
}


export async function uploadProfilePicture(uid: string, uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(storage, `profilePictures/${uid}.jpg`);
  await uploadBytes(imageRef, blob);
  const url = await getDownloadURL(imageRef);
  return url;
}


export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export const getUserMeals = async (uid: string): Promise<Meal[]> => {
  const snapshot = await getDocs(collection(db, `profiles/${uid}/meals`));
  return snapshot.docs.map(doc => ({
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
