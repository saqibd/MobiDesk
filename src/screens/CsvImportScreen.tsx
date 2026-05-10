// src/screens/CsvImportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { pickAndParseCsv } from '../utils/csv';
import {
  getProducts,
  addProduct,
  updateProduct,
} from '../services/productService';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
} from '../services/customerService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CsvImport'>;
type RouteProps = RouteProp<RootStackParamList, 'CsvImport'>;

type ImportResult = {
  added: number;
  updated: number;
  failed: number;
  errors: string[];
};

type PreviewRow = Record<string, string>;

const PRODUCT_COLUMNS = [
  'name', 'price', 'stock', 'brand', 'modelNumber', 'serialNumber',
  'sku', 'category', 'condition', 'ptaStatus', 'ramMemory',
  'screenSize', 'purchasePrice', 'notes',
];

const CUSTOMER_COLUMNS = ['name', 'phone', 'city', 'email', 'notes'];

export default function CsvImportScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { type } = route.params;

  const isProduct = type === 'products';
  const label = isProduct ? 'Products' : 'Customers';
  const columns = isProduct ? PRODUCT_COLUMNS : CUSTOMER_COLUMNS;

  const [rows, setRows] = useState<PreviewRow[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const onPickFile = async () => {
    try {
      setResult(null);
      const data = await pickAndParseCsv<PreviewRow>();
      if (!data) return;
      if (data.length === 0) {
        Alert.alert('Empty file', 'The selected CSV file has no data rows.');
        return;
      }
      setRows(data);
    } catch (e: any) {
      console.error('CSV pick error', e);
      Alert.alert('Error', e?.message ?? 'Could not read the CSV file.');
    }
  };

  const onImport = async () => {
    if (!rows || rows.length === 0) return;

    setImporting(true);
    const res: ImportResult = { added: 0, updated: 0, failed: 0, errors: [] };

    try {
      if (isProduct) {
        const existing = await getProducts();

        for (const row of rows) {
          try {
            const name = row.name?.trim();
            if (!name) {
              res.failed++;
              res.errors.push(`Skipped row — missing name`);
              continue;
            }

            // Match by SKU first, then by name
            const match = existing.find(
              p =>
                (row.sku?.trim() && p.sku === row.sku.trim()) ||
                p.name.toLowerCase() === name.toLowerCase()
            );

            const payload: Record<string, any> = { name };
            if (row.price?.trim()) payload.price = Number(row.price);
            if (row.stock?.trim()) payload.stock = Number(row.stock);
            if (row.brand?.trim()) payload.brand = row.brand.trim();
            if (row.modelNumber?.trim()) payload.modelNumber = row.modelNumber.trim();
            if (row.serialNumber?.trim()) payload.serialNumber = row.serialNumber.trim();
            if (row.sku?.trim()) payload.sku = row.sku.trim();
            if (row.category?.trim()) payload.category = row.category.trim();
            if (row.condition?.trim()) payload.condition = row.condition.trim();
            if (row.ptaStatus?.trim()) payload.ptaStatus = row.ptaStatus.trim();
            if (row.ramMemory?.trim()) payload.ramMemory = row.ramMemory.trim();
            if (row.screenSize?.trim()) payload.screenSize = row.screenSize.trim();
            if (row.purchasePrice?.trim()) payload.purchasePrice = Number(row.purchasePrice);
            if (row.notes?.trim()) payload.notes = row.notes.trim();

            if (match?.id) {
              await updateProduct(match.id, payload);
              res.updated++;
            } else {
              await addProduct({
                name,
                price: Number(row.price) || 0,
                stock: Number(row.stock) || 0,
                ...payload,
              });
              res.added++;
            }
          } catch (rowErr: any) {
            res.failed++;
            res.errors.push(`Row "${row.name}": ${rowErr?.message ?? 'unknown error'}`);
          }
        }
      } else {
        const existing = await getCustomers();

        for (const row of rows) {
          try {
            const name = row.name?.trim();
            const phone = row.phone?.trim();

            if (!name) {
              res.failed++;
              res.errors.push(`Skipped row — missing name`);
              continue;
            }

            // Match by phone first, then by name
            const match = existing.find(
              c =>
                (phone && c.phone === phone) ||
                c.name.toLowerCase() === name.toLowerCase()
            );

            const payload: Record<string, any> = { name };
            if (phone) payload.phone = phone;
            if (row.city?.trim()) payload.city = row.city.trim();
            if (row.email?.trim()) payload.email = row.email.trim();
            if (row.notes?.trim()) payload.notes = row.notes.trim();

            if (match?.id) {
              await updateCustomer(match.id, payload);
              res.updated++;
            } else {
              if (!phone) {
                res.failed++;
                res.errors.push(`Row "${name}": phone is required to add a new customer`);
                continue;
              }
              await addCustomer({ name, phone, ...payload });
              res.added++;
            }
          } catch (rowErr: any) {
            res.failed++;
            res.errors.push(`Row "${row.name}": ${rowErr?.message ?? 'unknown error'}`);
          }
        }
      }
    } catch (e: any) {
      Alert.alert('Import failed', e?.message ?? 'An unexpected error occurred.');
    } finally {
      setImporting(false);
      setResult(res);
    }
  };

  const previewRows = rows ? rows.slice(0, 5) : [];
  const detectedColumns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Import {label} via CSV</Text>

      {/* Column format guide */}
      <View style={styles.guideBox}>
        <Text style={styles.guideTitle}>Expected CSV Columns</Text>
        <Text style={styles.guideText}>{columns.join(', ')}</Text>
        {isProduct && (
          <Text style={styles.guideNote}>
            Existing records are matched by SKU (if provided) or by name. Matching rows are updated; new names are added.
          </Text>
        )}
        {!isProduct && (
          <Text style={styles.guideNote}>
            Existing records are matched by phone number or name. Matching rows are updated; new entries are added.
          </Text>
        )}
      </View>

      {/* Pick file */}
      <TouchableOpacity style={styles.pickButton} onPress={onPickFile} disabled={importing}>
        <Text style={styles.pickButtonText}>
          {rows ? '📂 Choose a Different File' : '📂 Choose CSV File'}
        </Text>
      </TouchableOpacity>

      {/* Preview */}
      {rows && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            Preview — {rows.length} row{rows.length !== 1 ? 's' : ''} detected
          </Text>
          <Text style={styles.previewColumns}>
            Columns: {detectedColumns.join(', ')}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View>
              {/* Header row */}
              <View style={styles.tableRow}>
                {detectedColumns.map(col => (
                  <Text key={col} style={[styles.tableCell, styles.tableHeader]}>
                    {col}
                  </Text>
                ))}
              </View>
              {/* Data rows (first 5) */}
              {previewRows.map((row, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                  {detectedColumns.map(col => (
                    <Text key={col} style={styles.tableCell}>
                      {row[col] ?? ''}
                    </Text>
                  ))}
                </View>
              ))}
              {rows.length > 5 && (
                <Text style={styles.moreRows}>
                  … and {rows.length - 5} more row{rows.length - 5 !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Import button */}
          {!result && (
            <TouchableOpacity
              style={[styles.importButton, importing && styles.buttonDisabled]}
              onPress={onImport}
              disabled={importing}
            >
              {importing ? (
                <View style={styles.importingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.importButtonText}>  Importing…</Text>
                </View>
              ) : (
                <Text style={styles.importButtonText}>
                  Import {rows.length} Row{rows.length !== 1 ? 's' : ''}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Result */}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Import Complete</Text>
          <View style={styles.resultRow}>
            <Text style={[styles.resultStat, styles.statAdded]}>✅ Added: {result.added}</Text>
            <Text style={[styles.resultStat, styles.statUpdated]}>✏️ Updated: {result.updated}</Text>
            <Text style={[styles.resultStat, styles.statFailed]}>❌ Failed: {result.failed}</Text>
          </View>
          {result.errors.length > 0 && (
            <View style={styles.errorsBox}>
              <Text style={styles.errorsTitle}>Errors</Text>
              {result.errors.map((err, i) => (
                <Text key={i} style={styles.errorText}>• {err}</Text>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.importAgainButton} onPress={() => {
            setRows(null);
            setResult(null);
          }}>
            <Text style={styles.importAgainText}>Import Another File</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  guideBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 12,
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guideText: {
    fontSize: 12,
    color: '#1e3a8a',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  guideNote: {
    fontSize: 11,
    color: '#3b82f6',
    lineHeight: 16,
  },
  pickButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  previewSection: {
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewColumns: {
    fontSize: 11,
    color: '#666',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: '700',
    color: '#374151',
  },
  tableCell: {
    width: 110,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    color: '#1f2937',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  moreRows: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  importButton: {
    marginTop: 16,
    backgroundColor: '#16a34a',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  importingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 16,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  resultStat: {
    fontSize: 13,
    fontWeight: '600',
  },
  statAdded: { color: '#16a34a' },
  statUpdated: { color: '#2563eb' },
  statFailed: { color: '#dc2626' },
  errorsBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#7f1d1d',
    lineHeight: 18,
  },
  doneButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  importAgainButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  importAgainText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
});
