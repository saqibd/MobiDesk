// src/screens/EditProductScreen.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand } from '../constants/brand';
import { updateProduct } from '../services/productService';
import { formStyles as fs } from '../styles/formStyles';
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
style={fs.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={fs.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={fs.title}>Edit product</Text>

        <Text style={fs.sectionLabel}>Basic info</Text>

        <Text style={fs.label}>Name *</Text>
        <TextInput
          style={fs.input}
          placeholder="Product name"
          placeholderTextColor={Brand.textSubtle}
          value={form.name}
          onChangeText={t => handleChange('name', t)}
        />

<Text style={fs.label}>Selling price *</Text>
        <TextInput
          style={fs.input}
          placeholder="e.g. 25000"
          placeholderTextColor={Brand.textSubtle}
          keyboardType="numeric"
          value={form.price}
          onChangeText={t => handleChange('price', t)}
        />

<Text style={fs.label}>Stock *</Text>
        <TextInput
          style={fs.input}
          placeholder="Quantity on hand"
          placeholderTextColor={Brand.textSubtle}
          keyboardType="numeric"
          value={form.stock}
          onChangeText={t => handleChange('stock', t)}
        />

<Text style={fs.sectionLabel}>Brand & identifiers</Text>

        <Text style={fs.label}>Brand</Text>
        <TextInput
          style={fs.input}
          placeholder="e.g. Apple, Samsung"
          placeholderTextColor={Brand.textSubtle}
          value={form.brand}
          onChangeText={t => handleChange('brand', t)}
        />

<Text style={fs.label}>Model number</Text>
        <TextInput
          style={fs.input}
          placeholder="Model number (optional)"
          placeholderTextColor={Brand.textSubtle}
          value={form.modelNumber}
          onChangeText={t => handleChange('modelNumber', t)}
        />

<Text style={fs.label}>Serial number</Text>
        <TextInput
          style={fs.input}
          placeholder="Serial number (optional)"
          placeholderTextColor={Brand.textSubtle}
          value={form.serialNumber}
          onChangeText={t => handleChange('serialNumber', t)}
        />

<Text style={fs.label}>SKU</Text>
        <TextInput
          style={fs.input}
          placeholder="SKU / code (optional)"
          placeholderTextColor={Brand.textSubtle}
          value={form.sku}
          onChangeText={t => handleChange('sku', t)}
        />

<Text style={fs.label}>Barcode</Text>
        <TextInput
          style={fs.input}
          placeholder="Barcode (optional)"
          placeholderTextColor={Brand.textSubtle}
          value={form.barcode}
          onChangeText={t => handleChange('barcode', t)}
        />

<Text style={fs.sectionLabel}>Specs</Text>

        <Text style={fs.label}>RAM / memory</Text>
        <TextInput
          style={fs.input}
          placeholder="e.g. 8GB/128GB"
          placeholderTextColor={Brand.textSubtle}
          value={form.ramMemory}
          onChangeText={t => handleChange('ramMemory', t)}
        />

<Text style={fs.label}>Screen size</Text>
        <TextInput
          style={fs.input}
          placeholder="e.g. 6.5 inch"
          placeholderTextColor={Brand.textSubtle}
          value={form.screenSize}
          onChangeText={t => handleChange('screenSize', t)}
        />

<Text style={fs.label}>Purchase price</Text>
        <TextInput
          style={fs.input}
          placeholder="Your cost price (optional)"
          placeholderTextColor={Brand.textSubtle}
          keyboardType="numeric"
          value={form.purchasePrice}
          onChangeText={t => handleChange('purchasePrice', t)}
        />

<Text style={fs.sectionLabel}>Category</Text>
        <View style={fs.chipRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[fs.chip, form.category === cat && fs.chipSelected]}
              onPress={() => handleChange('category', form.category === cat ? '' : cat)}
            >
              <Text style={[fs.chipText, form.category === cat && fs.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

<Text style={fs.sectionLabel}>Condition</Text>
        <View style={fs.chipRow}>
          {CONDITIONS.map(cond => (
            <TouchableOpacity
              key={cond}
              style={[fs.chip, form.condition === cond && fs.chipSelected]}
              onPress={() => handleChange('condition', form.condition === cond ? '' : cond)}
            >
              <Text style={[fs.chipText, form.condition === cond && fs.chipTextSelected]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

<Text style={fs.sectionLabel}>PTA status</Text>
        <View style={fs.chipRow}>
          {PTA_STATUSES.map(status => (
            <TouchableOpacity
              key={status}
              style={[fs.chip, form.ptaStatus === status && fs.chipSelected]}
              onPress={() => handleChange('ptaStatus', form.ptaStatus === status ? '' : status)}
            >
              <Text style={[fs.chipText, form.ptaStatus === status && fs.chipTextSelected]}>
                {status === 'not_approved' ? 'Not approved' : 'Approved'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

<Text style={fs.sectionLabel}>Notes</Text>
        <TextInput
          style={[fs.input, fs.notesInput]}
          placeholder="Any notes (optional)"
          placeholderTextColor={Brand.textSubtle}
          multiline
          value={form.notes}
          onChangeText={t => handleChange('notes', t)}
        />

        <TouchableOpacity
style={[fs.primaryButton, saving && fs.primaryButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={fs.primaryButtonText}>
            {saving ? 'Saving…' : 'Save changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

