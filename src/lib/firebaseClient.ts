import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  User,
  UserCredential,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { checkFirebaseConfig } from "./firebaseConfig";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check Firebase configuration in development only if env vars are loaded
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only check after client-side hydration when env vars are available
  setTimeout(() => checkFirebaseConfig(), 100);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth Functions
export const signUpWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmailAndPasswordAuth = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

export const sendVerificationEmail = async (user: User): Promise<void> => {
  return sendEmailVerification(user);
};

export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

// Additional utility function for password reset
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { sendPasswordResetEmail: firebaseSendPasswordResetEmail } = await import("firebase/auth");
  return firebaseSendPasswordResetEmail(auth, email);
};
