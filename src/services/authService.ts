// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth, googleProvider } from '../firebase';

export type { User };

export async function registerWithEmail(email: string, password: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/**
 * Google sign-in via popup window.
 * Works in iframe/proxied environments because the popup is a separate
 * top-level browser window — not subject to iframe OAuth restrictions.
 * Returns the signed-in User on success.
 */
export async function loginWithGoogle(): Promise<User> {
  if (Platform.OS !== 'web') {
    throw new Error('Google Sign-In is only supported on web in this build.');
  }
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
