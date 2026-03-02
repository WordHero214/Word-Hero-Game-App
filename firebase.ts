import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChqt1VSOu7XIGqexvJm6ng2iI7vlut_6s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "word-hero-8143e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "word-hero-8143e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "word-hero-8143e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1047515656125",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1047515656125:web:3eefc5a475535f88836cd4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HWZBHG29MW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Secondary Firebase app for creating users without affecting main session
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

export { app, analytics, auth, db, secondaryAuth };
