// src/screens/HomeScreen.tsx
<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from 'victory-native';
=======
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { Brand, Inter } from '../constants/brand';
import { COMPANY } from '../constants/companyInfo';
import type { RootStackParamList } from '../navigation/AppNavigator';
>>>>>>> 8f32440 (Initial app update)

import {
  getProductStats,
  getProducts,
  type ProductStats,
} from '../services/productService';
import type { ProductWithId as Product } from '../types/product';

import {
<<<<<<< HEAD
  getThreeMonthSalesTotal,
  getMonthlySales,
  getRecentSales,
=======
  getMonthlySales,
  getRecentSales,
  getThreeMonthSalesTotal,
>>>>>>> 8f32440 (Initial app update)
  type MonthlySale,
  type Sale,
} from '../services/salesService';

<<<<<<< HEAD
=======
import { signOut } from '../services/authService';
>>>>>>> 8f32440 (Initial app update)
import { getPendingOrdersCount } from '../services/ordersService';
import { getActiveRemindersCount } from '../services/remindersService';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

<<<<<<< HEAD
=======
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

>>>>>>> 8f32440 (Initial app update)
function formatPKR(val: number) {
  if (!val) return 'PKR 0';
  if (val >= 1_000_000) return `PKR ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `PKR ${(val / 1_000).toFixed(0)}K`;
  return `PKR ${val}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

<<<<<<< HEAD
const QUICK_ACTIONS = [
  { label: 'Sales', route: 'Sales' as const, icon: '🛒', color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Inventory', route: 'Inventory' as const, icon: '📦', color: '#16A34A', bg: '#F0FDF4' },
  { label: 'Customers', route: 'Customers' as const, icon: '👤', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Reports', route: 'Reports' as const, icon: '📊', color: '#EA580C', bg: '#FFF7ED' },
];

const KPI_CONFIG = [
  { key: 'totalStock', label: 'Total Stock', accent: '#2563EB', bg: '#EFF6FF', icon: '📦' },
  { key: 'stockValue', label: 'Stock Value', accent: '#16A34A', bg: '#F0FDF4', icon: '💰' },
  { key: 'lowStock',   label: 'Low Stock',   accent: '#DC2626', bg: '#FEF2F2', icon: '⚠️' },
  { key: 'sales3mo',  label: '3-mo Sales',  accent: '#7C3AED', bg: '#F5F3FF', icon: '📈' },
=======
const QUICK_ACTIONS: {
  label: string;
  route: keyof RootStackParamList;
  icon: MaterialIconName;
}[] = [
  { label: 'Sales', route: 'Sales', icon: 'point-of-sale' },
  { label: 'Inventory', route: 'Inventory', icon: 'inventory-2' },
  { label: 'Customers', route: 'Customers', icon: 'people' },
  { label: 'Reports', route: 'Reports', icon: 'bar-chart' },
  { label: 'Settings', route: 'Settings', icon: 'settings' },
];

const KPI_CONFIG: {
  key: string;
  label: string;
  icon: MaterialIconName;
  accent: string;
  iconBg: string;
}[] = [
  { key: 'totalStock', label: 'Total stock', icon: 'inventory', accent: Brand.primary, iconBg: Brand.primaryBg },
  { key: 'stockValue', label: 'Stock value', icon: 'payments', accent: Brand.success, iconBg: Brand.successBg },
  { key: 'lowStock', label: 'Low stock', icon: 'warning', accent: Brand.danger, iconBg: Brand.dangerBg },
  { key: 'sales3mo', label: '3-mo sales', icon: 'trending-up', accent: Brand.primaryDark, iconBg: Brand.primaryBg },
>>>>>>> 8f32440 (Initial app update)
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { width } = useWindowDimensions();
  const chartWidth = width - 48;

  const [search, setSearch] = useState('');
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [threeMonthSales, setThreeMonthSales] = useState<number | null>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number | null>(null);
  const [remindersCount, setRemindersCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = <T,>(p: Promise<T>, fallback: T, ms = 6000): Promise<T> =>
      Promise.race([p, new Promise<T>(res => setTimeout(() => res(fallback), ms))]);

    const loadData = async () => {
<<<<<<< HEAD
=======
      setLoading(true);
>>>>>>> 8f32440 (Initial app update)
      try {
        const [
          statsResult,
          productsResult,
          threeMonthTotal,
          monthlyData,
          recent,
          pendingOrders,
          activeReminders,
        ] = await Promise.all([
          timeout(getProductStats(), null),
          timeout(getProducts(), []),
          timeout(getThreeMonthSalesTotal(), 0),
          timeout(getMonthlySales(6), []),
          timeout(getRecentSales(3), []),
          timeout(getPendingOrdersCount(), 0),
          timeout(getActiveRemindersCount(), 0),
        ]);

        setStats(statsResult);
        setProducts(productsResult);
        setThreeMonthSales(threeMonthTotal);
        setMonthlySales(monthlyData);
        setRecentSales(recent);
        setPendingOrdersCount(pendingOrders);
        setRemindersCount(activeReminders);
      } catch (e) {
        console.error('Dashboard load error', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(p =>
        (p.name?.toLowerCase() ?? '').includes(term) ||
        (p.barcode?.toLowerCase() ?? '').includes(term) ||
        (p.sku?.toLowerCase() ?? '').includes(term)
      )
      .slice(0, 8);
  }, [search, products]);

  const barData = monthlySales.map(m => ({ x: m.month, y: m.total }));
  const hasBarData = barData.some(d => d.y > 0);

  const kpiValues: Record<string, string> = {
    totalStock: stats?.totalStock != null ? String(stats.totalStock) : '—',
    stockValue: stats ? formatPKR(stats.stockValue) : '—',
    lowStock: stats?.lowStockCount != null ? String(stats.lowStockCount) : '—',
    sales3mo: threeMonthSales ? formatPKR(threeMonthSales) : '—',
  };

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  const alertItems = [
    {
      label: 'Low stock items',
      value: stats?.lowStockCount ?? 0,
<<<<<<< HEAD
      color: '#DC2626',
      bg: '#FEF2F2',
      icon: '⚠️',
=======
      icon: 'warning' as MaterialIconName,
      accent: Brand.danger,
      iconBg: Brand.dangerBg,
      route: 'Inventory' as const,
>>>>>>> 8f32440 (Initial app update)
    },
    {
      label: 'Pending orders',
      value: pendingOrdersCount ?? 0,
<<<<<<< HEAD
      color: '#EA580C',
      bg: '#FFF7ED',
      icon: '📋',
=======
      icon: 'receipt-long' as MaterialIconName,
      accent: Brand.warning,
      iconBg: Brand.warningBg,
      route: 'Sales' as const,
>>>>>>> 8f32440 (Initial app update)
    },
    {
      label: 'Active reminders',
      value: remindersCount ?? 0,
<<<<<<< HEAD
      color: '#7C3AED',
      bg: '#F5F3FF',
      icon: '🔔',
    },
  ];

=======
      icon: 'notifications' as MaterialIconName,
      accent: Brand.primary,
      iconBg: Brand.primaryBg,
      route: 'Settings' as const,
    },
  ];

  const attentionCount = alertItems.reduce((sum, item) => sum + item.value, 0);

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        await signOut();
      } catch (e) {
        console.error('Logout error', e);
        Alert.alert('Error', 'Could not sign out. Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Sign out of MobiDesk?')) {
        void doLogout();
      }
      return;
    }

    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void doLogout() },
    ]);
  };

>>>>>>> 8f32440 (Initial app update)
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
<<<<<<< HEAD
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{today}</Text>
=======
          <View style={styles.headerBrandRow}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.headerSubtitle}>
                {COMPANY.name} · {"Here's your store at a glance"}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.datePill}>
              <Text style={styles.dateText}>{today}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
              accessibilityLabel="Sign out"
            >
              <MaterialIcons name="logout" size={20} color={Brand.danger} />
            </TouchableOpacity>
>>>>>>> 8f32440 (Initial app update)
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
<<<<<<< HEAD
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products by name, SKU or barcode…"
            placeholderTextColor="#94A3B8"
=======
          <MaterialIcons name="search" size={20} color={Brand.textSubtle} style={styles.searchIcon} />
          <TextInput
            placeholder="Search products by name, SKU or barcode…"
            placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Search Results */}
        {filteredProducts.length > 0 && (
          <View style={styles.searchResults}>
            {filteredProducts.map(p => (
<<<<<<< HEAD
              <View key={p.id} style={styles.searchResultItem}>
                <Text style={styles.searchResultName}>{p.name}</Text>
                <Text style={styles.searchResultSku}>{p.sku ?? p.barcode ?? ''}</Text>
              </View>
=======
              <TouchableOpacity
                key={p.id}
                style={styles.searchResultItem}
                activeOpacity={0.75}
                onPress={() => {
                  navigation.navigate('ProductDetails', { product: p });
                  setSearch('');
                }}
              >
                <View style={styles.searchResultTextWrap}>
                  <Text style={styles.searchResultName}>{p.name}</Text>
                  <Text style={styles.searchResultSku}>{p.sku ?? p.barcode ?? ''}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
              </TouchableOpacity>
>>>>>>> 8f32440 (Initial app update)
            ))}
          </View>
        )}

        {/* Quick Actions */}
<<<<<<< HEAD
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.route}
              style={[styles.actionBtn, { backgroundColor: a.bg }]}
              onPress={() => navigation.navigate(a.route)}
              activeOpacity={0.75}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
=======
        <Text style={styles.sectionLabel}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.route}
              style={styles.actionCard}
              onPress={() => navigation.navigate(a.route)}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconWrap}>
                <MaterialIcons name={a.icon} size={22} color={Brand.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
>>>>>>> 8f32440 (Initial app update)
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Grid */}
<<<<<<< HEAD
        <Text style={styles.sectionLabel}>OVERVIEW</Text>
        <View style={styles.kpiGrid}>
          {KPI_CONFIG.map(k => (
            <View key={k.key} style={[styles.kpiCard, { backgroundColor: k.bg }]}>
              <Text style={styles.kpiIcon}>{k.icon}</Text>
=======
        <Text style={styles.sectionLabel}>Overview</Text>
        <View style={styles.kpiGrid}>
          {KPI_CONFIG.map(k => (
            <View key={k.key} style={styles.kpiCard}>
              <View style={[styles.kpiIconWrap, { backgroundColor: k.iconBg }]}>
                <MaterialIcons name={k.icon} size={18} color={k.accent} />
              </View>
>>>>>>> 8f32440 (Initial app update)
              <Text style={[styles.kpiValue, { color: k.accent }]}>{kpiValues[k.key]}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Alerts */}
<<<<<<< HEAD
        <Text style={styles.sectionLabel}>ATTENTION NEEDED</Text>
        <View style={styles.alertsRow}>
          {alertItems.map(a => (
            <View key={a.label} style={[styles.alertCard, { backgroundColor: a.bg }]}>
              <Text style={styles.alertIcon}>{a.icon}</Text>
              <View>
                <Text style={[styles.alertValue, { color: a.color }]}>{a.value}</Text>
                <Text style={styles.alertLabel}>{a.label}</Text>
              </View>
            </View>
=======
        <Text style={styles.sectionLabel}>Attention needed</Text>
        <View style={styles.alertsCard}>
          <View style={styles.alertsHeader}>
            <Text style={styles.alertsHeaderTitle}>
              {attentionCount > 0 ? `${attentionCount} items need attention` : 'All clear'}
            </Text>
            {attentionCount > 0 && (
              <View style={styles.alertsBadge}>
                <Text style={styles.alertsBadgeText}>{attentionCount}</Text>
              </View>
            )}
          </View>
          {alertItems.map((a, index) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.alertRow, index < alertItems.length - 1 && styles.alertRowBorder]}
              onPress={() => navigation.navigate(a.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.alertIconWrap, { backgroundColor: a.iconBg }]}>
                <MaterialIcons name={a.icon} size={18} color={a.accent} />
              </View>
              <Text style={styles.alertLabel}>{a.label}</Text>
              <Text style={[styles.alertValue, { color: a.accent }]}>{a.value}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Brand.textSubtle} />
            </TouchableOpacity>
>>>>>>> 8f32440 (Initial app update)
          ))}
        </View>

        {/* Chart */}
<<<<<<< HEAD
        <Text style={styles.sectionLabel}>MONTHLY SALES</Text>
        <View style={styles.chartCard}>
          {loading ? (
            <ActivityIndicator color="#2563EB" style={{ marginVertical: 24 }} />
          ) : !hasBarData ? (
            <Text style={styles.muted}>No sales data yet</Text>
          ) : (
            <VictoryChart
              width={chartWidth}
              height={190}
              padding={{ top: 10, bottom: 36, left: 52, right: 12 }}
              domainPadding={{ x: 16 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: '#E2E8F0' },
                  tickLabels: { fontSize: 9, fill: '#94A3B8', fontWeight: '500' },
=======
        <Text style={styles.sectionLabel}>Monthly sales</Text>
        <View style={styles.chartCard}>
          {threeMonthSales != null && threeMonthSales > 0 && (
            <Text style={styles.chartSubtitle}>
              {formatPKR(threeMonthSales)} in the last 3 months
            </Text>
          )}
          {loading ? (
            <ActivityIndicator color={Brand.primary} style={styles.chartLoader} />
          ) : !hasBarData ? (
            <View style={styles.chartEmpty}>
              <MaterialIcons name="bar-chart" size={32} color={Brand.border} />
              <Text style={styles.muted}>No sales data yet</Text>
            </View>
          ) : (
            <VictoryChart
              width={chartWidth}
              height={200}
              padding={{ top: 16, bottom: 36, left: 52, right: 12 }}
              domainPadding={{ x: 20 }}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: Brand.border },
                  tickLabels: { fontSize: 10, fill: Brand.textSubtle, fontFamily: Inter.medium },
>>>>>>> 8f32440 (Initial app update)
                  grid: { stroke: 'transparent' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: 'transparent' },
<<<<<<< HEAD
                  tickLabels: { fontSize: 9, fill: '#94A3B8' },
                  grid: { stroke: '#F1F5F9', strokeDasharray: '4' },
=======
                  tickLabels: { fontSize: 9, fill: Brand.textSubtle, fontFamily: Inter.regular },
                  grid: { stroke: Brand.borderLight, strokeDasharray: '4' },
>>>>>>> 8f32440 (Initial app update)
                }}
              />
              <VictoryBar
                data={barData}
                style={{
                  data: {
<<<<<<< HEAD
                    fill: '#2563EB',
                    borderRadius: 4,
                  },
                }}
                cornerRadius={{ top: 4 }}
=======
                    fill: Brand.primary,
                  },
                }}
                cornerRadius={{ top: 6 }}
                barWidth={22}
>>>>>>> 8f32440 (Initial app update)
              />
            </VictoryChart>
          )}
        </View>

<<<<<<< HEAD
        <View style={{ height: 16 }} />
=======
        <View style={styles.bottomSpacer} />
>>>>>>> 8f32440 (Initial app update)
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { paddingHorizontal: 16, paddingTop: 8 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  datePill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dateText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A', height: 42 },

  /* Search Results */
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: -10,
    marginBottom: 12,
=======
  safe: { flex: 1, backgroundColor: Brand.background },
  container: { paddingHorizontal: 16, paddingTop: 8 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerBrandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  headerTextWrap: { flex: 1 },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 22,
    color: Brand.text,
    fontFamily: Inter.bold,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Brand.textMuted,
    fontFamily: Inter.regular,
    lineHeight: 20,
  },
  datePill: {
    backgroundColor: Brand.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  dateText: {
    color: Brand.textMuted,
    fontSize: 12,
    fontFamily: Inter.semibold,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    height: 48,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Brand.text,
    fontFamily: Inter.regular,
    height: 48,
  },

  searchResults: {
    backgroundColor: Brand.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    marginTop: -12,
    marginBottom: 16,
>>>>>>> 8f32440 (Initial app update)
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
<<<<<<< HEAD
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchResultName: { fontSize: 13, color: '#0F172A', fontWeight: '500' },
  searchResultSku: { fontSize: 11, color: '#94A3B8' },

  /* Section Labels */
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 4,
  },

  /* Quick Actions */
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionIcon: { fontSize: 18, marginBottom: 4 },
  actionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.1, textAlign: 'center' },

  /* KPI */
  kpiGrid: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  kpiIcon: { fontSize: 18, marginBottom: 3 },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.1,
    textAlign: 'center',
    marginTop: 2,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.3,
    textAlign: 'center',
  },

  /* Alerts */
  alertsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  alertCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertIcon: { fontSize: 13 },
  alertValue: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  alertLabel: { fontSize: 9, color: '#64748B', fontWeight: '600', flexShrink: 1, letterSpacing: 0.1 },

  /* Chart */
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  muted: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 24,
  },
=======
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderLight,
  },
  searchResultName: {
    fontSize: 14,
    color: Brand.text,
    fontFamily: Inter.medium,
  },
  searchResultSku: {
    fontSize: 12,
    color: Brand.textSubtle,
    fontFamily: Inter.regular,
    marginTop: 2,
  },
  searchResultTextWrap: { flex: 1, paddingRight: 8 },

  sectionLabel: {
    fontSize: 13,
    fontFamily: Inter.semibold,
    color: Brand.textMuted,
    marginBottom: 10,
    marginTop: 4,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  actionCard: {
    width: '47%',
    backgroundColor: Brand.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Brand.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: Inter.semibold,
    color: Brand.text,
    textAlign: 'center',
  },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  kpiCard: {
    width: '47%',
    backgroundColor: Brand.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Brand.border,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: Inter.bold,
    letterSpacing: -0.3,
  },
  kpiLabel: {
    fontSize: 12,
    color: Brand.textMuted,
    fontFamily: Inter.medium,
    marginTop: 2,
  },

  alertsCard: {
    backgroundColor: Brand.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    marginBottom: 22,
    overflow: 'hidden',
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderLight,
  },
  alertsHeaderTitle: {
    fontSize: 13,
    fontFamily: Inter.semibold,
    color: Brand.text,
  },
  alertsBadge: {
    backgroundColor: Brand.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  alertsBadgeText: {
    fontSize: 12,
    fontFamily: Inter.bold,
    color: Brand.danger,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  alertRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderLight,
  },
  alertIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertLabel: {
    flex: 1,
    fontSize: 13,
    color: Brand.text,
    fontFamily: Inter.medium,
  },
  alertValue: {
    fontSize: 15,
    fontFamily: Inter.bold,
    marginRight: 2,
  },

  chartCard: {
    backgroundColor: Brand.surface,
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Brand.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chartSubtitle: {
    fontSize: 13,
    fontFamily: Inter.medium,
    color: Brand.textMuted,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  chartLoader: { marginVertical: 32 },
  chartEmpty: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  muted: {
    color: Brand.textSubtle,
    fontSize: 13,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
  bottomSpacer: { height: 16 },
>>>>>>> 8f32440 (Initial app update)
});
