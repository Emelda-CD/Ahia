
'use server';

import { db, isFirebaseConfigured } from './config';
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
  QueryConstraint,
  deleteDoc
} from 'firebase/firestore';
import type { Ad } from '@/lib/listings-data';
import type { UserProfile } from '@/context/AuthContext';

// Centralized warning for server-side logs
const logUnconfigured = () => {
    if (!isFirebaseConfigured) {
        console.warn("Firebase is not configured. Database operations will be skipped. Please check your .env file and restart the server.");
    }
};

/**
 * Creates a new ad in Firestore.
 * @param adData The data for the new ad.
 * @returns The ID of the newly created ad document.
 */
export async function createAd(adData: Omit<Ad, 'id' | 'timestamp' | 'verified' | 'status'>) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }
  const adsCollection = collection(db, 'ads');
  
  const dataToSave = {
    ...adData,
    verified: false, // All new ads start as unverified
    status: 'pending', // All new ads start as pending
    timestamp: serverTimestamp(),
  }

  const docRef = await addDoc(adsCollection, dataToSave as any);
  return docRef.id;
}


/**
 * Fetches a list of ads from Firestore based on optional filters.
 */
export async function getAds(): Promise<Ad[]> {
    logUnconfigured();
    if (!isFirebaseConfigured || !db) return [];
    
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

/**
 * Fetches ads for a specific user.
 * NOTE: This query requires a composite index in Firestore. If it fails,
 * the console will provide a link to create it automatically.
 * @param userId The UID of the user whose ads to fetch.
 * @returns A promise that resolves to an array of ads.
 */
export async function getAdsByUserId(userId: string): Promise<Ad[]> {
  logUnconfigured();
  if (!isFirebaseConfigured || !db) return [];

  const adsCollection = collection(db, 'ads');
  
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
    logUnconfigured();
    if (!isFirebaseConfigured || !db) return [];

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
    logUnconfigured();
    if (!id || !isFirebaseConfigured || !db) return null;
    
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
    logUnconfigured();
    if (!adId || !isFirebaseConfigured || !db) return;
    
    try {
        const adRef = doc(db, 'ads', adId);
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
  logUnconfigured();
  if (!isFirebaseConfigured || !db) return [];
  
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

/**
 * Updates an existing ad in Firestore after verifying ownership.
 * @param adId The ID of the ad to update.
 * @param userId The UID of the user attempting the update.
 * @param adData The new data for the ad.
 */
export async function updateAd(adId: string, userId: string, adData: Partial<Ad>) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }
  const adRef = doc(db, 'ads', adId);
  const adSnap = await getDoc(adRef);

  if (!adSnap.exists()) {
    throw new Error('Ad not found.');
  }

  if (adSnap.data().userID !== userId) {
    throw new Error('You do not have permission to edit this ad.');
  }

  const dataToUpdate: Partial<Ad> = {
    ...adData,
    lastUpdated: serverTimestamp()
  };

  // If the ad is being updated, it should go back to pending for re-approval
  if (adData.status !== 'active') { // Avoid resetting status if admin is just editing text
      dataToUpdate.status = 'pending';
      dataToUpdate.verified = false;
  }


  await updateDoc(adRef, dataToUpdate);
}

/**
 * Deletes an ad from Firestore after verifying ownership.
 * @param adId The ID of the ad to delete.
 * @param userId The UID of the user attempting the deletion.
 */
export async function deleteAd(adId: string, userId: string) {
    if (!isFirebaseConfigured || !db) {
      throw new Error("Action failed: Firebase is not configured on the server.");
    }
    const adRef = doc(db, 'ads', adId);
    const adSnap = await getDoc(adRef);

    if (!adSnap.exists()) {
        throw new Error("Ad not found.");
    }

    if (adSnap.data().userID !== userId) {
        throw new Error("You do not have permission to delete this ad.");
    }
    
    // In a production app, you would also delete associated images from Cloud Storage here.
    await deleteDoc(adRef);
}
