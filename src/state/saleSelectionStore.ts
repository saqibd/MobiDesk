// src/state/saleSelectionStore.ts
import type { Product } from '../types';

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
