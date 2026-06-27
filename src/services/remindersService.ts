// src/services/remindersService.ts
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase'; // update path if your db is elsewhere

const REMINDERS_COLLECTION = 'reminders';

export async function getActiveRemindersCount(): Promise<number> {
  const remindersRef = collection(db, REMINDERS_COLLECTION);

  // Active = not done yet
  const q = query(remindersRef, where('done', '==', false));

  try {
    // Efficient server-side count if available
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch {
    // Fallback: download and count client-side
    const snap = await getDocs(q);
    return snap.size;
  }
}