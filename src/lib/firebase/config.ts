
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


if (typeof window !== 'undefined') { // Run only on the client
    const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('your-');
    if (!isConfigured) {
        console.warn(`
        ********************************************************************************
        *
        *      FIREBASE CONFIGURATION WARNING
        *
        *      Firebase keys are missing or are placeholders in your .env file.
        *      The app will not connect to Firebase until you add your credentials.
        *
        *      IMPORTANT: You must restart your development server after editing .env
        *
        ********************************************************************************
        `);
    } else if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed('%c[Firebase Studio] Debug: Firebase Config', 'color: #00A7F7; font-weight: bold;');
        console.log('The app is reading the following Firebase credentials:');
        console.log(`Project ID: %c${firebaseConfig.projectId}`, 'color: #4CAF50');
        console.log(`API Key: %c${firebaseConfig.apiKey?.substring(0, 4)}...`, 'color: #4CAF50');
        console.log(`Auth Domain: %c${firebaseConfig.authDomain}`, 'color: #4CAF50');
        console.log('%cIf these values look incorrect, check your .env file and RESTART the dev server.', 'font-weight: bold;');
        console.groupEnd();
    }
  
  // Enable Firestore offline persistence
  try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
          if (err.code == 'failed-precondition') {
              console.warn("Firestore offline persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.");
          } else if (err.code == 'unimplemented') {
              console.warn("Firestore offline persistence failed: The current browser does not support all of the features required to enable persistence.");
          }
      });
  } catch (error) {
      console.error("Error enabling Firestore offline persistence: ", error);
  }
}


export { app, db, storage, auth };
