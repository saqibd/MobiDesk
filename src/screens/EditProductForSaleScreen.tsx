// src/screens/EditProductForSaleScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateProduct } from '../services/productService';
import type { ProductWithId } from '../types/product';
import {
  setSelectedProductState,
} from '../state/saleSelectionStore';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EditProductForSale'>;
type RouteProps = RouteProp<RootStackParamList, 'EditProductForSale'>;

const CONDITIONS = ['new', 'used', '10/10'] as const;

export default function EditProductForSaleScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price ?? ''));
  const [stock, setStock] = useState(String(product.stock ?? ''));
  const [brand, setBrand] = useState(product.brand ?? '');
  const [condition, setCondition] = useState<string>(product.condition ?? '');
  const [notes, setNotes] = useState(product.notes ?? '');
  const [saving, setSaving] = useState(false);

  const withTimeout = <T,>(p: Promise<T>, ms = 5000): Promise<T> =>
    Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

  const onSelectForSale = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Product name is required.');
      return;
    }
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!price.trim() || isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Validation', 'Please enter a valid price.');
      return;
    }
    if (!stock.trim() || isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Validation', 'Please enter a valid stock quantity.');
      return;
    }

    setSaving(true);

    const updates: Partial<ProductWithId> = {
      name: name.trim(),
      price: priceNum,
      stock: stockNum,
    };
    if (brand.trim()) updates.brand = brand.trim();
    if (condition) updates.condition = condition as any;
    if (notes.trim()) updates.notes = notes.trim();

    // Save to Firebase (best-effort, don't block navigation on failure)
    withTimeout(updateProduct(product.id, updates)).catch(e =>
      console.warn('Product save skipped (offline or timeout):', e?.message)
    );

    // Select the product and navigate immediately.
    // Spread the full original product so all fields (brand, model, serial, etc.)
    // are preserved on the receipt — only override what was edited in this screen.
    setSelectedProductState({
      ...product,
      name: name.trim(),
      price: priceNum,
      stock: stockNum,
      brand: brand.trim() || product.brand,
      condition: (condition as any) || product.condition,
      notes: notes.trim() || product.notes,
    });

    setSaving(false);
    navigation.navigate('Sales');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit & Select Product</Text>
      <Text style={styles.subtitle}>
        Update the details below, then tap "Select for Sale".
      </Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Product name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Selling Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Stock Quantity *</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <Text style={styles.label}>Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand (optional)"
        value={brand}
        onChangeText={setBrand}
      />

      <Text style={styles.label}>Condition</Text>
      <View style={styles.chipRow}>
        {CONDITIONS.map(c => {
          const isSelected = condition === c;
          return (
            <TouchableOpacity
              key={c}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setCondition(isSelected ? '' : c)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 72 }]}
        placeholder="Notes (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
        onPress={onSelectForSale}
        disabled={saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? 'Saving...' : 'Select for Sale'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Back to Product List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: '#16a34a',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
});
