
'use server';

import { db } from './config';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  increment,
  QueryConstraint
} from 'firebase/firestore';
import type { Ad } from '@/lib/listings-data';
import type { UserProfile } from '@/context/AuthContext';

const ensureDb = () => {
    if (!db) {
        throw new Error("Firebase is not configured. Please check your .env file and restart the server.");
    }
    return db;
}


/**
 * Creates a new ad in Firestore.
 * @param adData The data for the new ad.
 * @returns The ID of the newly created ad document.
 */
export async function createAd(adData: Omit<Ad, 'id' | 'timestamp' | 'verified'>) {
  const firestoreDb = ensureDb();
  const adsCollection = collection(firestoreDb, 'ads');
  
  const dataToSave = {
    ...adData,
    verified: false, // All new ads start as unverified
    timestamp: serverTimestamp(),
  }

  const docRef = await addDoc(adsCollection, dataToSave);
  return docRef.id;
}


/**
 * Fetches a list of ads from Firestore based on optional filters.
 */
export async function getAds(): Promise<Ad[]> {
    const firestoreDb = ensureDb();
    const adsCollection = collection(firestoreDb, 'ads');
    
    const queryConstraints: QueryConstraint[] = [
        orderBy('timestamp', 'desc')
    ];

    const q = query(adsCollection, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    const ads = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Ad;
    });

    return ads;
}

/**
 * Fetches ads for a specific user.
 * NOTE: This query requires a composite index in Firestore. If it fails,
 * the console will provide a link to create it automatically.
 * @param userId The UID of the user whose ads to fetch.
 * @returns A promise that resolves to an array of ads.
 */
export async function getAdsByUserId(userId: string): Promise<Ad[]> {
  const firestoreDb = ensureDb();
  const adsCollection = collection(firestoreDb, 'ads');
  
  const q = query(
    adsCollection, 
    where('userID', '==', userId), 
    orderBy('timestamp', 'desc')
  );
  
  const querySnapshot = await getDocs(q);

  const ads = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
  } as Ad));

  return ads;
}


export async function getRecentAds(count: number): Promise<Ad[]> {
    const firestoreDb = ensureDb();
    const adsCollection = collection(firestoreDb, 'ads');
    const q = query(adsCollection, orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    const ads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
    return ads;
}

/**
 * Fetches a single ad by its ID.
 */
export async function getAdById(id: string): Promise<Ad | null> {
    if (!id) return null;
    const firestoreDb = ensureDb();
    const docRef = doc(firestoreDb, 'ads', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error(`No ad found with id: ${id}`);
        return null;
    }
    
    const data = docSnap.data();

    return {
        id: docSnap.id,
        ...data,
    } as Ad;
}

/**
 * Tracks a view for a given ad.
 * @param adId The ID of the ad that was viewed.
 */
export async function trackAdView(adId: string) {
    if (!adId) return;
    const firestoreDb = ensureDb();
    try {
        const adRef = doc(firestoreDb, 'ads', adId);
        // The 'views' field is not implemented yet.
        // To enable this, add `views: number` to the Ad type and Firestore documents.
        // await updateDoc(adRef, {
        //     views: increment(1)
        // });
    } catch (error) {
        console.error("Error tracking view:", error);
    }
}


/**
 * Fetches all user profiles from Firestore.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const firestoreDb = ensureDb();
  const usersCollection = collection(firestoreDb, 'users');
  const q = query(usersCollection, orderBy('createdAt', 'desc'));

  try {
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: doc.id,
            // Convert timestamp to a serializable format if it exists
            ...data,
        } as UserProfile;
    });
    return users;
  } catch (error) {
     if (error instanceof Error && 'code' in error && (error as any).code === 'failed-precondition') {
        // This happens if the index is not created yet. Firestore provides a link to create it in the console.
        console.error("Firestore error: The required index for ordering users by 'createdAt' is missing. You can create it in your Firebase console.", error);
        // Fallback to fetching without ordering
        const fallbackQuery = query(usersCollection);
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const users = fallbackSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        return users;
    } else {
        console.error("Error fetching all users:", error);
        throw error; // Re-throw other errors
    }
  }
}
