// src/screens/ShareProductScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateProduct } from '../services/productService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ShareProduct'>;
type RouteProps = RouteProp<RootStackParamList, 'ShareProduct'>;

const CONDITIONS = ['new', 'used', '10/10'] as const;

function buildWhatsAppMessage(fields: {
  name: string;
  price: string;
  stock: string;
  brand: string;
  condition: string;
  ramMemory: string;
  screenSize: string;
  notes: string;
}): string {
  const lines: string[] = [];
  lines.push(`*${fields.name.trim()}*`);
  if (fields.brand.trim()) lines.push(`Brand: ${fields.brand.trim()}`);
  if (fields.condition) lines.push(`Condition: ${fields.condition}`);
  if (fields.ramMemory.trim()) lines.push(`RAM/Memory: ${fields.ramMemory.trim()}`);
  if (fields.screenSize.trim()) lines.push(`Screen Size: ${fields.screenSize.trim()}`);
  if (fields.price.trim()) lines.push(`Price: PKR ${fields.price.trim()}`);
  if (fields.stock.trim()) lines.push(`Stock Available: ${fields.stock.trim()}`);
  if (fields.notes.trim()) lines.push(`Notes: ${fields.notes.trim()}`);
  return lines.join('\n');
}

export default function ShareProductScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price ?? ''));
  const [stock, setStock] = useState(String(product.stock ?? ''));
  const [brand, setBrand] = useState(product.brand ?? '');
  const [condition, setCondition] = useState<string>(product.condition ?? '');
  const [ramMemory, setRamMemory] = useState(product.ramMemory ?? '');
  const [screenSize, setScreenSize] = useState(product.screenSize ?? '');
  const [notes, setNotes] = useState(product.notes ?? '');
  const [saving, setSaving] = useState(false);

  const message = buildWhatsAppMessage({
    name,
    price,
    stock,
    brand,
    condition,
    ramMemory,
    screenSize,
    notes,
  });

  const withTimeout = <T,>(p: Promise<T>, ms = 5000): Promise<T> =>
    Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

  const onSaveAndShare = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Product name is required.');
      return;
    }

    setSaving(true);

    const updates: Record<string, any> = {
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
    };
    if (brand.trim()) updates.brand = brand.trim();
    if (condition) updates.condition = condition;
    if (ramMemory.trim()) updates.ramMemory = ramMemory.trim();
    if (screenSize.trim()) updates.screenSize = screenSize.trim();
    if (notes.trim()) updates.notes = notes.trim();

    // Save to Firebase best-effort — don't block sharing on it
    withTimeout(updateProduct(product.id, updates)).catch(e =>
      console.warn('Product save skipped (offline or timeout):', e?.message)
    );

    try {
      const encoded = encodeURIComponent(message);
      const appUrl = `whatsapp://send?text=${encoded}`;
      const webUrl = `https://wa.me/?text=${encoded}`;

      if (Platform.OS === 'web') {
        // On iOS/Android browsers, opening a custom scheme (whatsapp://) always
        // navigates the current tab away — cancelling leaves a blank page.
        // Opening an https:// URL with _blank correctly opens a new tab,
        // so the app stays alive no matter what the user does.
        window.open(webUrl, '_blank');
      } else {
        // Native app: deep-link directly into WhatsApp, fall back to wa.me
        try {
          await Linking.openURL(appUrl);
        } catch (_) {
          await Linking.openURL(webUrl);
        }
      }
    } catch (e) {
      console.error('Error opening WhatsApp', e);
      Alert.alert('Could not open WhatsApp', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Share Product on WhatsApp</Text>
      <Text style={styles.subtitle}>
        Edit the details below. The message preview updates as you type.
      </Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Product name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Stock Available</Text>
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

      <Text style={styles.label}>RAM / Memory</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 8GB/128GB"
        value={ramMemory}
        onChangeText={setRamMemory}
      />

      <Text style={styles.label}>Screen Size</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 6.5 inch"
        value={screenSize}
        onChangeText={setScreenSize}
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
        placeholder="e.g. PTA approved (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* Message Preview */}
      <View style={styles.previewBox}>
        <Text style={styles.previewLabel}>Message Preview</Text>
        <Text style={styles.previewText}>{message || '—'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.whatsappButton, saving && styles.buttonDisabled]}
        onPress={onSaveAndShare}
        disabled={saving}
      >
        <Text style={styles.whatsappButtonText}>
          {saving ? 'Opening...' : '📲 Save & Share on WhatsApp'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Back to Inventory</Text>
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
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  previewBox: {
    marginTop: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 12,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewText: {
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 20,
  },
  whatsappButton: {
    marginTop: 16,
    backgroundColor: '#25D366',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  whatsappButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
