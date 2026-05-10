// src/screens/EditProductScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateProduct } from '../services/productService';
import {
  ProductFormValues,
  ProductCategory,
  ProductCondition,
  PtaStatus,
  formValuesToNewProduct,
  type ProductWithId,
} from '../types/product';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EditProduct'>;
type RouteProps = RouteProp<RootStackParamList, 'EditProduct'>;

const CATEGORIES: ProductCategory[] = ['phone', 'tablet', 'accessory', 'laptop', 'other'];
const CONDITIONS: ProductCondition[] = ['new', 'used', '10/10'];
const PTA_STATUSES: PtaStatus[] = ['approved', 'not_approved'];

function productToForm(p: ProductWithId): ProductFormValues {
  return {
    name: p.name ?? '',
    price: p.price != null ? String(p.price) : '',
    stock: p.stock != null ? String(p.stock) : '',
    sku: p.sku ?? '',
    barcode: p.barcode ?? '',
    brand: p.brand ?? '',
    modelNumber: p.modelNumber ?? '',
    serialNumber: p.serialNumber ?? '',
    category: p.category ?? '',
    condition: p.condition ?? '',
    ptaStatus: p.ptaStatus ?? '',
    ramMemory: p.ramMemory ?? '',
    screenSize: p.screenSize ?? '',
    purchasePrice: p.purchasePrice != null ? String(p.purchasePrice) : '',
    notes: p.notes ?? '',
  };
}

export default function EditProductScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;

  const [form, setForm] = useState<ProductFormValues>(productToForm(product));
  const [saving, setSaving] = useState(false);

  const handleChange = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Name required', 'Please enter a product name.');
      return;
    }
    if (!form.price.trim() || Number(form.price) <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }
    if (!form.stock.trim() || Number(form.stock) < 0) {
      Alert.alert('Invalid stock', 'Please enter a valid stock quantity.');
      return;
    }

    try {
      setSaving(true);
      const updates = formValuesToNewProduct(form);
      await updateProduct(product.id, updates);

      if (Platform.OS === 'web') {
        navigation.goBack();
        Alert.alert('Saved', 'Product updated successfully.');
      } else {
        Alert.alert('Saved', 'Product updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      console.error('Error updating product', e);
      Alert.alert('Error', 'Could not update product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Product</Text>

        {/* Required fields */}
        <Text style={styles.sectionLabel}>Basic Info</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Product name"
          value={form.name}
          onChangeText={t => handleChange('name', t)}
        />

        <Text style={styles.label}>Selling Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25000"
          keyboardType="numeric"
          value={form.price}
          onChangeText={t => handleChange('price', t)}
        />

        <Text style={styles.label}>Stock *</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity on hand"
          keyboardType="numeric"
          value={form.stock}
          onChangeText={t => handleChange('stock', t)}
        />

        {/* Brand & identifiers */}
        <Text style={styles.sectionLabel}>Brand & Identifiers</Text>

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Apple, Samsung"
          value={form.brand}
          onChangeText={t => handleChange('brand', t)}
        />

        <Text style={styles.label}>Model Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Model number (optional)"
          value={form.modelNumber}
          onChangeText={t => handleChange('modelNumber', t)}
        />

        <Text style={styles.label}>Serial Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Serial number (optional)"
          value={form.serialNumber}
          onChangeText={t => handleChange('serialNumber', t)}
        />

        <Text style={styles.label}>SKU</Text>
        <TextInput
          style={styles.input}
          placeholder="SKU / code (optional)"
          value={form.sku}
          onChangeText={t => handleChange('sku', t)}
        />

        <Text style={styles.label}>Barcode</Text>
        <TextInput
          style={styles.input}
          placeholder="Barcode (optional)"
          value={form.barcode}
          onChangeText={t => handleChange('barcode', t)}
        />

        {/* Specs */}
        <Text style={styles.sectionLabel}>Specs</Text>

        <Text style={styles.label}>RAM / Memory</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8GB/128GB"
          value={form.ramMemory}
          onChangeText={t => handleChange('ramMemory', t)}
        />

        <Text style={styles.label}>Screen Size</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 6.5 inch"
          value={form.screenSize}
          onChangeText={t => handleChange('screenSize', t)}
        />

        <Text style={styles.label}>Purchase Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Your cost price (optional)"
          keyboardType="numeric"
          value={form.purchasePrice}
          onChangeText={t => handleChange('purchasePrice', t)}
        />

        {/* Category chips */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, form.category === cat && styles.chipSelected]}
              onPress={() => handleChange('category', form.category === cat ? '' : cat)}
            >
              <Text style={[styles.chipText, form.category === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condition chips */}
        <Text style={styles.sectionLabel}>Condition</Text>
        <View style={styles.chipRow}>
          {CONDITIONS.map(cond => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, form.condition === cond && styles.chipSelected]}
              onPress={() => handleChange('condition', form.condition === cond ? '' : cond)}
            >
              <Text style={[styles.chipText, form.condition === cond && styles.chipTextSelected]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PTA Status chips */}
        <Text style={styles.sectionLabel}>PTA Status</Text>
        <View style={styles.chipRow}>
          {PTA_STATUSES.map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.chip, form.ptaStatus === status && styles.chipSelected]}
              onPress={() => handleChange('ptaStatus', form.ptaStatus === status ? '' : status)}
            >
              <Text style={[styles.chipText, form.ptaStatus === status && styles.chipTextSelected]}>
                {status === 'not_approved' ? 'Not Approved' : 'Approved'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.sectionLabel}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any notes (optional)"
          multiline
          value={form.notes}
          onChangeText={t => handleChange('notes', t)}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8FAFC' },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  notesInput: {
    height: 88,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
