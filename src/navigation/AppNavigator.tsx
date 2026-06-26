// src/navigation/AppNavigator.tsx
<<<<<<< HEAD
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
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
=======
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Brand, Inter } from '../constants/brand';
import { COMPANY } from '../constants/companyInfo';

import { useAuth } from '../context/AuthContext';

import AddCustomerScreen from '../screens/AddCustomerScreen';
import AddProductScreen from '../screens/AddProductScreen';
import CsvImportScreen from '../screens/CsvImportScreen';
import CustomerSelectScreen from '../screens/CustomerSelectScreen';
import CustomersScreen from '../screens/CustomersScreen';
import EditCustomerScreen from '../screens/EditCustomerScreen';
import EditProductForSaleScreen from '../screens/EditProductForSaleScreen';
import EditProductScreen from '../screens/EditProductScreen';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductSelectScreen from '../screens/ProductSelectScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ReviewOrderScreen from '../screens/ReviewOrderScreen';
import SaleDetailScreen from '../screens/SaleDetailScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import SalesScreen from '../screens/SalesScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShareProductScreen from '../screens/ShareProductScreen';
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
=======
  ProductDetails: { product: ProductWithId & { createdAt?: string | number | Date; updatedAt?: string | number | Date } };
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
=======
  Settings: undefined;
>>>>>>> 8f32440 (Initial app update)
};

const Stack = createNativeStackNavigator<RootStackParamList>();

<<<<<<< HEAD
=======
const SCREEN_TITLES = {
  home: 'MobiDesk',
  sales: 'Sales',
  inventory: 'Inventory Management',
  customers: 'Customer Management',
  reports: 'Reports',
  addProduct: 'Add Product',
  scanBarcode: 'Scan Barcode',
  addCustomer: 'Add Customer',
  editCustomer: 'Edit Customer',
  editProduct: 'Edit Product',
  shareProduct: 'Share Product',
  csvImport: 'Import from CSV',
  salesHistory: 'Sales History',
  customerSelect: 'Select Customer',
  productSelect: 'Select Product',
  reviewOrder: 'Review Order',
  saleDetail: 'Sale Details',
  settings: 'Settings',
};

const GLOBAL_SCREEN_OPTIONS = {
  headerStyle: {
    backgroundColor: Brand.primary,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '600' as const,
    fontFamily: Inter.semibold,
  },
};

>>>>>>> 8f32440 (Initial app update)
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
<<<<<<< HEAD
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#2563EB" />
=======
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={Brand.primary} />
        <Text style={loadingStyles.text}>Loading {COMPANY.name}...</Text>
>>>>>>> 8f32440 (Initial app update)
      </View>
    );
  }

  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator>
=======
      <Stack.Navigator screenOptions={GLOBAL_SCREEN_OPTIONS}>
>>>>>>> 8f32440 (Initial app update)
        {user ? (
          // ── Authenticated app ──────────────────────────────────────────────
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
<<<<<<< HEAD
                title: 'Mobile Phone Management',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => signOut()}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      backgroundColor: '#DC2626',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 4,
                    }}
                  >
                    <Ionicons name="power" size={18} color="#fff" />
                  </TouchableOpacity>
                ),
=======
                title: SCREEN_TITLES.home,
                headerBackVisible: false,
                headerLeft: () => null,
                gestureEnabled: false,
>>>>>>> 8f32440 (Initial app update)
              }}
            />
            <Stack.Screen
              name="Sales"
              component={SalesScreen}
<<<<<<< HEAD
              options={{ title: 'Sales' }}
=======
              options={{
                title: SCREEN_TITLES.sales,
                headerBackVisible: false,
                headerLeft: () => null,
                gestureEnabled: false,
              }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="Inventory"
              component={InventoryScreen}
<<<<<<< HEAD
              options={{ title: 'Inventory Management' }}
=======
              options={{ title: SCREEN_TITLES.inventory }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="Customers"
              component={CustomersScreen}
<<<<<<< HEAD
              options={{ title: 'Customer Management' }}
=======
              options={{ title: SCREEN_TITLES.customers }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="Reports"
              component={ReportsScreen}
<<<<<<< HEAD
              options={{ title: 'Reports' }}
=======
              options={{ title: SCREEN_TITLES.reports }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
<<<<<<< HEAD
              options={{ title: 'Add Product' }}
=======
              options={{ title: SCREEN_TITLES.addProduct }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="ScanBarcode"
              component={ScanBarcodeScreen}
<<<<<<< HEAD
              options={{ title: 'Scan Barcode' }}
=======
              options={{ title: SCREEN_TITLES.scanBarcode }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="AddCustomer"
              component={AddCustomerScreen}
<<<<<<< HEAD
              options={{ title: 'Add Customer' }}
=======
              options={{ title: SCREEN_TITLES.addCustomer }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="EditCustomer"
              component={EditCustomerScreen}
<<<<<<< HEAD
              options={{ title: 'Edit Customer' }}
=======
              options={{ title: SCREEN_TITLES.editCustomer }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="EditProduct"
              component={EditProductScreen}
<<<<<<< HEAD
              options={{ title: 'Edit Product' }}
=======
              options={{ title: SCREEN_TITLES.editProduct }}
            />
            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
              options={{ title: 'Product Details' }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="EditProductForSale"
              component={EditProductForSaleScreen}
<<<<<<< HEAD
              options={{ title: 'Edit Product' }}
=======
              options={{ title: SCREEN_TITLES.editProduct }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="ShareProduct"
              component={ShareProductScreen}
<<<<<<< HEAD
              options={{ title: 'Share Product' }}
=======
              options={{ title: SCREEN_TITLES.shareProduct }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="CsvImport"
              component={CsvImportScreen}
<<<<<<< HEAD
              options={{ title: 'Import from CSV' }}
=======
              options={{ title: SCREEN_TITLES.csvImport }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="SalesHistory"
              component={SalesHistoryScreen}
<<<<<<< HEAD
              options={{ title: 'Sales History' }}
=======
              options={{ title: SCREEN_TITLES.salesHistory }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="CustomerSelect"
              component={CustomerSelectScreen}
<<<<<<< HEAD
              options={{ title: 'Select Customer' }}
=======
              options={{ title: SCREEN_TITLES.customerSelect }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="ProductSelect"
              component={ProductSelectScreen}
<<<<<<< HEAD
              options={{ title: 'Select Product' }}
=======
              options={{ title: SCREEN_TITLES.productSelect }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="ReviewOrder"
              component={ReviewOrderScreen}
<<<<<<< HEAD
              options={{ title: 'Review Order' }}
=======
              options={{ title: SCREEN_TITLES.reviewOrder }}
>>>>>>> 8f32440 (Initial app update)
            />
            <Stack.Screen
              name="SaleDetail"
              component={SaleDetailScreen}
<<<<<<< HEAD
              options={{ title: 'Sale Details' }}
=======
              options={{ title: SCREEN_TITLES.saleDetail }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: SCREEN_TITLES.settings }}
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
=======

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Brand.primaryBg,
  },
  text: {
    marginTop: 16,
    color: Brand.primaryDark,
    fontFamily: Inter.semibold,
    fontSize: 15,
  },
});
>>>>>>> 8f32440 (Initial app update)
