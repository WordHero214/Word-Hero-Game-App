import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChqt1VSOu7XIGqexvJm6ng2iI7vlut_6s",
  authDomain: "word-hero-8143e.firebaseapp.com",
  projectId: "word-hero-8143e",
  storageBucket: "word-hero-8143e.firebasestorage.app",
  messagingSenderId: "1047515656125",
  appId: "1:1047515656125:web:3eefc5a475535f88836cd4",
  measurementId: "G-HWZBHG29MW"
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
