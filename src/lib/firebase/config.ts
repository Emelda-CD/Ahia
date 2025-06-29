import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Add a check to ensure Firebase config is loaded
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('your-')) {
    console.error(`
    ********************************************************************************
    *
    *      FIREBASE CONFIGURATION ERROR
    *
    *      Firebase configuration is missing, incomplete, or uses placeholder
    *      values. Please check your .env file and ensure that all variables
    *      starting with NEXT_PUBLIC_FIREBASE_ are set correctly.
    *
    *      You can find these keys in your Firebase project settings.
    *
    *      After updating your .env file, you MUST RESTART your dev server.
    *
    ********************************************************************************
    `);
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
