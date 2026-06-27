// src/navigation/AppNavigator.tsx
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
  Login: undefined;
  Register: undefined;
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
  ProductDetails: {
    product: ProductWithId & {
      createdAt?: string | number | Date;
      updatedAt?: string | number | Date;
    };
  };
  CsvImport: { type: 'products' | 'customers' };
  CustomerSelect: { returnTo?: 'Sales' } | undefined;
  ProductSelect: { returnTo?: 'Sales' } | undefined;
  ReviewOrder: undefined;
  SaleDetail: { sale: SaleDetailParams };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={Brand.primary} />
        <Text style={loadingStyles.text}>Loading {COMPANY.name}...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={GLOBAL_SCREEN_OPTIONS}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: SCREEN_TITLES.home,
                headerBackVisible: false,
                headerLeft: () => null,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Sales"
              component={SalesScreen}
              options={{
                title: SCREEN_TITLES.sales,
                headerBackVisible: false,
                headerLeft: () => null,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: SCREEN_TITLES.inventory }} />
            <Stack.Screen name="Customers" component={CustomersScreen} options={{ title: SCREEN_TITLES.customers }} />
            <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: SCREEN_TITLES.reports }} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: SCREEN_TITLES.addProduct }} />
            <Stack.Screen name="ScanBarcode" component={ScanBarcodeScreen} options={{ title: SCREEN_TITLES.scanBarcode }} />
            <Stack.Screen name="AddCustomer" component={AddCustomerScreen} options={{ title: SCREEN_TITLES.addCustomer }} />
            <Stack.Screen name="EditCustomer" component={EditCustomerScreen} options={{ title: SCREEN_TITLES.editCustomer }} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: SCREEN_TITLES.editProduct }} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
            <Stack.Screen name="EditProductForSale" component={EditProductForSaleScreen} options={{ title: SCREEN_TITLES.editProduct }} />
            <Stack.Screen name="ShareProduct" component={ShareProductScreen} options={{ title: SCREEN_TITLES.shareProduct }} />
            <Stack.Screen name="CsvImport" component={CsvImportScreen} options={{ title: SCREEN_TITLES.csvImport }} />
            <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} options={{ title: SCREEN_TITLES.salesHistory }} />
            <Stack.Screen name="CustomerSelect" component={CustomerSelectScreen} options={{ title: SCREEN_TITLES.customerSelect }} />
            <Stack.Screen name="ProductSelect" component={ProductSelectScreen} options={{ title: SCREEN_TITLES.productSelect }} />
            <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} options={{ title: SCREEN_TITLES.reviewOrder }} />
            <Stack.Screen name="SaleDetail" component={SaleDetailScreen} options={{ title: SCREEN_TITLES.saleDetail }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: SCREEN_TITLES.settings }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
