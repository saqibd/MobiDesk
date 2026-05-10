import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  city?: string;
  email?: string;
  notes?: string;
};
const customersCol = collection(db, 'customers');

export async function getCustomers(): Promise<Customer[]> {
  const snap = await getDocs(customersCol);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<Customer, 'id'>;
    return { id: d.id, ...data };
  });
}

export async function addCustomer(customer: Omit<Customer, 'id'>) {
  const docRef = await addDoc(customersCol, customer);
  return docRef.id;
}

export async function updateCustomer(
  id: string,
  data: Partial<Omit<Customer, 'id'>>
) {
  const ref = doc(db, 'customers', id);
  await updateDoc(ref, data);
}

export async function deleteCustomer(id: string) {
  const ref = doc(db, 'customers', id);
  await deleteDoc(ref);
}
