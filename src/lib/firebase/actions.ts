
'use server';

import { db, auth } from './config';
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
import type { Listing } from '@/lib/listings-data';

/**
 * Creates a new listing in Firestore.
 * @param listingData The data for the new listing.
 * @returns The ID of the newly created listing document.
 */
export async function createListing(listingData: Omit<Listing, 'id' | 'images'>) {
  const listingsCollection = collection(db, 'listings');
  
  const dataToSave = {
    ...listingData,
    status: 'active', // All new ads start as active for now
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    contacts: 0,
    favorites: 0,
    rating: 0,
  }

  const docRef = await addDoc(listingsCollection, dataToSave);
  return docRef.id;
}


/**
 * Fetches a list of listings from Firestore based on optional filters.
 */
export async function getListings(): Promise<Listing[]> {
    const listingsCollection = collection(db, 'listings');
    
    const queryConstraints: QueryConstraint[] = [
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
    ];

    const q = query(listingsCollection, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    const listings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Listing;
    });

    return listings;
}

export async function getUserListings(userId: string): Promise<Listing[]> {
    const listingsCollection = collection(db, 'listings');
    
    const queryConstraints: QueryConstraint[] = [
        where('sellerId', '==', userId),
        orderBy('createdAt', 'desc')
    ];

    const q = query(listingsCollection, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    const listings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Listing;
    });

    return listings;
}

export async function getRecentListings(count: number): Promise<Listing[]> {
    const listingsCollection = collection(db, 'listings');
    const q = query(listingsCollection, where('status', '==', 'active'), orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
    return listings;
}

/**
 * Fetches a single listing by its ID.
 */
export async function getListingById(id: string): Promise<Listing | null> {
    if (!id) return null;
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error(`No listing found with id: ${id}`);
        return null;
    }
    
    const data = docSnap.data();

    return {
        id: docSnap.id,
        ...data,
    } as Listing;
}

/**
 * Tracks a view for a given listing and its seller.
 * @param listingId The ID of the listing that was viewed.
 */
export async function trackListingView(listingId: string) {
    if (!listingId) return;
    try {
        const listingRef = doc(db, 'listings', listingId);
        await updateDoc(listingRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Error tracking view:", error);
    }
}
