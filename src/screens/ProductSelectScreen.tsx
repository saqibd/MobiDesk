// src/screens/ProductSelectScreen.tsx
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

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ProductSelect'>;

export default function ProductSelectScreen() {
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
      console.error('Error loading products in selector', e);
      Alert.alert('Error', 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onTapProduct = (product: Product) => {
    navigation.navigate('EditProductForSale', { product });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? '').toLowerCase().includes(term) ||
        (p.sku ?? '').toLowerCase().includes(term)
    );
  }, [search, products]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, brand or SKU"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoFocus={false}
        />
      </View>

      <Text style={styles.hint}>
        Tap a product to review and edit its details before adding it to the sale.
      </Text>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>Loading products…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          {products.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>No products yet.</Text>
              <Text style={styles.emptyHint}>
                Add products from the Inventory screen first.
              </Text>
            </>
          ) : (
            <Text style={styles.emptyTitle}>No products match your search.</Text>
          )}
        </View>
      ) : (
        filtered.map(p => (
          <TouchableOpacity
            key={p.id}
            style={styles.item}
            onPress={() => onTapProduct(p)}
            activeOpacity={0.75}
          >
            <View style={styles.itemRow}>
              <View style={styles.itemAvatar}>
                <Text style={styles.itemAvatarText}>
                  {p.name.trim().charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.itemSub} numberOfLines={1}>
                  Rs. {p.price} • Stock: {p.stock}
                  {p.brand ? ` • ${p.brand}` : ''}
                  {p.condition ? ` • ${p.condition}` : ''}
                </Text>
              </View>

              <Text style={styles.selectHint}>Select →</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
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
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },

  hint: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },

  // Product row
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 12,
    color: '#64748B',
  },
  selectHint: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
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
  },
});
