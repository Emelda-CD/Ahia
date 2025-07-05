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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


if (typeof window !== 'undefined') { // Run only on the client
  // Add a check to ensure Firebase config is loaded and log project info for debugging
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('your-')) {
        console.warn(`
        ********************************************************************************
        *
        *      FIREBASE CONFIGURATION WARNING
        *
        *      Firebase keys are missing or are placeholders in your .env file.
        *      The app will not connect to Firebase until you add your credentials.
        *      Please see the .env.example file for the required variables.
        *
        ********************************************************************************
        `);
    } else {
        console.log('%cFirebase Auth Debug Info', 'color: #FFA500; font-weight: bold;');
        console.log(`%cProject ID: %c${firebaseConfig.projectId}`, 'font-weight: bold;', 'color: #4CAF50;');
        console.log(`%cCurrent Hostname: %c${window.location.hostname}`, 'font-weight: bold;', 'color: #4CAF50;');
        console.log('Please ensure the hostname above is listed in your Firebase project\'s "Authorized domains".');
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


export { app, auth, db, storage };
