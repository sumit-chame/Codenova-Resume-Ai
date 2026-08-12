import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../firebase/config';
import { UserProfile } from '../../types';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as googleLoginService,
  logoutUser,
  sendPasswordReset,
  resendVerificationEmail,
  syncUserProfile,
  updateUserProfileDetails,
  getDemoUser,
  loginAsDemoUser,
} from '../../services/authService';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateProfileData: (updates: { displayName?: string; bio?: string; jobTitle?: string; location?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // If Firebase environment variables are placeholders, check for saved demo session
      const savedDemo = localStorage.getItem('resumeforge_demo_user');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          setCurrentUser(parsed.user);
          setUserProfile(parsed.profile);
        } catch {
          // Fallback
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to sync profile on auth state change:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const res = await loginWithEmail(email, pass);
      setCurrentUser(res.user);
      setUserProfile(res.profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to log in';
      setError(msg);
      throw err;
    }
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    setError(null);
    try {
      const res = await registerWithEmail(email, pass, fullName);
      setCurrentUser(res.user);
      setUserProfile(res.profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register account';
      setError(msg);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const res = await googleLoginService();
      setCurrentUser(res.user);
      setUserProfile(res.profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
      throw err;
    }
  };

  const loginDemo = () => {
    setError(null);
    const demo = loginAsDemoUser();
    setCurrentUser(demo.user);
    setUserProfile(demo.profile);
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logout failed';
      setError(msg);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordReset(email);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password reset email';
      setError(msg);
      throw err;
    }
  };

  const resendVerification = async () => {
    if (!currentUser) return;
    try {
      await resendVerificationEmail(currentUser);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend email verification';
      setError(msg);
      throw err;
    }
  };

  const updateProfileData = async (updates: {
    displayName?: string;
    bio?: string;
    jobTitle?: string;
    location?: string;
  }) => {
    if (!currentUser) return;
    try {
      await updateUserProfileDetails(currentUser, updates);
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile details';
      setError(msg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        error,
        login,
        signup,
        loginWithGoogle,
        loginDemo,
        logout,
        resetPassword,
        resendVerification,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
