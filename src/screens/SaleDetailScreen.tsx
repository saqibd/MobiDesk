// src/screens/SaleDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { reprintSaleReceipt } from '../services/receiptService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'SaleDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'SaleDetail'>;

export default function SaleDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { sale } = route.params;
  const [reprinting, setReprinting] = useState(false);

  const saleDate = sale.createdAtMs ? new Date(sale.createdAtMs) : undefined;

  function formatDate(ms?: number) {
    if (!ms) return 'Unknown date';
    const d = new Date(ms);
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + '  ' + d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  }

  const unitPrice = sale.quantity && sale.quantity > 0
    ? (sale.total ?? 0) / sale.quantity
    : sale.total ?? 0;

  const onReprint = async () => {
    setReprinting(true);
    try {
      await reprintSaleReceipt({
        customerName: sale.customerName ?? 'Unknown Customer',
        customerPhone: sale.customerPhone,
        productName: sale.productName ?? 'Unknown Product',
        productId: sale.productId ?? '',
        price: unitPrice,
        saleDate,
      });
    } catch (e) {
      console.error('Reprint error', e);
      Alert.alert('Error', 'Could not reprint receipt.');
    } finally {
      setReprinting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sale Details</Text>
      <Text style={styles.date}>{formatDate(sale.createdAtMs)}</Text>

      {/* Customer */}
      <Text style={styles.sectionLabel}>CUSTOMER</Text>
      <View style={styles.card}>
        <Text style={styles.cardMain}>{sale.customerName ?? '—'}</Text>
        {!!sale.customerPhone && (
          <Text style={styles.cardSub}>{sale.customerPhone}</Text>
        )}
      </View>

      {/* Product */}
      <Text style={styles.sectionLabel}>PRODUCT</Text>
      <View style={styles.card}>
        <Text style={styles.cardMain}>{sale.productName ?? '—'}</Text>
      </View>

      {/* Financials */}
      <Text style={styles.sectionLabel}>SUMMARY</Text>
      <View style={styles.card}>
        <Row label="Unit Price" value={`Rs. ${unitPrice.toLocaleString('en-PK')}`} />
        <Divider />
        <Row label="Quantity" value={String(sale.quantity ?? 1)} />
        <Divider />
        <Row
          label="Total"
          value={`Rs. ${(sale.total ?? 0).toLocaleString('en-PK')}`}
          highlight
        />
      </View>

      {/* Reprint button */}
      <TouchableOpacity
        style={[styles.reprintBtn, reprinting && styles.btnDisabled]}
        onPress={onReprint}
        disabled={reprinting}
      >
        {reprinting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.reprintBtnText}>🖨  Reprint Invoice</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>← Back to History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  rowLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  rowValueHighlight: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  reprintBtn: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  reprintBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
