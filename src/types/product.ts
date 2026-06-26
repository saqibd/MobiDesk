<<<<<<< HEAD
// src/types/product.ts

export type ProductCategory = 'phone' | 'tablet' | 'accessory' | 'laptop' | 'other';
export type ProductCondition = 'new' | 'used' | '10/10';
export type PtaStatus = 'approved' | 'not_approved';

export type ProductFormValues = {
  name: string;
  price: string;         // input as string, converted to number
  stock: string;         // input as string, converted to number

  sku: string;
  barcode: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;

  category: '' | ProductCategory;
  condition: '' | ProductCondition;
  ptaStatus: '' | PtaStatus;

  ramMemory: string;
  screenSize: string;
  purchasePrice: string; // input as string, converted to number
  notes: string;
};

// What is stored in Firestore for a product (without id)
export type NewProduct = {
  name: string;
  price: number;
  stock: number;

  sku?: string;
  barcode?: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;

  category?: ProductCategory;
  condition?: ProductCondition;
  ptaStatus?: PtaStatus;

  ramMemory?: string;
  screenSize?: string;
  purchasePrice?: number;
  notes?: string;
};

export type ProductWithId = NewProduct & {
  id: string;
};

/**
 * Convert form values (all strings) to a NewProduct object for Firestore.
 * We skip empty fields to avoid undefined (Firestore does not accept undefined).
 */
export function formValuesToNewProduct(values: ProductFormValues): NewProduct {
  const base: any = {
    name: values.name.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
  };

  if (values.sku.trim()) base.sku = values.sku.trim();
  if (values.barcode.trim()) base.barcode = values.barcode.trim();
  if (values.brand.trim()) base.brand = values.brand.trim();
  if (values.modelNumber.trim()) base.modelNumber = values.modelNumber.trim();
  if (values.serialNumber.trim()) base.serialNumber = values.serialNumber.trim();

  if (values.category) base.category = values.category;
  if (values.condition) base.condition = values.condition;
  if (values.ptaStatus) base.ptaStatus = values.ptaStatus;

  if (values.ramMemory.trim()) base.ramMemory = values.ramMemory.trim();
  if (values.screenSize.trim()) base.screenSize = values.screenSize.trim();

  if (values.purchasePrice.trim()) {
    base.purchasePrice = Number(values.purchasePrice);
  }

  if (values.notes.trim()) base.notes = values.notes.trim();

  return base as NewProduct;
=======
// src/types/product.ts

export type ProductCategory = 'phone' | 'tablet' | 'accessory' | 'laptop' | 'other';
export type ProductCondition = 'new' | 'used' | '10/10';
export type PtaStatus = 'approved' | 'not_approved';

export type ProductFormValues = {
  name: string;
  price: string;         // input as string, converted to number
  stock: string;         // input as string, converted to number

  sku: string;
  barcode: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;

  category: '' | ProductCategory;
  condition: '' | ProductCondition;
  ptaStatus: '' | PtaStatus;

  ramMemory: string;
  screenSize: string;
  purchasePrice: string; // input as string, converted to number
  notes: string;
};

// What is stored in Firestore for a product (without id)
export type NewProduct = {
  name: string;
  price: number;
  stock: number;

  sku?: string;
  barcode?: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;

  category?: ProductCategory;
  condition?: ProductCondition;
  ptaStatus?: PtaStatus;

  ramMemory?: string;
  screenSize?: string;
  purchasePrice?: number;
  notes?: string;
};

export type ProductWithId = NewProduct & {
  id: string;
};

/**
 * Convert form values (all strings) to a NewProduct object for Firestore.
 * We skip empty fields to avoid undefined (Firestore does not accept undefined).
 */
export function formValuesToNewProduct(values: ProductFormValues): NewProduct {
  const base: any = {
    name: values.name.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
  };

  if (values.sku.trim()) base.sku = values.sku.trim();
  if (values.barcode.trim()) base.barcode = values.barcode.trim();
  if (values.brand.trim()) base.brand = values.brand.trim();
  if (values.modelNumber.trim()) base.modelNumber = values.modelNumber.trim();
  if (values.serialNumber.trim()) base.serialNumber = values.serialNumber.trim();

  if (values.category) base.category = values.category;
  if (values.condition) base.condition = values.condition;
  if (values.ptaStatus) base.ptaStatus = values.ptaStatus;

  if (values.ramMemory.trim()) base.ramMemory = values.ramMemory.trim();
  if (values.screenSize.trim()) base.screenSize = values.screenSize.trim();

  if (values.purchasePrice.trim()) {
    base.purchasePrice = Number(values.purchasePrice);
  }

  if (values.notes.trim()) base.notes = values.notes.trim();

  return base as NewProduct;
>>>>>>> 8f32440 (Initial app update)
}