// src/screens/HomeScreen.tsx
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

import {
  getProductStats,
  getProducts,
  type ProductStats,
} from '../services/productService';
import type { ProductWithId as Product } from '../types/product';

import {
  getThreeMonthSalesTotal,
  getMonthlySales,
  getRecentSales,
  type MonthlySale,
  type Sale,
} from '../services/salesService';

import { getPendingOrdersCount } from '../services/ordersService';
import { getActiveRemindersCount } from '../services/remindersService';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

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
      color: '#DC2626',
      bg: '#FEF2F2',
      icon: '⚠️',
    },
    {
      label: 'Pending orders',
      value: pendingOrdersCount ?? 0,
      color: '#EA580C',
      bg: '#FFF7ED',
      icon: '📋',
    },
    {
      label: 'Active reminders',
      value: remindersCount ?? 0,
      color: '#7C3AED',
      bg: '#F5F3FF',
      icon: '🔔',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{today}</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products by name, SKU or barcode…"
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Search Results */}
        {filteredProducts.length > 0 && (
          <View style={styles.searchResults}>
            {filteredProducts.map(p => (
              <View key={p.id} style={styles.searchResultItem}>
                <Text style={styles.searchResultName}>{p.name}</Text>
                <Text style={styles.searchResultSku}>{p.sku ?? p.barcode ?? ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
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
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Grid */}
        <Text style={styles.sectionLabel}>OVERVIEW</Text>
        <View style={styles.kpiGrid}>
          {KPI_CONFIG.map(k => (
            <View key={k.key} style={[styles.kpiCard, { backgroundColor: k.bg }]}>
              <Text style={styles.kpiIcon}>{k.icon}</Text>
              <Text style={[styles.kpiValue, { color: k.accent }]}>{kpiValues[k.key]}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Alerts */}
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
          ))}
        </View>

        {/* Chart */}
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
                  grid: { stroke: 'transparent' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: 'transparent' },
                  tickLabels: { fontSize: 9, fill: '#94A3B8' },
                  grid: { stroke: '#F1F5F9', strokeDasharray: '4' },
                }}
              />
              <VictoryBar
                data={barData}
                style={{
                  data: {
                    fill: '#2563EB',
                    borderRadius: 4,
                  },
                }}
                cornerRadius={{ top: 4 }}
              />
            </VictoryChart>
          )}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
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
});
