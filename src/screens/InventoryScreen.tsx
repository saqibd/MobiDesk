// src/screens/InventoryScreen.tsx
<<<<<<< HEAD
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getProducts, type Product } from '../services/productService';
=======
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand, Inter } from '../constants/brand';
import { getProducts, type Product } from '../services/productService';
import { screenStyles as shared } from '../styles/screenStyles';
>>>>>>> 8f32440 (Initial app update)

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Inventory'>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

// Common brands to detect from product names when the brand field is blank.
const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Oppo', 'Vivo', 'ITEL', 'Itel',
  'Infinix', 'Huawei', 'Xiaomi', 'Redmi', 'Realme',
  'Nokia', 'Motorola', 'Sony', 'OnePlus', 'Google',
  'Tecno', 'Honor', 'LG', 'HTC',
];

/** Return the brand label for a product.
 *  Priority: brand field → name prefix match → "Other" */
function resolveBrand(p: Product): string {
  const explicit = (p.brand ?? '').trim();
  if (explicit) return explicit;

  const nameLower = p.name.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    if (nameLower.startsWith(b.toLowerCase())) return b;
  }
  return 'Other';
}

/** Group an array of products by brand, "Other" for unbranded. */
function groupByBrand(products: Product[]): { brand: string; items: Product[] }[] {
  const map = new Map<string, Product[]>();

  for (const p of products) {
    const key = resolveBrand(p);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }

  // Sort brand names alphabetically, "Other" always last
  const sorted = Array.from(map.entries()).sort(([a], [b]) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  return sorted.map(([brand, items]) => ({ brand, items }));
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductListItem({
  product,
  onEdit,
  onShare,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onShare: (p: Product) => void;
}) {
  const isLowStock = typeof product.stock === 'number' && product.stock <= 3;
  const metaParts: string[] = [];
  if (product.condition) metaParts.push(product.condition);
  if (product.ramMemory) metaParts.push(product.ramMemory);

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitial(product.name)}</Text>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.cardNameRow}>
          <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockText}>Low stock</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardSub} numberOfLines={1}>
          Rs. {product.price} • Stock: {product.stock}
          {metaParts.length > 0 ? ' • ' + metaParts.join(' • ') : ''}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(product)} activeOpacity={0.7}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={() => onShare(product)} activeOpacity={0.7}>
<<<<<<< HEAD
          <Text style={styles.shareBtnText}>📲</Text>
=======
          <MaterialIcons name="share" size={18} color={Brand.primary} />
>>>>>>> 8f32440 (Initial app update)
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Brand group ─────────────────────────────────────────────────────────────

function BrandGroup({
  brand,
  items,
  onEdit,
  onShare,
}: {
  brand: string;
  items: Product[];
  onEdit: (p: Product) => void;
  onShare: (p: Product) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <View style={styles.group}>
      {/* Heading row */}
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={() => setOpen(o => !o)}
        activeOpacity={0.75}
      >
        <View style={styles.groupHeaderLeft}>
          <Text style={styles.groupBrand}>{brand}</Text>
          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        {/* Chevron rotates visually: ▼ open, ▶ closed */}
<<<<<<< HEAD
        <Text style={[styles.groupChevron, !open && styles.groupChevronClosed]}>
          ▼
        </Text>
=======
        <MaterialIcons
          name="keyboard-arrow-down"
          size={22}
          color={Brand.primary}
          style={!open ? styles.groupChevronClosed : undefined}
        />
>>>>>>> 8f32440 (Initial app update)
      </TouchableOpacity>

      {/* Divider always visible */}
      <View style={styles.groupDivider} />

      {/* Dropdown items */}
      {open && (
        <View style={styles.groupItems}>
          {items.map(p => (
            <ProductListItem key={p.id} product={p} onEdit={onEdit} onShare={onShare} />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Error loading products', e);
      Alert.alert('Error', 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation]);

  const onAddProduct = () => navigation.navigate('AddProduct');
  const onScanBarcode = () => navigation.navigate('ScanBarcode');
  const onImportCsv = () => navigation.navigate('CsvImport', { type: 'products' });
  const onShareProduct = (product: Product) =>
    navigation.navigate('ShareProduct', { product });
  const onEditProduct = (product: Product) =>
    navigation.navigate('EditProduct', { product });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? '').toLowerCase().includes(term)
    );
  }, [search, products]);

  const groups = useMemo(() => groupByBrand(filtered), [filtered]);

  return (
    <ScrollView
<<<<<<< HEAD
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.subtitle}>
        Manage products, stock levels, and pricing.
      </Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name or brand"
          placeholderTextColor="#94A3B8"
=======
      contentContainerStyle={shared.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={shared.title}>Inventory</Text>
      <Text style={shared.subtitle}>
        Manage products, stock levels, and pricing.
      </Text>

      <View style={shared.searchBar}>
        <MaterialIcons name="search" size={20} color={Brand.textSubtle} style={{ marginRight: 10 }} />
        <TextInput
          style={shared.searchInput}
          placeholder="Search products by name or brand"
          placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

<<<<<<< HEAD
      {/* Actions */}
      <TouchableOpacity style={styles.primaryButton} onPress={onAddProduct}>
        <Text style={styles.primaryButtonText}>+ Add Product</Text>
      </TouchableOpacity>

      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={[styles.outlineButton, { flex: 1 }]}
          onPress={onScanBarcode}
        >
          <Text style={styles.outlineButtonText}>Scan Barcode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlineButton, { flex: 1 }]}
          onPress={onImportCsv}
        >
          <Text style={styles.outlineButtonText}>📥 Import CSV</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>Loading inventory…</Text>
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.emptyState}>
          {products.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>No products yet.</Text>
              <Text style={styles.emptyHint}>
                Tap "+ Add Product" or import a CSV file to get started.
              </Text>
            </>
          ) : (
            <Text style={styles.emptyTitle}>No products found for this search.</Text>
=======
      <TouchableOpacity style={shared.primaryButton} onPress={onAddProduct}>
        <Text style={shared.primaryButtonText}>+ Add product</Text>
      </TouchableOpacity>

      <View style={shared.secondaryRow}>
        <TouchableOpacity style={shared.outlineButton} onPress={onScanBarcode}>
          <MaterialIcons name="qr-code-scanner" size={18} color={Brand.text} />
          <Text style={shared.outlineButtonText}>Scan barcode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={shared.outlineButton} onPress={onImportCsv}>
          <MaterialIcons name="upload-file" size={18} color={Brand.text} />
          <Text style={shared.outlineButtonText}>Import CSV</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={shared.loadingRow}>
          <ActivityIndicator size="small" color={Brand.primary} />
          <Text style={shared.loadingText}>Loading inventory…</Text>
        </View>
      ) : groups.length === 0 ? (
        <View style={shared.emptyState}>
          {products.length === 0 ? (
            <>
              <MaterialIcons name="inventory-2" size={40} color={Brand.border} style={{ marginBottom: 12 }} />
              <Text style={shared.emptyTitle}>No products yet</Text>
              <Text style={shared.emptyHint}>
                Tap &quot;Add product&quot; or import a CSV file to get started.
              </Text>
            </>
          ) : (
            <Text style={shared.emptyTitle}>No products found for this search.</Text>
>>>>>>> 8f32440 (Initial app update)
          )}
        </View>
      ) : (
        groups.map(g => (
          <BrandGroup
            key={g.brand}
            brand={g.brand}
            items={g.items}
            onEdit={onEditProduct}
            onShare={onShareProduct}
          />
        ))
      )}
    </ScrollView>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },

  // Header
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '500',
  },

  // Brand group
  group: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
=======
  group: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
>>>>>>> 8f32440 (Initial app update)
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
<<<<<<< HEAD
    backgroundColor: '#F1F5F9',
=======
    backgroundColor: Brand.borderLight,
>>>>>>> 8f32440 (Initial app update)
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  groupBrand: {
    fontSize: 15,
<<<<<<< HEAD
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  groupBadge: {
    backgroundColor: '#E2E8F0',
=======
    fontFamily: Inter.bold,
    color: Brand.text,
  },
  groupBadge: {
    backgroundColor: Brand.border,
>>>>>>> 8f32440 (Initial app update)
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  groupBadgeText: {
    fontSize: 11,
<<<<<<< HEAD
    fontWeight: '600',
    color: '#475569',
  },
  groupChevron: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
=======
    fontFamily: Inter.semibold,
    color: Brand.textMuted,
>>>>>>> 8f32440 (Initial app update)
  },
  groupChevronClosed: {
    transform: [{ rotate: '-90deg' }],
  },
  groupDivider: {
    height: 1,
<<<<<<< HEAD
    backgroundColor: '#E2E8F0',
=======
    backgroundColor: Brand.border,
>>>>>>> 8f32440 (Initial app update)
  },
  groupItems: {
    padding: 10,
    gap: 8,
  },
<<<<<<< HEAD

  // Product card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
=======
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
>>>>>>> 8f32440 (Initial app update)
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
<<<<<<< HEAD
    backgroundColor: '#E5E7EB',
=======
    backgroundColor: Brand.primaryBg,
>>>>>>> 8f32440 (Initial app update)
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 15,
<<<<<<< HEAD
    fontWeight: '700',
    color: '#374151',
=======
    fontFamily: Inter.bold,
    color: Brand.primary,
>>>>>>> 8f32440 (Initial app update)
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  cardName: {
    fontSize: 14,
<<<<<<< HEAD
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  lowStockBadge: {
    backgroundColor: '#FEE2E2',
=======
    fontFamily: Inter.semibold,
    color: Brand.text,
    flexShrink: 1,
  },
  lowStockBadge: {
    backgroundColor: Brand.dangerBg,
>>>>>>> 8f32440 (Initial app update)
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lowStockText: {
    fontSize: 10,
<<<<<<< HEAD
    fontWeight: '600',
    color: '#DC2626',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
=======
    fontFamily: Inter.semibold,
    color: Brand.danger,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
>>>>>>> 8f32440 (Initial app update)
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  shareBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  shareBtnText: {
    fontSize: 14,
  },

  // States
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
=======
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: Inter.semibold,
    color: Brand.primary,
  },
  shareBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
>>>>>>> 8f32440 (Initial app update)
  },
});
