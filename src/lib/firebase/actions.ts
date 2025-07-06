
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

/**
 * Creates a new ad in Firestore.
 * @param adData The data for the new ad.
 * @returns The ID of the newly created ad document.
 */
export async function createAd(adData: Omit<Ad, 'id' | 'timestamp' | 'verified'>) {
  const adsCollection = collection(db, 'ads');
  
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
    const adsCollection = collection(db, 'ads');
    
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

export async function getRecentAds(count: number): Promise<Ad[]> {
    const adsCollection = collection(db, 'ads');
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
    const docRef = doc(db, 'ads', id);
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
    try {
        const adRef = doc(db, 'ads', adId);
        // The 'views' field is not in the schema, but this shows where it would go.
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
  const usersCollection = collection(db, 'users');
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
