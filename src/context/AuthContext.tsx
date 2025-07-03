
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, FirebaseError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { sendWelcomeEmail as sendEmailAction } from '@/lib/email';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'user' | 'admin';
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

/**
 * Sends a welcome email to a new user by calling a server action.
 * @param email The email address of the new user.
 * @param name The name of the new user.
 */
const sendWelcomeEmail = (email: string | null, name: string | null) => {
  if (!email || !name) return;

  console.log(`[AuthContext] Triggering welcome email for ${email}`);
  
  // This is a server action, so it's safe to call from the client
  sendEmailAction(email, name).catch(error => {
      console.error("Failed to send welcome email:", error);
  });
};


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
              // This case handles new users from social providers
              console.log(`[Auth] New social user detected (UID: ${firebaseUser.uid}). Creating Firestore profile...`);
              const newUserProfile: UserProfile = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'New User',
                email: firebaseUser.email,
                phone: firebaseUser.phoneNumber,
                role: 'user', // Default role for new users
                profileImage: firebaseUser.photoURL || 'https://placehold.co/100x100.png',
                provider: firebaseUser.providerData[0]?.providerId || 'password',
                createdAt: serverTimestamp()
              };
              await setDoc(userRef, newUserProfile);
              setUser(newUserProfile);
              sendWelcomeEmail(newUserProfile.email, newUserProfile.name);
            }
        } catch (error) {
            console.error("AuthContext: Could not fetch user profile from Firestore, possibly offline. Using fallback data from Auth.", error);
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              phone: firebaseUser.phoneNumber,
              role: 'user',
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
        phone: firebaseUser.phoneNumber, // Will be null for email/password
        role: 'user', // Default role
        profileImage: 'https://placehold.co/100x100.png', // Default image
        provider: 'password',
        createdAt: serverTimestamp()
    };
    await setDoc(userRef, newUserProfile);
    setUser(newUserProfile);
    sendWelcomeEmail(newUserProfile.email, newUserProfile.name);
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
