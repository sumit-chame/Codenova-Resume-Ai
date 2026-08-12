import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { UserProfile } from '../types';

const DEMO_USER_KEY = 'resumeforge_demo_user';

export function getDemoUser(): { user: FirebaseUser; profile: UserProfile } {
  const saved = localStorage.getItem(DEMO_USER_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch {
      // Fallback
    }
  }

  const demoUser = {
    uid: 'demo-user-123',
    email: 'alex.morgan@example.com',
    displayName: 'Alex Morgan',
    photoURL: null,
    emailVerified: true,
  } as unknown as FirebaseUser;

  const demoProfile: UserProfile = {
    uid: 'demo-user-123',
    email: 'alex.morgan@example.com',
    displayName: 'Alex Morgan',
    photoURL: null,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer building modern AI career tools.',
  };

  return { user: demoUser, profile: demoProfile };
}

/**
 * Creates or updates a user profile document in Firestore database
 */
export async function syncUserProfile(user: FirebaseUser, customDisplayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  let profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: customDisplayName || user.displayName || 'User',
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified,
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured) {
    return profile;
  }

  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      profile = {
        ...profile,
        createdAt: existingData.createdAt || now,
        bio: existingData.bio || '',
        jobTitle: existingData.jobTitle || '',
        location: existingData.location || '',
      };
      await updateDoc(userRef, {
        email: user.email,
        emailVerified: user.emailVerified,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('[authService] Firestore sync warning:', error);
  }

  return profile;
}

/**
 * Registers a new user with Email & Password
 */
export async function registerWithEmail(email: string, password: string, fullName: string) {
  if (!isFirebaseConfigured) {
    // Demo Mode fallback for local testing without Firebase API keys
    const demo = getDemoUser();
    demo.user = { ...demo.user, email, displayName: fullName } as FirebaseUser;
    demo.profile = { ...demo.profile, email, displayName: fullName };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    return demo;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: fullName });

  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('[authService] Could not send verification email:', err);
  }

  const profile = await syncUserProfile(user, fullName);
  return { user, profile };
}

/**
 * Logs in existing user with Email & Password
 */
export async function loginWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured) {
    const demo = getDemoUser();
    demo.user = { ...demo.user, email } as FirebaseUser;
    demo.profile = { ...demo.profile, email };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    return demo;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await syncUserProfile(userCredential.user);
  return { user: userCredential.user, profile };
}

/**
 * Explicitly logs in as Demo User for instant local testing when Firebase domain isn't authorized
 */
export function loginAsDemoUser() {
  const demo = getDemoUser();
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
  return demo;
}

/**
 * Logs in or registers user via Google OAuth popup
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    return loginAsDemoUser();
  }

  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (err: any) {
    if (err?.code === 'auth/unauthorized-domain') {
      console.warn('[authService] Domain not authorized in Firebase Console. Falling back to local session.');
      throw new Error(
        'Firebase Unauthorized Domain (auth/unauthorized-domain). To fix: Add "localhost" & "127.0.0.1" in Firebase Console > Authentication > Settings > Authorized domains. Or click "Continue in Demo Mode".'
      );
    }
    throw err;
  }
}

/**
 * Sends a password reset email
 */
export async function sendPasswordReset(email: string) {
  if (!isFirebaseConfigured) return;
  await sendPasswordResetEmail(auth, email);
}

/**
 * Resends email verification to current logged in user
 */
export async function resendVerificationEmail(user: FirebaseUser) {
  if (!isFirebaseConfigured) return;
  await sendEmailVerification(user);
}

/**
 * Logs out the current user session
 */
export async function logoutUser() {
  localStorage.removeItem(DEMO_USER_KEY);
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

/**
 * Updates profile details in Firestore & Firebase Auth
 */
export async function updateUserProfileDetails(
  user: FirebaseUser,
  updates: { displayName?: string; bio?: string; jobTitle?: string; location?: string }
) {
  if (updates.displayName && updates.displayName !== user.displayName) {
    try {
      await updateProfile(user, { displayName: updates.displayName });
    } catch {
      // Demo mode catch
    }
  }

  if (isFirebaseConfigured) {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }
}
