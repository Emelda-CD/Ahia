
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, FirebaseError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  profileImage: string;
  provider: string;
  createdAt?: any;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email:string, password:string) => Promise<any>;
  registerWithEmail: (name: string, email:string, password:string) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              setUser(docSnap.data() as UserProfile);
            } else {
              // This case handles new users from social providers or email sign-up
              const newUserProfile: UserProfile = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'New User',
                email: firebaseUser.email,
                profileImage: firebaseUser.photoURL || 'https://placehold.co/100x100.png',
                provider: firebaseUser.providerData[0]?.providerId || 'password',
                createdAt: serverTimestamp()
              };
              // Try to create the doc, but don't fail the whole login if offline
              await setDoc(userRef, newUserProfile);
              setUser(newUserProfile);
            }
        } catch (error) {
            console.error("AuthContext: Could not fetch user profile from Firestore, possibly offline. Using fallback data from Auth.", error);
            // Don't log the user out. Create a fallback profile from the auth object.
            // This keeps the user logged in with basic info.
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              profileImage: firebaseUser.photoURL || 'https://placehold.co/100x100.png',
              provider: firebaseUser.providerData[0]?.providerId || 'password',
            };
            setUser(fallbackProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const socialLogin = async (provider: GoogleAuthProvider) => {
    try {
      console.log(`[Auth] Attempting sign-in from domain: ${window.location.hostname}. If this domain is not authorized in your Firebase project, you will get an 'auth/unauthorized-domain' error.`);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user profile
    } catch (error) {
      console.error("Social login error:", error);
      // Re-throw the error so the UI layer can handle it and show a toast
      throw error;
    }
  }

  const loginWithGoogle = async () => socialLogin(new GoogleAuthProvider());

  const registerWithEmail = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const userRef = doc(db, 'users', firebaseUser.uid);
    const newUserProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        profileImage: 'https://placehold.co/100x100.png', // Default image
        provider: 'password',
        createdAt: serverTimestamp()
    };
    await setDoc(userRef, newUserProfile);
    setUser(newUserProfile);
    return userCredential;
  }

  const loginWithEmail = async (email: string, password: string) => {
      return signInWithEmailAndPassword(auth, email, password);
  }

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
      // Here you would also update the document in Firestore
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, updatedData);
    }
  };
  
  const value = {
      user,
      isLoggedIn: !!user,
      loading,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
      updateUser
  };

  if (loading) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
