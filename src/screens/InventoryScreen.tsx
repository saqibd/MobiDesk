// src/screens/InventoryScreen.tsx
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
<MaterialIcons name="share" size={18} color={Brand.primary} />
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
<MaterialIcons
          name="keyboard-arrow-down"
          size={22}
          color={Brand.primary}
          style={!open ? styles.groupChevronClosed : undefined}
        />
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
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

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
group: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
backgroundColor: Brand.borderLight,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  groupBrand: {
    fontSize: 15,
fontFamily: Inter.bold,
    color: Brand.text,
  },
  groupBadge: {
    backgroundColor: Brand.border,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  groupBadgeText: {
    fontSize: 11,
fontFamily: Inter.semibold,
    color: Brand.textMuted,
  },
  groupChevronClosed: {
    transform: [{ rotate: '-90deg' }],
  },
  groupDivider: {
    height: 1,
backgroundColor: Brand.border,
  },
  groupItems: {
    padding: 10,
    gap: 8,
  },
card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 15,
fontFamily: Inter.bold,
    color: Brand.primary,
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
fontFamily: Inter.semibold,
    color: Brand.text,
    flexShrink: 1,
  },
  lowStockBadge: {
    backgroundColor: Brand.dangerBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lowStockText: {
    fontSize: 10,
fontFamily: Inter.semibold,
    color: Brand.danger,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
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
  },
});
