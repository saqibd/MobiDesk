// src/services/ordersService.ts
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase'; // update path if your db is elsewhere

const ORDERS_COLLECTION = 'orders';

export async function getPendingOrdersCount(): Promise<number> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, where('status', '==', 'pending'));

  // If getCountFromServer is available, use it for efficient counting:
  try {
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch {
    // Fallback: download docs and count client‑side
    const snap = await getDocs(q);
    return snap.size;
  }
}