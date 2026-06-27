// src/screens/SalesHistoryScreen.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    collection,
    getDocs,
    orderBy,
    query,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Brand, Inter } from '../constants/brand';
import { db } from '../firebaseConfig';
import type { RootStackParamList, SaleDetailParams } from '../navigation/AppNavigator';
import type { Sale } from '../services/salesService';
import { screenStyles as shared } from '../styles/screenStyles';

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

function toDate(value: any): Date {
    if (!value) return new Date(0);
    if (typeof value.toDate === 'function') return value.toDate();
    return new Date(value as string | number);
  }

  function formatDate(ts: any) {
    if (!ts) return '';
    const date = toDate(ts);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  function tsToMs(ts: any): number | undefined {
    if (!ts) return undefined;
    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
    if (ts instanceof Date) return ts.getTime();
    const d = new Date(ts as string | number);
    return Number.isNaN(d.getTime()) ? undefined : d.getTime();
  }

  function isWithinFilter(sale: SaleWithId, filterType: FilterType): boolean {
    const saleDate = toDate(sale.createdAt);
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
const aDate = toDate(a.createdAt);
        const bDate = toDate(b.createdAt);
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
      const productId = sale.productId || sale.productName || 'unknown';
      const qty = Number(sale.quantity) || 0;
      const total = Number(sale.total) || 0;
      revenue += total;
      count += 1;
      if (!productMap[productId]) {
        productMap[productId] = { productName: sale.productName ?? '', quantity: 0, revenue: 0 };
      }
      productMap[productId].quantity += qty;
      productMap[productId].revenue += total;
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
<View style={styles.tapHintRow}>
        <Text style={styles.tapHint}>View details & reprint</Text>
        <MaterialIcons name="chevron-right" size={18} color={Brand.primary} />
      </View>
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
<ActivityIndicator size="large" color={Brand.primary} />
        <Text style={styles.loadingText}>Loading sales…</Text>
      </View>
    );
  }

  if (!loading && filteredSales.length === 0) {
    return (
      <View style={styles.container}>
<Text style={shared.title}>Sales history</Text>
        <Text style={shared.subtitle}>Review past transactions and revenue.</Text>
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
<MaterialIcons name="receipt-long" size={40} color={Brand.border} style={{ marginBottom: 12 }} />
          <Text style={shared.emptyTitle}>No sales for this period</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
<Text style={shared.title}>Sales history</Text>
      <Text style={shared.subtitle}>Review past transactions and revenue.</Text>
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
<View style={shared.searchBar}>
        <MaterialIcons name="search" size={20} color={Brand.textSubtle} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search by product or customer"
          placeholderTextColor={Brand.textSubtle}
          style={shared.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <TouchableOpacity style={styles.hideKeyboardBtn} onPress={() => Keyboard.dismiss()}>
        <MaterialIcons name="keyboard-hide" size={16} color={Brand.textMuted} />
        <Text style={styles.hideKeyboardText}>Hide keyboard</Text>
      </TouchableOpacity>
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
container: { flex: 1, padding: 16, backgroundColor: Brand.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Brand.background,
  },
  centerBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 16 },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Inter.medium,
    color: Brand.textMuted,
  },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    marginBottom: 10,
    backgroundColor: Brand.surface,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  productName: { fontFamily: Inter.semibold, fontSize: 15, color: Brand.text, flex: 1, marginRight: 8 },
  amount: { fontFamily: Inter.bold, fontSize: 15, color: Brand.primary },
  detail: { fontSize: 12, fontFamily: Inter.regular, color: Brand.textMuted },
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: 8,
  },
  tapHint: { fontSize: 12, fontFamily: Inter.semibold, color: Brand.primary },
  filterBar: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  filterButtonActive: { borderColor: Brand.primary, backgroundColor: Brand.primaryBg },
  filterButtonText: { fontSize: 12, fontFamily: Inter.medium, color: Brand.textMuted },
  filterButtonTextActive: { color: Brand.primary, fontFamily: Inter.semibold },
  searchSortContainer: { marginBottom: 12 },
  hideKeyboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginBottom: 8,
    paddingVertical: 4,
  },
  hideKeyboardText: { fontSize: 12, fontFamily: Inter.medium, color: Brand.textMuted },
  sortButtonsRow: { flexDirection: 'row', gap: 8 },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  sortButtonActive: { borderColor: Brand.primary, backgroundColor: Brand.primaryBg },
  sortButtonText: { fontSize: 12, fontFamily: Inter.medium, color: Brand.textMuted },
  sortButtonTextActive: { color: Brand.primary, fontFamily: Inter.semibold },
  dashboardContainer: { marginBottom: 14 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  summaryLabel: { fontSize: 12, fontFamily: Inter.medium, color: Brand.textMuted },
  summaryValue: { fontSize: 18, fontFamily: Inter.bold, color: Brand.text, marginTop: 4 },
  topProductsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  topProductsTitle: { fontSize: 14, fontFamily: Inter.semibold, color: Brand.text, marginBottom: 6 },
  topProductsEmpty: { fontSize: 12, fontFamily: Inter.regular, color: Brand.textSubtle },
  topProductRow: { marginTop: 6 },
  topProductName: { fontSize: 13, fontFamily: Inter.semibold, color: Brand.text },
  topProductDetail: { fontSize: 12, fontFamily: Inter.regular, color: Brand.textMuted, marginTop: 2 },
});
