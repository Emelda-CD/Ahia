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

// Add a check to ensure Firebase config is loaded and log project info for debugging
if (typeof window !== 'undefined') { // Run only on the client
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('your-')) {
        console.error(`
        ********************************************************************************
        *
        *      FIREBASE CONFIGURATION ERROR
        *
        *      Firebase configuration is missing or uses placeholder values.
        *      Please update your .env file with your project's credentials.
        *
        ********************************************************************************
        `);
    } else {
        console.log('%cFirebase Auth Debug Info', 'color: #FFA500; font-weight: bold;');
        console.log(`%cProject ID: %c${firebaseConfig.projectId}`, 'font-weight: bold;', 'color: #4CAF50;');
        console.log(`%cCurrent Hostname: %c${window.location.hostname}`, 'font-weight: bold;', 'color: #4CAF50;');
        console.log('Please ensure the hostname above is listed in your Firebase project\'s "Authorized domains".');
    }
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
