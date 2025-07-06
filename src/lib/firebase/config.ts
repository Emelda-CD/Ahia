
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A single, reliable check for valid configuration
export const isFirebaseConfigured = 
    !!firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes('your-') &&
    !!firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('your-');

// Conditionally initialize and export Firebase services
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Client-side warnings and persistence setup
if (typeof window !== 'undefined') {
    if (isFirebaseConfigured && db) {
        enableIndexedDbPersistence(db)
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn("Firestore offline persistence failed: Multiple tabs open.");
                } else if (err.code == 'unimplemented') {
                    console.warn("Firestore offline persistence failed: Browser does not support this feature.");
                }
            });
    }

    if (process.env.NODE_ENV === 'development') {
        if (!isFirebaseConfigured) {
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
        } else {
             console.groupCollapsed('%c[Firebase Studio] Debug: Firebase Config', 'color: #00A7F7; font-weight: bold;');
            console.log('The app is reading the following Firebase credentials:');
            console.log(`Project ID: %c${firebaseConfig.projectId}`, 'color: #4CAF50');
            console.log(`API Key: %c${firebaseConfig.apiKey?.substring(0, 4)}...`, 'color: #4CAF50');
            console.log(`Auth Domain: %c${firebaseConfig.authDomain}`, 'color: #4CAF50');
            console.log('%cIf these values look incorrect, check your .env file and RESTART the dev server.', 'font-weight: bold;');
            console.groupEnd();
        }
    }
}

export { app, auth, db, storage };
