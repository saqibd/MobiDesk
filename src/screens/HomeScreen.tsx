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
  VictoryPie,
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

const PIE_COLORS = ['#2563eb','#16a34a','#7c3aed','#ea580c','#0891b2','#e11d48'];

function formatPKR(val: number) {
  if (!val) return 'PKR 0';
  if (val >= 1_000_000) return `PKR ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `PKR ${(val / 1_000).toFixed(0)}K`;
  return `PKR ${val}`;
}

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

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      const cat = p.category ?? 'other';
      map[cat] = (map[cat] ?? 0) + (p.stock ?? 0);
    }
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!entries.length) return null;
    return entries.map(([label, y], i) => ({
      x: label,
      y,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [products]);

  const barData = monthlySales.map(m => ({ x: m.month, y: m.total }));
  const hasBarData = barData.some(d => d.y > 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.headerTitle}>Dashboard</Text>

        {/* Search */}
        <View style={styles.search}>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Quick Actions */}
        <View style={[styles.card, { marginTop: 0 }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate('Sales')}>
              <Text style={styles.action}>Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
              <Text style={styles.action}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Customers')}>
              <Text style={styles.action}>Customers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
              <Text style={styles.action}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KPI */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Stock</Text>
            <Text style={styles.kpiValue}>{stats?.totalStock ?? '—'}</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Stock Value</Text>
            <Text style={styles.kpiValue}>
              {stats ? formatPKR(stats.stockValue) : '—'}
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Low Stock</Text>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>
              {stats?.lowStockCount ?? '—'}
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>3-mo Sales</Text>
            <Text style={styles.kpiValue}>
              {threeMonthSales ? formatPKR(threeMonthSales) : '—'}
            </Text>
          </View>
        </View>

        {/* Alerts */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Attention Needed</Text>
          <Text style={styles.alert}>Low stock: {stats?.lowStockCount ?? 0}</Text>
          <Text style={styles.alert}>Pending orders: {pendingOrdersCount ?? 0}</Text>
          <Text style={styles.alert}>Reminders: {remindersCount ?? 0}</Text>
        </View>

        {/* Chart */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly Sales</Text>
          {loading ? (
            <ActivityIndicator />
          ) : !hasBarData ? (
            <Text style={styles.muted}>No data</Text>
          ) : (
            <VictoryChart width={chartWidth} height={220} theme={VictoryTheme.material}>
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryBar data={barData} style={{ data: { fill: '#2563EB' } }} />
            </VictoryChart>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 16 },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0F172A',
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  searchInput: {
    height: 40,
    fontSize: 14,
  },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  kpiCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },

  kpiLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },

  card: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  alert: {
    fontSize: 14,
    marginBottom: 6,
  },

  muted: {
    color: '#94A3B8',
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  action: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
  },
});