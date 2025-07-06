
'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { sendWelcomeEmail } from '@/lib/email';
import { useRouter } from 'next/navigation';


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
  isFirebaseConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser && isFirebaseConfigured) {
      // Check for user profile in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // User profile exists, merge it with auth data
        const userProfileData = userSnap.data() as Omit<UserProfile, 'uid'>;
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userProfileData
        });
      } else {
        // New user (e.g., first Google login), create a profile
        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          role: 'user',
          profileImage: firebaseUser.photoURL || `https://placehold.co/100x100.png?text=${firebaseUser.displayName?.charAt(0) || 'U'}`,
          provider: firebaseUser.providerData[0]?.providerId || 'unknown',
          createdAt: serverTimestamp()
        };
        await setDoc(userRef, newUserProfile);
        setUser(newUserProfile);
        // Send welcome email for social logins on first creation
        if(newUserProfile.name && newUserProfile.email) {
            await sendWelcomeEmail(newUserProfile.email, newUserProfile.name);
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle the rest
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
     // onAuthStateChanged will handle the rest
  };
  
  const registerWithEmail = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      name,
      email,
      phone: null,
      role: 'user',
      profileImage: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
      provider: 'email/password',
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
    
    // Send verification and welcome emails
    await sendEmailVerification(firebaseUser);
    await sendWelcomeEmail(email, name);

    // Update local user state
    setUser(userProfile);
  };
  
  const sendPasswordReset = async (email: string) => {
      await sendPasswordResetEmail(auth, email);
  }

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/');
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };


  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    loading,
    isFirebaseConfigured,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    logout,
    updateUser,
  };

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
