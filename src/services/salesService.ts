// src/services/salesService.ts
import {
<<<<<<< HEAD
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  serverTimestamp,
=======
    addDoc,
    collection,
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where,
>>>>>>> 8f32440 (Initial app update)
} from 'firebase/firestore';
import { db } from '../firebase';

const SALES_COLLECTION = 'sales';

export type Sale = {
  id?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  total?: number;
  customerPhone?: string;
  customerName?: string;
  createdAt?: Timestamp;
};

export type MonthlySale = {
  month: string;
  total: number;
};

const salesCol = collection(db, SALES_COLLECTION);

export async function addSale(sale: Omit<Sale, 'id' | 'createdAt'>) {
  const docRef = await addDoc(salesCol, {
    ...sale,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getThreeMonthSalesTotal(): Promise<number> {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const q = query(salesCol, where('createdAt', '>=', Timestamp.fromDate(threeMonthsAgo)));
  const snapshot = await getDocs(q);
  let total = 0;
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    if (typeof data.total === 'number') total += data.total;
  });
  return total;
}

export async function getMonthlySales(months = 6): Promise<MonthlySale[]> {
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun',
                        'Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const q = query(salesCol, where('createdAt', '>=', Timestamp.fromDate(startDate)));
  const snapshot = await getDocs(q);

  const totalsMap: Record<string, number> = {};
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    const ts: Timestamp | undefined = data.createdAt;
    if (!ts) return;
    const d = ts.toDate();
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    totalsMap[key] = (totalsMap[key] ?? 0) + (typeof data.total === 'number' ? data.total : 0);
  });

  const result: MonthlySale[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({ month: MONTH_LABELS[d.getMonth()], total: totalsMap[key] ?? 0 });
  }
  return result;
}

export async function getRecentSales(limitCount = 3): Promise<Sale[]> {
  const q = query(salesCol, orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  const result: Sale[] = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    result.push({
      id: docSnap.id,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      total: data.total,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      createdAt: data.createdAt as Timestamp,
    });
  });
  return result;
}
<<<<<<< HEAD
=======

export async function getSalesForProduct(productId: string, limitCount = 5): Promise<Sale[]> {
  const q = query(
    salesCol,
    where('productId', '==', productId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  const result: Sale[] = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    result.push({
      id: docSnap.id,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      total: data.total,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      createdAt: data.createdAt as Timestamp,
    });
  });
  return result;
}

export type MonthlyRevenue = {
  month: string;
  total: number;
};

export type MonthlyUnits = {
  month: string;
  units: number;
};

export async function getMonthlyRevenueForProduct(productId: string, months = 6): Promise<MonthlyRevenue[]> {
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const q = query(
    salesCol,
    where('productId', '==', productId),
    where('createdAt', '>=', Timestamp.fromDate(startDate))
  );
  const snapshot = await getDocs(q);

  const totalsMap: Record<string, number> = {};
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    const ts: Timestamp | undefined = data.createdAt;
    if (!ts) return;
    const d = ts.toDate();
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    totalsMap[key] = (totalsMap[key] ?? 0) + (typeof data.total === 'number' ? data.total : 0);
  });

  const result: MonthlyRevenue[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({ month: MONTH_LABELS[d.getMonth()], total: totalsMap[key] ?? 0 });
  }
  return result;
}

export async function getMonthlyUnitsForProduct(productId: string, months = 6): Promise<MonthlyUnits[]> {
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const q = query(
    salesCol,
    where('productId', '==', productId),
    where('createdAt', '>=', Timestamp.fromDate(startDate))
  );
  const snapshot = await getDocs(q);

  const unitsMap: Record<string, number> = {};
  snapshot.forEach(docSnap => {
    const data = docSnap.data() as DocumentData;
    const ts: Timestamp | undefined = data.createdAt;
    if (!ts) return;
    const d = ts.toDate();
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    unitsMap[key] = (unitsMap[key] ?? 0) + (typeof data.quantity === 'number' ? data.quantity : 0);
  });

  const result: MonthlyUnits[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({ month: MONTH_LABELS[d.getMonth()], units: unitsMap[key] ?? 0 });
  }
  return result;
}
>>>>>>> 8f32440 (Initial app update)
