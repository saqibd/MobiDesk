// src/screens/AddProductScreen.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand } from '../constants/brand';
import { addProduct } from '../services/productService';
import { formStyles as fs } from '../styles/formStyles';
import {
  ProductCategory,
  ProductCondition,
  ProductFormValues,
  PtaStatus,
  formValuesToNewProduct,
} from '../types/product';

type AddProductScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddProduct'
>;

const emptyForm: ProductFormValues = {
  name: '',
  price: '',
  stock: '',
  sku: '',
  barcode: '',
  brand: '',
  modelNumber: '',
  serialNumber: '',
  category: '',
  condition: '',
  ptaStatus: '',
  ramMemory: '',
  screenSize: '',
  purchasePrice: '',
  notes: '',
};

const categories: ProductCategory[] = [
  'phone',
  'tablet',
  'accessory',
  'laptop',
  'other',
];

const conditions: ProductCondition[] = ['new', 'used', '10/10'];

const ptaStatuses: PtaStatus[] = ['approved', 'not_approved'];

export default function AddProductScreen() {
  const navigation = useNavigation<AddProductScreenNavProp>();
  const route = useRoute<any>();
  const [form, setForm] = useState<ProductFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const scanned = route.params?.scannedBarcode;
    if (scanned && typeof scanned === 'string') {
      setForm(prev => ({
        ...prev,
        barcode: scanned,
      }));
    }
  }, [route.params?.scannedBarcode]);

  const handleChange = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Name required', 'Please enter product name.');
      return;
    }

    if (!form.price.trim()) {
      Alert.alert('Price required', 'Please enter product price.');
      return;
    }

    if (!form.stock.trim()) {
      Alert.alert('Stock required', 'Please enter stock quantity.');
      return;
    }

    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);

    if (!priceNum || priceNum <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }

    if (!stockNum || stockNum < 0) {
      Alert.alert('Invalid stock', 'Please enter a valid stock quantity.');
      return;
    }

    try {
      setSaving(true);

      const newProduct = formValuesToNewProduct(form);
      await addProduct(newProduct);

      Alert.alert('Product added', 'The product has been saved.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);

      setForm(emptyForm);
    } catch (error) {
      console.error('Error adding product', error);
      Alert.alert(
        'Save failed',
        'Something went wrong while saving the product.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleScanBarcode = () => {
    navigation.navigate('ScanBarcode');
  };

  return (
    <SafeAreaView style={fs.safeArea}>
      <KeyboardAvoidingView
        style={fs.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={fs.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={fs.title}>Add product</Text>

          <Text style={fs.label}>Name *</Text>
          <TextInput
            style={fs.input}
            placeholder="Product name"
            placeholderTextColor={Brand.textSubtle}
            value={form.name}
            onChangeText={text => handleChange('name', text)}
          />

          <Text style={fs.label}>Price *</Text>
          <TextInput
            style={fs.input}
            placeholder="Selling price"
            placeholderTextColor={Brand.textSubtle}
            keyboardType="numeric"
            value={form.price}
            onChangeText={text => handleChange('price', text)}
          />

          <Text style={fs.label}>Stock *</Text>
          <TextInput
            style={fs.input}
            placeholder="Stock quantity"
            placeholderTextColor={Brand.textSubtle}
            keyboardType="numeric"
            value={form.stock}
            onChangeText={text => handleChange('stock', text)}
          />

          <Text style={fs.label}>Brand</Text>
          <TextInput
            style={fs.input}
            placeholder="Brand (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.brand}
            onChangeText={text => handleChange('brand', text)}
          />

          <Text style={fs.label}>Model number</Text>
          <TextInput
            style={fs.input}
            placeholder="Model number (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.modelNumber}
            onChangeText={text => handleChange('modelNumber', text)}
          />

          <Text style={fs.label}>Serial number</Text>
          <TextInput
            style={fs.input}
            placeholder="Serial number (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.serialNumber}
            onChangeText={text => handleChange('serialNumber', text)}
          />

          <Text style={fs.label}>SKU</Text>
          <TextInput
            style={fs.input}
            placeholder="SKU / code (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.sku}
            onChangeText={text => handleChange('sku', text)}
          />

          <Text style={fs.label}>Barcode</Text>
          <TextInput
            style={fs.input}
            placeholder="Barcode (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.barcode}
            onChangeText={text => handleChange('barcode', text)}
          />
          <TouchableOpacity style={fs.outlineButton} onPress={handleScanBarcode}>
            <MaterialIcons name="qr-code-scanner" size={18} color={Brand.primary} />
            <Text style={fs.outlineButtonText}>Scan barcode</Text>
          </TouchableOpacity>

          <Text style={fs.label}>RAM / memory</Text>
          <TextInput
            style={fs.input}
            placeholder="e.g. 8GB/128GB (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.ramMemory}
            onChangeText={text => handleChange('ramMemory', text)}
          />

          <Text style={fs.label}>Screen size</Text>
          <TextInput
            style={fs.input}
            placeholder="e.g. 6.5 inch (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.screenSize}
            onChangeText={text => handleChange('screenSize', text)}
          />

          <Text style={fs.label}>Purchase price</Text>
          <TextInput
            style={fs.input}
            placeholder="Your cost price (optional)"
            placeholderTextColor={Brand.textSubtle}
            keyboardType="numeric"
            value={form.purchasePrice}
            onChangeText={text => handleChange('purchasePrice', text)}
          />

          <Text style={fs.label}>Category</Text>
          <View style={fs.chipRow}>
            {categories.map(cat => {
              const isSelected = form.category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[fs.chip, isSelected && fs.chipSelected]}
                  onPress={() =>
                    handleChange(
                      'category',
                      isSelected ? '' : (cat as ProductCategory)
                    )
                  }
                >
                  <Text style={[fs.chipText, isSelected && fs.chipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={fs.label}>Condition</Text>
          <View style={fs.chipRow}>
            {conditions.map(cond => {
              const isSelected = form.condition === cond;
              return (
                <TouchableOpacity
                  key={cond}
                  style={[fs.chip, isSelected && fs.chipSelected]}
                  onPress={() =>
                    handleChange(
                      'condition',
                      isSelected ? '' : (cond as ProductCondition)
                    )
                  }
                >
                  <Text style={[fs.chipText, isSelected && fs.chipTextSelected]}>
                    {cond}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={fs.label}>PTA status</Text>
          <View style={fs.chipRow}>
            {ptaStatuses.map(status => {
              const isSelected = form.ptaStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[fs.chip, isSelected && fs.chipSelected]}
                  onPress={() =>
                    handleChange(
                      'ptaStatus',
                      isSelected ? '' : (status as PtaStatus)
                    )
                  }
                >
                  <Text style={[fs.chipText, isSelected && fs.chipTextSelected]}>
                    {status === 'not_approved' ? 'Not approved' : 'Approved'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={fs.label}>Notes</Text>
          <TextInput
            style={[fs.input, fs.notesInput]}
            placeholder="Any notes (optional)"
            placeholderTextColor={Brand.textSubtle}
            value={form.notes}
            onChangeText={text => handleChange('notes', text)}
            multiline
          />

          <TouchableOpacity
            style={[fs.primaryButton, saving && fs.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={fs.primaryButtonText}>
              {saving ? 'Saving…' : 'Save product'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
