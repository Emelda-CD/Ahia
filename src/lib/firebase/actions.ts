
'use server';

import { db, auth, isFirebaseConfigured } from './config';
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
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { 
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword
} from 'firebase/auth';
import type { Ad, AdStatus } from '@/lib/listings-data';
import type { UserProfile } from '@/context/AuthContext';
import { uploadFile } from './storage';

// Centralized warning for server-side logs
const logUnconfigured = () => {
    if (!isFirebaseConfigured) {
        console.warn("Firebase is not configured. Database operations will be skipped. Please check your .env file and restart the server.");
    }
};

/**
 * Updates a user's profile information in Firestore and Firebase Auth.
 * @param userId The UID of the user to update.
 * @param data The profile data to update.
 */
export async function updateUserProfile(userId: string, data: Partial<Pick<UserProfile, 'name' | 'phone'>>) {
  if (!isFirebaseConfigured || !db || !auth) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }
  
  const userRef = doc(db, 'users', userId);
  
  // Update Firestore document
  await updateDoc(userRef, data);

  // Also update Firebase Auth profile if name is changed and the current user is the one being updated
  const currentUser = auth.currentUser;
  if (data.name && currentUser && currentUser.uid === userId) {
    await updateProfile(currentUser, { displayName: data.name });
  }
}

/**
 * Updates a user's role. Intended for admin use.
 * @param userId The UID of the user to update.
 * @param role The new role to assign.
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }

  // NOTE: In a production app, you would add a check here
  // to ensure the calling user is an admin before proceeding.

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role });
}

/**
 * Updates a user's profile image.
 * @param userId The UID of the user to update.
 * @param formData The FormData object containing the new profile image.
 * @returns The updated user profile with the new image URL.
 */
export async function updateUserProfileImage(userId: string, formData: FormData): Promise<Pick<UserProfile, 'profileImage'>> {
  if (!isFirebaseConfigured || !db || !auth) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }

  const imageFile = formData.get('profileImage') as File;
  if (!imageFile) {
      throw new Error("No image file provided.");
  }

  // Upload the file to Firebase Storage
  const imageUrl = await uploadFile(imageFile, `profile-images/${userId}`);

  // Update the user's profile in Firestore
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { profileImage: imageUrl });

  // Also update the Firebase Auth profile
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === userId) {
    await updateProfile(currentUser, { photoURL: imageUrl });
  }

  return { profileImage: imageUrl };
}

/**
 * Updates an authenticated user's password.
 * @param currentPassword The user's current password for re-authentication.
 * @param newPassword The new password to set.
 */
export async function updateUserPassword(currentPassword: string, newPassword: string) {
    if (!isFirebaseConfigured || !auth) {
        throw new Error("Action failed: Firebase is not configured on the server.");
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
        throw new Error("No authenticated user found or user does not have an email.");
    }

    // Re-authenticate the user to ensure they are who they say they are
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    try {
        await reauthenticateWithCredential(user, credential);
    } catch (error) {
        // This will throw an error if the current password is incorrect
        console.error("Re-authentication failed:", error);
        throw new Error("The current password you entered is incorrect.");
    }
    
    // If re-authentication is successful, update the password
    try {
        await updatePassword(user, newPassword);
    } catch (error) {
        console.error("Password update failed:", error);
        throw new Error("Failed to update password. It might be too weak.");
    }
}


/**
 * Creates a new ad in Firestore.
 * @param adData The data for the new ad.
 * @returns The ID of the newly created ad document.
 */
export async function createAd(adData: Omit<Ad, 'id' | 'timestamp' | 'verified' | 'status' | 'views'>) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }
  const adsCollection = collection(db, 'ads');
  
  const dataToSave = {
    ...adData,
    verified: false,
    status: 'pending' as AdStatus,
    views: 0,
    timestamp: serverTimestamp(),
  };

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
            timestamp: data.timestamp?.toDate().toISOString() || null,
        } as Ad;
    });

    return ads;
}

/**
 * Fetches ads for a specific user.
 * @param userId The UID of the user whose ads to fetch.
 * @returns A promise that resolves to an array of ads.
 */
export async function getAdsByUserId(userId: string): Promise<Ad[]> {
  logUnconfigured();
  if (!isFirebaseConfigured || !db) return [];

  const adsCollection = collection(db, 'ads');
  
  // This query now requires a composite index on (userId, timestamp desc)
  const q = query(adsCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'));
  
  const querySnapshot = await getDocs(q);

  const ads = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || null,
  } as Ad));

  return ads;
}


export async function getRecentAds(count: number): Promise<Ad[]> {
    logUnconfigured();
    if (!isFirebaseConfigured || !db) return [];

    const adsCollection = collection(db, 'ads');
    const q = query(adsCollection, orderBy('timestamp', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    const ads = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || null,
    } as Ad));
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
    // Convert Firestore Timestamp to Date for client-side usage if needed
    const adData = {
        id: docSnap.id,
        ...data,
    } as Ad;

    if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        adData.timestamp = data.timestamp.toDate().toISOString();
    }
     if (data.lastUpdated && typeof data.lastUpdated.toDate === 'function') {
        adData.lastUpdated = data.lastUpdated.toDate().toISOString();
    }

    return adData;
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
        await updateDoc(adRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Error tracking view:", error);
    }
}


/**
 * Fetches all user profiles from Firestore, ordered by creation date.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  logUnconfigured();
  if (!isFirebaseConfigured || !db) return [];
  
  const usersCollection = collection(db, 'users');
  // This query requires a composite index on (createdAt, desc)
  const q = query(usersCollection, orderBy('createdAt', 'desc'));

  try {
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const plainObject = {
            uid: doc.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            profileImage: data.profileImage,
            provider: data.provider,
            // Convert Timestamp to serializable string
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        };
        return plainObject as UserProfile;
    });
    return users;
  } catch (error) {
     if (error instanceof Error && 'code' in error && (error as any).code === 'failed-precondition') {
        // This happens if the index is not created yet. Firestore provides a link to create it in the console.
        console.error("Firestore error: The required index for ordering users by 'createdAt' is missing. You can create it in your Firebase console using the link provided in the error logs.", error);
        // Fallback to fetching without ordering to prevent app crash
        const fallbackQuery = query(usersCollection);
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const users = fallbackSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                 uid: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
            } as UserProfile
        });
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

  if (adSnap.data().userId !== userId) {
    throw new Error('You do not have permission to edit this ad.');
  }

  const dataToUpdate: Partial<Ad> & { [key: string]: any } = {
    ...adData,
    lastUpdated: serverTimestamp()
  };

  // If the ad is being updated, it should go back to pending for re-approval
  // but only if the user is not an admin
  // (In a real app, you'd check the user's role here)
  dataToUpdate.status = 'pending';
  dataToUpdate.verified = false;


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

    if (adSnap.data().userId !== userId) {
        throw new Error("You do not have permission to delete this ad.");
    }
    
    // In a production app, you would also delete associated images from Cloud Storage here.
    await deleteDoc(adRef);
}


interface FeedbackData {
    userId: string;
    rating: number;
    comment: string;
}

/**
 * Submits user feedback to Firestore.
 * @param feedbackData The feedback data from the user.
 */
export async function submitFeedback(feedbackData: FeedbackData) {
    if (!isFirebaseConfigured || !db) {
        throw new Error("Action failed: Firebase is not configured on the server.");
    }
    const feedbackCollection = collection(db, 'feedback');
    
    const dataToSave = {
        ...feedbackData,
        timestamp: serverTimestamp(),
    };

    await addDoc(feedbackCollection, dataToSave);
}

/**
 * Updates an ad's status. Intended for admin use.
 * @param adId The ID of the ad to update.
 * @param status The new status for the ad ('active' or 'declined').
 */
export async function updateAdStatus(adId: string, status: 'active' | 'declined') {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Action failed: Firebase is not configured on the server.");
  }
  
  // In a real app, you would verify if the caller is an admin here.
  // For now, we'll allow it.

  const adRef = doc(db, 'ads', adId);
  const dataToUpdate: Partial<Ad> & { [key:string]: any} = {
    status,
    lastUpdated: serverTimestamp(),
  };

  if (status === 'active') {
    dataToUpdate.verified = true;
  }

  await updateDoc(adRef, dataToUpdate);
}


// DRAFT ACTIONS

/**
 * Saves a user's ad draft to Firestore.
 * @param userId The UID of the user.
 * @param draftData The draft data, including form values and current step.
 */
export async function saveDraft(userId: string, draftData: { values: any; step: number }) {
  if (!isFirebaseConfigured || !db) return;
  const draftRef = doc(db, 'drafts', userId);
  await setDoc(draftRef, {
    ...draftData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Retrieves a user's ad draft from Firestore.
 * @param userId The UID of the user.
 * @returns The draft data or null if it doesn't exist.
 */
export async function getDraft(userId: string): Promise<{ values: any; step: number } | null> {
  if (!isFirebaseConfigured || !db) return null;
  const draftRef = doc(db, 'drafts', userId);
  const draftSnap = await getDoc(draftRef);

  if (draftSnap.exists()) {
    const data = draftSnap.data();
    return {
        values: data.values,
        step: data.step
    };
  }
  return null;
}

/**
 * Deletes a user's ad draft from Firestore.
 * @param userId The UID of the user.
 */
export async function deleteDraft(userId: string) {
  if (!isFirebaseConfigured || !db) return;
  const draftRef = doc(db, 'drafts', userId);
  await deleteDoc(draftRef);
}
