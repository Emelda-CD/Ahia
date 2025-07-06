
'use client';

import { createContext, useContext, ReactNode } from 'react';

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
 * AuthProvider has been modified to simulate a logged-out state at all times.
 * All authentication functionality has been removed.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: null,
    isLoggedIn: false,
    loading: false, // Loading is always false as no auth check occurs.
    loginWithGoogle: async () => { console.warn("Authentication has been removed from this application."); },
    loginWithEmail: async () => { console.warn("Authentication has been removed from this application."); },
    registerWithEmail: async () => { console.warn("Authentication has been removed from this application."); },
    logout: async () => { console.warn("Authentication has been removed from this application."); },
    updateUser: () => { console.warn("Authentication has been removed from this application."); },
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
