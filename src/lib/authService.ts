import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { getUserProfileFromDb, saveUserProfileInDb } from './firestoreService';
import { UserProfile } from '../types';

/**
 * Trigger Google Sign-in with Popup
 */
export async function signInWithGoogle(): Promise<UserProfile | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    if (!fbUser) return null;

    // Check if user document already exists in Firestore
    const existingProfile = await getUserProfileFromDb(fbUser.uid);

    if (existingProfile) {
      return existingProfile;
    }

    // Create fresh profile in Firestore for the new user
    const handleStr = `@${(fbUser.displayName || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 15)}`;

    const newProfile: UserProfile = {
      uid: fbUser.uid,
      name: fbUser.displayName || 'Visual Explorer',
      handle: handleStr,
      avatar:
        fbUser.photoURL ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(fbUser.uid)}`,
      bio: 'Visual curator & aesthetic collector on Encript',
      email: fbUser.email || '',
      followersCount: 0,
      followingCount: 0,
    };

    await saveUserProfileInDb(newProfile);
    return newProfile;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

/**
 * Sign out current authenticated user
 */
export async function logOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeAuthState(
  onUserChanged: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, onUserChanged);
}
