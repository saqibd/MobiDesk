// src/state/saleSelectionStore.ts
<<<<<<< HEAD
import type { Product } from '../types';
=======
import type { ProductWithId as Product } from '../types/product';
>>>>>>> 8f32440 (Initial app update)

export type SelectedCustomer = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  email?: string;
} | null;

export type SelectedProduct = Product | null;

let currentCustomer: SelectedCustomer = null;
let currentProduct: SelectedProduct = null;

export function setSelectedCustomerState(customer: SelectedCustomer) {
  currentCustomer = customer;
}

export function setSelectedProductState(product: SelectedProduct) {
  currentProduct = product;
}

export function getSelectedCustomerState(): SelectedCustomer {
  return currentCustomer;
}

export function getSelectedProductState(): SelectedProduct {
  return currentProduct;
}

export function resetSaleSelection() {
  currentCustomer = null;
  currentProduct = null;
}
