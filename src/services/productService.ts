// src/services/productService.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ProductWithId as Product, NewProduct } from '../types/product';

export const PRODUCTS_COLLECTION = 'products';

function mapDocToProduct(snapshot: any): Product {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    name: data.name ?? '',
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),

    sku: data.sku,
    barcode: data.barcode,
    brand: data.brand,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    category: data.category,

    condition: data.condition,
    ptaStatus: data.ptaStatus,
    ramMemory: data.ramMemory,
    screenSize: data.screenSize,
    purchasePrice:
      data.purchasePrice !== undefined
        ? Number(data.purchasePrice)
        : undefined,

    notes: data.notes,
  };
}

/**
 * Get all products (ordered by name).
 */
export async function getProducts(): Promise<Product[]> {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(colRef, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDocToProduct);
}

/**
 * Add a new product.
 */
export async function addProduct(product: NewProduct): Promise<string> {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const now = new Date();

  const docRef = await addDoc(colRef, {
    ...product,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

/**
 * Update an existing product by id.
 */
export async function updateProduct(
  id: string,
  data: Partial<NewProduct>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const now = new Date();

  await updateDoc(docRef, {
    ...data,
    updatedAt: now,
  });
}

/**
 * Delete a product by id.
 */
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Compute dashboard stats from all products.
 *
 * totalStock      = sum(stock)
 * stockValue      = sum(stock * (purchasePrice || price))
 * lowStockCount   = number of products with stock > 0 and stock <= lowStockThreshold
 */
export type ProductStats = {
  totalStock: number;
  stockValue: number;
  lowStockCount: number;
};

export async function getProductStats(
  lowStockThreshold: number = 5
): Promise<ProductStats> {
  const products = await getProducts();

  let totalStock = 0;
  let stockValue = 0;
  let lowStockCount = 0;

  for (const p of products) {
    const stock = Number(p.stock || 0);
    const unitPrice =
      p.purchasePrice !== undefined && p.purchasePrice > 0
        ? p.purchasePrice
        : p.price || 0;

    totalStock += stock;
    stockValue += stock * unitPrice;

    if (stock > 0 && stock <= lowStockThreshold) {
      lowStockCount += 1;
    }
  }

  return {
    totalStock,
    stockValue,
    lowStockCount,
  };
}