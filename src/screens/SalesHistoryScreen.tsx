// src/screens/SalesHistoryScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Button,
  Keyboard,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../firebaseConfig';
import type { Sale } from '../services/salesService';
import type { RootStackParamList, SaleDetailParams } from '../navigation/AppNavigator';

type SaleWithId = Sale & { id: string };
type NavProp = NativeStackNavigationProp<RootStackParamList, 'SalesHistory'>;

const salesCol = collection(db, 'sales');

type FilterType = 'ALL' | 'TODAY' | 'LAST_7_DAYS';
type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export default function SalesHistoryScreen() {
  const navigation = useNavigation<NavProp>();
  const [sales, setSales] = useState<SaleWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  async function loadSales() {
    setLoading(true);
    try {
      const q = query(salesCol, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: SaleWithId[] = snap.docs.map((doc) => {
        const data = doc.data() as Sale;
        return { id: doc.id, ...data };
      });
      setSales(list);
    } catch (error) {
      console.error('Error loading sales history', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  function formatDate(ts: any) {
    if (!ts) return '';
    const date =
      typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  function tsToMs(ts: any): number | undefined {
    if (!ts) return undefined;
    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
    if (ts instanceof Date) return ts.getTime();
    return undefined;
  }

  function isWithinFilter(sale: SaleWithId, filterType: FilterType) {
    if (!sale.createdAt) return false;
    const saleDate =
      typeof sale.createdAt.toDate === 'function'
        ? sale.createdAt.toDate()
        : new Date(sale.createdAt);
    const now = new Date();
    if (filterType === 'ALL') return true;
    if (filterType === 'TODAY') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return saleDate >= startOfToday && saleDate <= endOfToday;
    }
    if (filterType === 'LAST_7_DAYS') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= sevenDaysAgo && saleDate <= now;
    }
    return true;
  }

  const filteredByDate = useMemo(
    () => sales.filter((s) => isWithinFilter(s, filter)),
    [sales, filter]
  );

  const filteredBySearch = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return filteredByDate;
    return filteredByDate.filter((s) => {
      const product = String(s.productName || '').toLowerCase();
      const customer = String(s.customerName || '').toLowerCase();
      return product.startsWith(term) || customer.startsWith(term);
    });
  }, [filteredByDate, search]);

  const filteredSales = useMemo(() => {
    const data = [...filteredBySearch];
    data.sort((a, b) => {
      if (sortField === 'date') {
        const aDate = typeof a.createdAt?.toDate === 'function' ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const bDate = typeof b.createdAt?.toDate === 'function' ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        const diff = aDate.getTime() - bDate.getTime();
        return sortDirection === 'asc' ? diff : -diff;
      }
      const aAmount = Number(a.total) || 0;
      const bAmount = Number(b.total) || 0;
      const diff = aAmount - bAmount;
      return sortDirection === 'asc' ? diff : -diff;
    });
    return data;
  }, [filteredBySearch, sortField, sortDirection]);

  const { totalRevenue, totalSalesCount, topProducts } = useMemo(() => {
    let revenue = 0;
    let count = 0;
    const productMap: Record<string, { productName: string; quantity: number; revenue: number }> = {};
    filteredSales.forEach((sale) => {
      const total = Number(sale.total) || 0;
      const qty = Number(sale.quantity) || 0;
      revenue += total;
      count += 1;
      if (!productMap[sale.productId]) {
        productMap[sale.productId] = { productName: sale.productName, quantity: 0, revenue: 0 };
      }
      productMap[sale.productId].quantity += qty;
      productMap[sale.productId].revenue += total;
    });
    const top = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, 3);
    return { totalRevenue: revenue, totalSalesCount: count, topProducts: top };
  }, [filteredSales]);

  const onPressSale = (item: SaleWithId) => {
    const saleParam: SaleDetailParams = {
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      total: item.total,
      customerPhone: item.customerPhone,
      customerName: item.customerName,
      createdAtMs: tsToMs(item.createdAt),
    };
    navigation.navigate('SaleDetail', { sale: saleParam });
  };

  const renderItem = ({ item }: { item: SaleWithId }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPressSale(item)} activeOpacity={0.75}>
      <View style={styles.row}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.amount}>Rs {item.total?.toLocaleString('en-PK')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detail}>
          Qty: {item.quantity} • Unit: Rs {item.quantity ? Math.round((item.total ?? 0) / item.quantity).toLocaleString('en-PK') : 0}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detail}>Date: {formatDate(item.createdAt)}</Text>
      </View>
      {item.customerName ? (
        <View style={styles.row}>
          <Text style={styles.detail}>Customer: {item.customerName}</Text>
        </View>
      ) : null}
      {item.customerPhone ? (
        <View style={styles.row}>
          <Text style={styles.detail}>Phone: {item.customerPhone}</Text>
        </View>
      ) : null}
      <Text style={styles.tapHint}>Tap to view details & reprint →</Text>
    </TouchableOpacity>
  );

  const toggleSortField = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortLabel = (field: SortField) => {
    const isActive = sortField === field;
    const base = field === 'date' ? 'Date' : 'Amount';
    if (!isActive) return base;
    const arrow = sortDirection === 'asc' ? '↑' : '↓';
    return `${base} ${arrow}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading sales...</Text>
      </View>
    );
  }

  if (!loading && filteredSales.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sales History</Text>
        <FilterBar filter={filter} setFilter={setFilter} />
        <SearchAndSortBar
          search={search}
          setSearch={setSearch}
          sortField={sortField}
          sortDirection={sortDirection}
          toggleSortField={toggleSortField}
          sortLabel={sortLabel}
        />
        <DashboardSummary totalRevenue={0} totalSalesCount={0} topProducts={[]} />
        <View style={styles.centerBody}>
          <Text>No sales for this period.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales History</Text>
      <FilterBar filter={filter} setFilter={setFilter} />
      <SearchAndSortBar
        search={search}
        setSearch={setSearch}
        sortField={sortField}
        sortDirection={sortDirection}
        toggleSortField={toggleSortField}
        sortLabel={sortLabel}
      />
      <DashboardSummary
        totalRevenue={totalRevenue}
        totalSalesCount={totalSalesCount}
        topProducts={topProducts}
      />
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

type FilterBarProps = { filter: FilterType; setFilter: (f: FilterType) => void };

function FilterBar({ filter, setFilter }: FilterBarProps) {
  return (
    <View style={styles.filterBar}>
      <FilterButton label="All time" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
      <FilterButton label="Today" active={filter === 'TODAY'} onPress={() => setFilter('TODAY')} />
      <FilterButton label="Last 7 days" active={filter === 'LAST_7_DAYS'} onPress={() => setFilter('LAST_7_DAYS')} />
    </View>
  );
}

type FilterButtonProps = { label: string; active: boolean; onPress: () => void };

function FilterButton({ label, active, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.filterButton, active && styles.filterButtonActive]}>
      <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

type SearchAndSortBarProps = {
  search: string;
  setSearch: (s: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  toggleSortField: (f: SortField) => void;
  sortLabel: (f: SortField) => string;
};

function SearchAndSortBar({ search, setSearch, sortField, sortDirection, toggleSortField, sortLabel }: SearchAndSortBarProps) {
  return (
    <View style={styles.searchSortContainer}>
      <TextInput
        placeholder="Search by product or customer"
        placeholderTextColor="gray"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.hideKeyboardRow}>
        <Button title="Hide Keyboard" onPress={() => Keyboard.dismiss()} />
      </View>
      <View style={styles.sortButtonsRow}>
        <TouchableOpacity
          style={[styles.sortButton, sortField === 'date' && styles.sortButtonActive]}
          onPress={() => toggleSortField('date')}
        >
          <Text style={[styles.sortButtonText, sortField === 'date' && styles.sortButtonTextActive]}>
            {sortLabel('date')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortField === 'amount' && styles.sortButtonActive]}
          onPress={() => toggleSortField('amount')}
        >
          <Text style={[styles.sortButtonText, sortField === 'amount' && styles.sortButtonTextActive]}>
            {sortLabel('amount')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type TopProduct = { productName: string; quantity: number; revenue: number };
type DashboardSummaryProps = { totalRevenue: number; totalSalesCount: number; topProducts: TopProduct[] };

function DashboardSummary({ totalRevenue, totalSalesCount, topProducts }: DashboardSummaryProps) {
  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total revenue</Text>
          <Text style={styles.summaryValue}>Rs {totalRevenue.toLocaleString('en-PK')}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total sales</Text>
          <Text style={styles.summaryValue}>{totalSalesCount}</Text>
        </View>
      </View>
      <View style={styles.topProductsCard}>
        <Text style={styles.topProductsTitle}>Top products</Text>
        {topProducts.length === 0 ? (
          <Text style={styles.topProductsEmpty}>No data</Text>
        ) : (
          topProducts.map((p, index) => (
            <View key={p.productName + index} style={styles.topProductRow}>
              <Text style={styles.topProductName}>{index + 1}. {p.productName}</Text>
              <Text style={styles.topProductDetail}>Qty: {p.quantity} • Rs {p.revenue.toLocaleString('en-PK')}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#ffffff' },
  centerBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  productName: { fontWeight: 'bold', fontSize: 16 },
  amount: { fontWeight: 'bold', fontSize: 16, color: '#007bff' },
  detail: { fontSize: 12, color: '#555' },
  tapHint: { fontSize: 11, color: '#2563EB', marginTop: 6, textAlign: 'right', fontWeight: '500' },
  filterBar: { flexDirection: 'row', marginBottom: 8 },
  filterButton: {
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16,
    borderWidth: 1, borderColor: '#ccc', marginRight: 8, backgroundColor: '#f5f5f5',
  },
  filterButtonActive: { borderColor: '#007bff', backgroundColor: '#e6f0ff' },
  filterButtonText: { fontSize: 12, color: '#555' },
  filterButtonTextActive: { color: '#007bff', fontWeight: '600' },
  searchSortContainer: { marginBottom: 8 },
  searchInput: {
    borderWidth: 1, borderColor: '#ccc', padding: 8,
    borderRadius: 4, marginBottom: 8, color: '#000',
  },
  sortButtonsRow: { flexDirection: 'row' },
  sortButton: {
    paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4,
    borderWidth: 1, borderColor: '#ccc', marginRight: 8, backgroundColor: '#f5f5f5',
  },
  sortButtonActive: { borderColor: '#007bff', backgroundColor: '#e6f0ff' },
  sortButtonText: { fontSize: 12, color: '#333', fontWeight: '500' },
  sortButtonTextActive: { color: '#007bff', fontWeight: '700' },
  dashboardContainer: { marginBottom: 12 },
  summaryRow: { flexDirection: 'row', marginBottom: 8 },
  summaryCard: {
    flex: 1, padding: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', marginRight: 8, backgroundColor: '#f2f8ff',
  },
  summaryLabel: { fontSize: 12, color: '#555' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  topProductsCard: {
    padding: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9',
  },
  topProductsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  topProductsEmpty: { fontSize: 12, color: '#777' },
  topProductRow: { marginTop: 4 },
  topProductName: { fontSize: 13, fontWeight: '500' },
  topProductDetail: { fontSize: 12, color: '#555' },
  hideKeyboardRow: { alignItems: 'flex-end', marginBottom: 4 },
});
