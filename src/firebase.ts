// src/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCFrjz0lQxA69kzXD12t9hE1Zg2LIPO7XU',
  authDomain: 'inventory-sales-manager-abe26.firebaseapp.com',
  projectId: 'inventory-sales-manager-abe26',
  storageBucket: 'inventory-sales-manager-abe26.firebasestorage.app',
  messagingSenderId: '64773131046',
  appId: '1:64773131046:web:dcc8ece740669d369ccfe7',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
