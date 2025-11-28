import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import type { User, ConfirmationResult } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin" | "moderator";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Sign up with email and password
export async function signUp(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName });

  // Create user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    role: "user",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return user;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Sign out
export async function logOut() {
  await signOut(auth);
}

// Password reset
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// Phone authentication - Setup recaptcha
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
}

// Phone authentication - Send OTP
export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

// Phone authentication - Verify OTP
export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  otp: string
) {
  const userCredential = await confirmationResult.confirm(otp);
  const user = userCredential.user;

  // Check if user profile exists, if not create one
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      phone: user.phoneNumber,
      role: "user",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  return user;
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

// Update user profile
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
}

// Auth state observer
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Check if user is admin
export async function isAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.role === "admin";
}
