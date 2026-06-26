// src/firebase.ts
<<<<<<< HEAD
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
=======
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
>>>>>>> 8f32440 (Initial app update)

const firebaseConfig = {
  apiKey: 'AIzaSyCFrjz0lQxA69kzXD12t9hE1Zg2LIPO7XU',
  authDomain: 'inventory-sales-manager-abe26.firebaseapp.com',
  projectId: 'inventory-sales-manager-abe26',
  storageBucket: 'inventory-sales-manager-abe26.firebasestorage.app',
  messagingSenderId: '64773131046',
  appId: '1:64773131046:web:dcc8ece740669d369ccfe7',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

<<<<<<< HEAD
export const db = getFirestore(app);
export const auth = getAuth(app);
=======
function createAuth() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw e;
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
>>>>>>> 8f32440 (Initial app update)
export const googleProvider = new GoogleAuthProvider();
