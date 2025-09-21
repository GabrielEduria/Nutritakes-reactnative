import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}
