import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getMonthlyRevenueForProduct, getMonthlyUnitsForProduct, getSalesForProduct, type MonthlyRevenue, type MonthlyUnits, type Sale } from '../services/salesService';

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

function formatDate(value: unknown): string | null {
  if (value == null) return null;

  try {
    if (value instanceof Date) {
      if (!isNaN(value.getTime())) return formatAsShort(value);
    }

    if (typeof value === 'object' && value !== null) {
      const objectValue = value as Record<string, unknown>;
      const maybeToDate = objectValue.toDate;
      if (typeof maybeToDate === 'function') {
        const d = maybeToDate.call(objectValue);
        if (d instanceof Date && !isNaN(d.getTime())) return formatAsShort(d);
      }

      const maybeSeconds = objectValue.seconds;
      if (typeof maybeSeconds === 'number') {
        const nanos = objectValue.nanoseconds;
        const ms = maybeSeconds * 1000 + (typeof nanos === 'number' ? Math.round(nanos / 1e6) : 0);
        const d = new Date(ms);
        if (!isNaN(d.getTime())) return formatAsShort(d);
      }
    }

    // Number: unix seconds or milliseconds
    if (typeof value === 'number') {
      const n = value as number;
      const date = n < 1e10 ? new Date(n * 1000) : new Date(n);
      if (!isNaN(date.getTime())) return formatAsShort(date);
    }

    // String: ISO or numeric
    if (typeof value === 'string') {
      const maybeNum = Number(value);
      if (!Number.isNaN(maybeNum)) {
        const date = maybeNum < 1e10 ? new Date(maybeNum * 1000) : new Date(maybeNum);
        if (!isNaN(date.getTime())) return formatAsShort(date);
      }
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return formatAsShort(parsed);
    }
  } catch (e) {
    // fall through to null
  }

  return null;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function formatAsShort(d: Date) {
  const day = pad(d.getDate());
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mon = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${day} ${mon} ${year}, ${hours}:${minutes}`;
}

function formatCurrency(value: number) {
  return `PKR ${value.toLocaleString('en-PK')}`;
}

function SkeletonMetricCard() {
  return (
    <>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 120 }]} />
        <View style={[styles.skeletonBlock, { width: 90 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 140 }]} />
        <View style={[styles.skeletonBlock, { width: 100 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}> 
        <View style={[styles.skeletonBlock, { width: 110 }]} />
        <View style={[styles.skeletonBlock, { width: 130 }]} />
      </View>
    </>
  );
}

function SkeletonInventoryCard() {
  return (
    <>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 140 }]} />
        <View style={[styles.skeletonBlock, { width: 80 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 130 }]} />
        <View style={[styles.skeletonBlock, { width: 110 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 160 }]} />
        <View style={[styles.skeletonBlock, { width: 90 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 1 }]}> 
        <View style={[styles.skeletonBlock, { width: 150 }]} />
        <View style={[styles.skeletonBlock, { width: 95 }]} />
      </View>
      <View style={[styles.fieldRow, { borderBottomWidth: 0 }]}> 
        <View style={[styles.skeletonBlock, { width: 110 }]} />
        <View style={[styles.skeletonBlock, { width: 120 }]} />
      </View>
    </>
  );
}

function SkeletonChartPlaceholder() {
  return (
    <>
      <View style={[styles.skeletonBlock, { width: '100%', height: 180, marginBottom: 14 }]} />
      <View style={[styles.skeletonRow, { width: '60%' }]} />
    </>
  );
}

function SkeletonRecentSaleItem() {
  return (
    <View style={[styles.fieldRow, { flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 1, paddingVertical: 14 }]}> 
      <View style={[styles.skeletonBlock, { width: '60%', marginBottom: 10 }]} />
      <View style={[styles.skeletonBlock, { width: '40%', marginBottom: 10 }]} />
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
        <View style={[styles.skeletonBlock, { width: '45%' }]} />
        <View style={[styles.skeletonBlock, { width: '35%' }]} />
      </View>
    </View>
  );
}

export default function ProductDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;
  const createdLabel = formatDate(product.createdAt as unknown);
  const updatedLabel = formatDate(product.updatedAt as unknown);

  // Business metrics
  const hasCost = product.purchasePrice != null;
  const hasPrice = product.price != null;
  const hasStock = product.stock != null;

  const profitPerUnit = useMemo<number | undefined>(() => {
    if (!hasCost || !hasPrice) return undefined;
    return (product.price as number) - (product.purchasePrice as number);
  }, [hasCost, hasPrice, product.price, product.purchasePrice]);

  const stockValue = useMemo<number | undefined>(() => {
    if (!hasStock || !hasCost) return undefined;
    return (product.stock as number) * (product.purchasePrice as number);
  }, [hasStock, hasCost, product.stock, product.purchasePrice]);

  const potentialRevenue = useMemo<number | undefined>(() => {
    if (!hasStock || !hasPrice) return undefined;
    return (product.stock as number) * (product.price as number);
  }, [hasStock, hasPrice, product.stock, product.price]);

  // Analytics & sales performance
  const [recentSales, setRecentSales] = useState<Sale[] | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[] | null>(null);
  const [monthlyUnits, setMonthlyUnits] = useState<MonthlyUnits[] | null>(null);
  const [loading, setLoading] = useState(false);

  const monthsTracked = 6;
  const window = useWindowDimensions();
  const isMounted = useRef(true);

  const loadAnalytics = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      if (!product.id) {
        setRecentSales([]);
        setMonthlyRevenue([]);
        setMonthlyUnits([]);
        return;
      }

      const [salesRows, revenueRows, unitsRows] = await Promise.all([
        getSalesForProduct(product.id, 5),
        getMonthlyRevenueForProduct(product.id, monthsTracked),
        getMonthlyUnitsForProduct(product.id, monthsTracked),
      ]);

      if (!isMounted.current) return;
      setRecentSales(salesRows);
      setMonthlyRevenue(revenueRows);
      setMonthlyUnits(unitsRows);
    } catch (error) {
      if (!isMounted.current) return;
      setRecentSales([]);
      setMonthlyRevenue([]);
      setMonthlyUnits([]);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [product.id, monthsTracked]);

  const reloadAnalytics = useCallback(async () => {
    if (loading) return;
    await loadAnalytics();
  }, [loadAnalytics, loading]);

  useEffect(() => {
    loadAnalytics();
    return () => {
      isMounted.current = false;
    };
  }, [loadAnalytics]);

  const totalUnitsSold = useMemo(() => {
    if (!monthlyUnits) return 0;
    return monthlyUnits.reduce((s, m) => s + (m.units ?? 0), 0);
  }, [monthlyUnits]);

  const totalRevenueGenerated = useMemo(() => {
    if (!monthlyRevenue) return 0;
    return monthlyRevenue.reduce((s, m) => s + (m.total ?? 0), 0);
  }, [monthlyRevenue]);

  const totalProfitGenerated = useMemo<number | undefined>(() => {
    if (profitPerUnit == null || totalUnitsSold <= 0) return undefined;
    const profit = profitPerUnit * totalUnitsSold;
    return Number.isFinite(profit) ? profit : undefined;
  }, [profitPerUnit, totalUnitsSold]);

  const performanceBadge = useMemo(() => {
    if (totalUnitsSold >= 100) {
      return { label: '🔥 Best Seller', color: '#DC2626', description: `${totalUnitsSold} Units Sold` };
    }
    if (totalUnitsSold >= 30) {
      return { label: '⚡ Fast Moving', color: '#EA580C', description: `${totalUnitsSold} Units Sold` };
    }
    if (totalUnitsSold > 0) {
      return { label: '📈 Active Product', color: '#2563EB', description: `${totalUnitsSold} Units Sold` };
    }
    return { label: '🐢 Slow Moving', color: '#64748B', description: `${totalUnitsSold} Units Sold` };
  }, [totalUnitsSold]);

  const lastSale = useMemo(() => (recentSales && recentSales.length > 0 ? recentSales[0] : null), [recentSales]);

  const averageMonthlySales = useMemo(() => {
    if (!monthlyUnits || monthlyUnits.length === 0) return 0;
    const total = monthlyUnits.reduce((s, m) => s + (m.units ?? 0), 0);
    return total / monthsTracked;
  }, [monthlyUnits, monthsTracked]);

  const dailyConsumption = useMemo(() => {
    if (!averageMonthlySales || averageMonthlySales <= 0) return 0;
    return averageMonthlySales / 30;
  }, [averageMonthlySales]);

  const daysRemaining = useMemo(() => {
    if (!hasStock || !dailyConsumption || dailyConsumption <= 0) return undefined;
    const days = (product.stock as number) / dailyConsumption;
    return Number.isFinite(days) ? days : undefined;
  }, [hasStock, dailyConsumption, product.stock]);

  const stockoutDate = useMemo<string | undefined>(() => {
    if (daysRemaining == null || daysRemaining <= 0 || !Number.isFinite(daysRemaining)) return undefined;
    const stockoutDateValue = new Date();
    stockoutDateValue.setDate(stockoutDateValue.getDate() + Math.floor(daysRemaining));
    const formatted = formatDate(stockoutDateValue.toISOString());
    return formatted ? formatted.split(',')[0] : undefined;
  }, [daysRemaining]);

  const stockStatus = useMemo(() => {
    if (daysRemaining == null) return { label: 'Unknown', color: '#64748B' };
    if (daysRemaining <= 15) return { label: 'Critical', color: '#DC2626' };
    if (daysRemaining <= 30) return { label: 'Low Stock', color: '#EA580C' };
    return { label: 'Healthy', color: '#16A34A' };
  }, [daysRemaining]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.subtitle}>{product.category ? `${product.category.toUpperCase()} • ${product.condition ?? 'Unknown'}` : product.condition ?? 'Product details'}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              disabled={loading}
              onPress={reloadAnalytics}
              style={({ pressed }) => [
                styles.refreshButton,
                loading && styles.disabledButton,
                pressed && !loading && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Text style={styles.refreshText}>🔄 Refresh</Text>
              )}
            </Pressable>
            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed, styles.backButtonMargin]}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>SKU</Text>
            <Text style={styles.fieldValue}>{product.sku ?? 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Barcode</Text>
            <Text style={styles.fieldValue}>{product.barcode ?? 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{product.category ?? 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Cost Price</Text>
            <Text style={styles.fieldValue}>{product.purchasePrice != null ? `PKR ${product.purchasePrice.toLocaleString('en-PK')}` : 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Selling Price</Text>
            <Text style={styles.fieldValue}>{product.price != null ? `PKR ${product.price.toLocaleString('en-PK')}` : 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Current Stock</Text>
            <Text style={styles.fieldValue}>{product.stock != null ? String(product.stock) : 'N/A'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Low Stock Threshold</Text>
            <Text style={styles.fieldValue}>N/A</Text>
          </View>
          {createdLabel ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Created</Text>
              <Text style={styles.fieldValue}>{createdLabel}</Text>
            </View>
          ) : null}

          {updatedLabel ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Last Updated</Text>
              <Text style={styles.fieldValue}>{updatedLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Business Metrics</Text>
          {profitPerUnit !== undefined ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Profit Per Unit</Text>
              <Text style={styles.fieldValue}>{formatCurrency(profitPerUnit)}</Text>
            </View>
          ) : null}

          {/* Stock Value: show row only when costPrice exists; if stock missing show '—' */}
          {hasCost ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Stock Value</Text>
              <Text style={styles.fieldValue}>{stockValue !== undefined ? formatCurrency(stockValue) : '—'}</Text>
            </View>
          ) : null}

          {/* Potential Revenue: show row only when sellingPrice exists; if stock missing show '—' */}
          {hasPrice ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Potential Revenue</Text>
              <Text style={styles.fieldValue}>{potentialRevenue !== undefined ? formatCurrency(potentialRevenue) : '—'}</Text>
            </View>
          ) : null}

          {totalProfitGenerated !== undefined ? (
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Total Profit Generated</Text>
              <Text style={styles.fieldValue}>{formatCurrency(totalProfitGenerated)}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Performance</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{performanceBadge.label}</Text>
            <Text style={[styles.fieldValue, { color: performanceBadge.color }]}>{performanceBadge.description}</Text>
          </View>
        </View>

        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Sales Performance</Text>
          {loading ? (
            <SkeletonMetricCard />
          ) : (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Total Units Sold</Text>
                <Text style={styles.fieldValue}>{String(totalUnitsSold)}</Text>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Total Revenue</Text>
                <Text style={styles.fieldValue}>{formatCurrency(totalRevenueGenerated)}</Text>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Last Sale Date</Text>
                <Text style={styles.fieldValue}>{lastSale ? (formatDate(lastSale.createdAt as unknown) ?? '—') : '—'}</Text>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Last Sale Amount</Text>
                <Text style={styles.fieldValue}>{lastSale && typeof lastSale.total === 'number' ? formatCurrency(lastSale.total) : '—'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Sales Trend (Chart) */}
        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Sales Trend</Text>
          {loading ? (
            <SkeletonChartPlaceholder />
          ) : !monthlyRevenue || monthlyRevenue.length === 0 || monthlyRevenue.every(m => m.total === 0) ? (
            <Text style={{ color: '#64748B' }}>No sales trend available</Text>
          ) : (
            <VictoryChart width={Math.max(300, window.width - 48)} domainPadding={{ x: 20 }}>
              <VictoryAxis style={{ tickLabels: { fontSize: 10, padding: 6 } }} />
              <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 10, padding: 6 } }} />
              <VictoryBar
                data={monthlyRevenue.map(m => ({ x: m.month, y: m.total }))}
                style={{ data: { fill: '#2563EB' } }}
                barRatio={0.8}
              />
            </VictoryChart>
          )}
        </View>

        {/* Inventory Health */}
        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Inventory Health</Text>
          {loading ? (
            <SkeletonInventoryCard />
          ) : (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Current Stock</Text>
                <Text style={styles.fieldValue}>{hasStock ? String(product.stock) : '—'}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Average Monthly Sales</Text>
                <Text style={styles.fieldValue}>{Number.isFinite(averageMonthlySales) ? Math.round(averageMonthlySales) : '—'}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Estimated Days Remaining</Text>
                <Text style={styles.fieldValue}>{daysRemaining != null ? Math.round(daysRemaining) : '—'}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Estimated Stock-Out</Text>
                <Text style={styles.fieldValue}>{stockoutDate ?? 'Not enough data'}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Status</Text>
                <Text style={[styles.fieldValue, { color: stockStatus.color }]}>{stockStatus.label}</Text>
              </View>
            </>
          )}
        </View>

        {/* Recent Sales */}
        <View style={[styles.card, { marginTop: 14 }]}> 
          <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 8 }}>Recent Sales</Text>
          {loading ? (
            <>
              <SkeletonRecentSaleItem />
              <SkeletonRecentSaleItem />
              <SkeletonRecentSaleItem />
            </>
          ) : recentSales && recentSales.length > 0 ? (
            recentSales.map(s => (
              <View key={s.id} style={[styles.fieldRow, { flexDirection: 'column', alignItems: 'flex-start' }]}> 
                <Text style={{ color: '#64748B', fontSize: 12 }}>{formatDate(s.createdAt as unknown) ?? '—'}</Text>
                <Text style={{ fontWeight: '600', marginTop: 6 }}>{s.customerName ?? 'Walk-in Customer'}</Text>
                <View style={{ flexDirection: 'row', width: '100%', marginTop: 6 }}>
                  <Text style={{ flex: 0.5, color: '#64748B' }}>Qty: {s.quantity ?? '—'}</Text>
                  <Text style={{ flex: 0.5, textAlign: 'right', fontWeight: '700' }}>{typeof s.total === 'number' ? formatCurrency(s.total) : '—'}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#64748B' }}>No sales recorded yet</Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('EditProduct', { product })}
          >
            <Text style={styles.actionLabel}>Edit Product</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('ShareProduct', { product })}
          >
            <Text style={[styles.actionLabel, styles.secondaryLabel]}>Share Product</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#2563EB',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  refreshText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButtonMargin: {
    marginLeft: 8,
  },
  skeletonRow: {
    height: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonBlock: {
    height: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
});
