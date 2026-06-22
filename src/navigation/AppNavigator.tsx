// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SalesScreen from '../screens/SalesScreen';
import InventoryScreen from '../screens/InventoryScreen';
import CustomersScreen from '../screens/CustomersScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import CustomerSelectScreen from '../screens/CustomerSelectScreen';
import ProductSelectScreen from '../screens/ProductSelectScreen';
import ReviewOrderScreen from '../screens/ReviewOrderScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import EditProductScreen from '../screens/EditProductScreen';
import EditProductForSaleScreen from '../screens/EditProductForSaleScreen';
import ShareProductScreen from '../screens/ShareProductScreen';
import CsvImportScreen from '../screens/CsvImportScreen';
import SaleDetailScreen from '../screens/SaleDetailScreen';
import type { Customer } from '../services/customerService';
import type { ProductWithId } from '../types/product';

export type SaleDetailParams = {
  id: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  total?: number;
  customerPhone?: string;
  customerName?: string;
  createdAtMs?: number;
};

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Register: undefined;
  // App screens
  Home: undefined;
  Sales:
    | {
        selectedCustomerName?: string;
        selectedCustomerPhone?: string;
        selectedProductId?: string;
        selectedProductName?: string;
        selectedProductPrice?: number;
        selectedProductStock?: number;
      }
    | undefined;
  Inventory: undefined;
  Customers: undefined;
  Reports: undefined;
  AddProduct: { scannedBarcode?: string } | undefined;
  ScanBarcode: undefined;
  SalesHistory: undefined;
  AddCustomer: undefined;
  EditCustomer: { customer: Customer };
  EditProduct: { product: ProductWithId };
  EditProductForSale: { product: ProductWithId };
  ShareProduct: { product: ProductWithId };
  CsvImport: { type: 'products' | 'customers' };
  CustomerSelect:
    | {
        returnTo?: 'Sales';
      }
    | undefined;
  ProductSelect:
    | {
        returnTo?: 'Sales';
      }
    | undefined;
  ReviewOrder: undefined;
  SaleDetail: { sale: SaleDetailParams };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // ── Authenticated app ──────────────────────────────────────────────
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Mobile Phone Management',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => signOut()}
                    style={{ paddingHorizontal: 10, paddingVertical: 4 }}
                  >
                    <Text style={{ fontSize: 20 }}>🚪</Text>
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="Sales"
              component={SalesScreen}
              options={{ title: 'Sales' }}
            />
            <Stack.Screen
              name="Inventory"
              component={InventoryScreen}
              options={{ title: 'Inventory Management' }}
            />
            <Stack.Screen
              name="Customers"
              component={CustomersScreen}
              options={{ title: 'Customer Management' }}
            />
            <Stack.Screen
              name="Reports"
              component={ReportsScreen}
              options={{ title: 'Reports' }}
            />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={{ title: 'Add Product' }}
            />
            <Stack.Screen
              name="ScanBarcode"
              component={ScanBarcodeScreen}
              options={{ title: 'Scan Barcode' }}
            />
            <Stack.Screen
              name="AddCustomer"
              component={AddCustomerScreen}
              options={{ title: 'Add Customer' }}
            />
            <Stack.Screen
              name="EditCustomer"
              component={EditCustomerScreen}
              options={{ title: 'Edit Customer' }}
            />
            <Stack.Screen
              name="EditProduct"
              component={EditProductScreen}
              options={{ title: 'Edit Product' }}
            />
            <Stack.Screen
              name="EditProductForSale"
              component={EditProductForSaleScreen}
              options={{ title: 'Edit Product' }}
            />
            <Stack.Screen
              name="ShareProduct"
              component={ShareProductScreen}
              options={{ title: 'Share Product' }}
            />
            <Stack.Screen
              name="CsvImport"
              component={CsvImportScreen}
              options={{ title: 'Import from CSV' }}
            />
            <Stack.Screen
              name="SalesHistory"
              component={SalesHistoryScreen}
              options={{ title: 'Sales History' }}
            />
            <Stack.Screen
              name="CustomerSelect"
              component={CustomerSelectScreen}
              options={{ title: 'Select Customer' }}
            />
            <Stack.Screen
              name="ProductSelect"
              component={ProductSelectScreen}
              options={{ title: 'Select Product' }}
            />
            <Stack.Screen
              name="ReviewOrder"
              component={ReviewOrderScreen}
              options={{ title: 'Review Order' }}
            />
            <Stack.Screen
              name="SaleDetail"
              component={SaleDetailScreen}
              options={{ title: 'Sale Details' }}
            />
          </>
        ) : (
          // ── Auth screens ───────────────────────────────────────────────────
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
