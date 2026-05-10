// src/screens/ReviewOrderScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  getSelectedCustomerState,
  getSelectedProductState,
  resetSaleSelection,
} from '../state/saleSelectionStore';
import { generateAndShareReceipt } from '../services/receiptService';
import type { ProductWithId } from '../types/product';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ReviewOrder'>;

const ReviewOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [busy, setBusy] = useState(false);

  const customer = getSelectedCustomerState();
  const product = getSelectedProductState();

  if (!customer || !product) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>Review Order</Text>
        <Text style={styles.warningText}>
          Please select both customer and product from Sales screen first.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Sales')}
        >
          <Text style={styles.primaryButtonText}>Back to Sales</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cast to ProductWithId — the saleSelectionStore stores the full product object.
  const fullProduct = product as ProductWithId;

  const finishAndReset = () => {
    resetSaleSelection();
    navigation.navigate('Sales');
  };

  // ── Confirm + send PDF receipt ──────────────────────────────────────────────
  const onConfirmOrder = async () => {
    setBusy(true);
    try {
      const invoiceNo = await generateAndShareReceipt(
        {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          email: customer.email,
        },
        fullProduct
      );
      // After share/print dialog closes, wrap up the sale
      if (Platform.OS === 'web') {
        finishAndReset();
      } else {
        Alert.alert(
          'Order Confirmed',
          `Invoice ${invoiceNo} has been generated.`,
          [{ text: 'Done', onPress: finishAndReset }]
        );
      }
    } catch (e) {
      console.error('Receipt error', e);
      Alert.alert('Error', 'Could not generate receipt. Order is still confirmed.');
      finishAndReset();
    } finally {
      setBusy(false);
    }
  };

  // ── Confirm + WhatsApp + PDF receipt ───────────────────────────────────────
  const onConfirmOrderAndWhatsApp = async () => {
    let phone = customer.phone?.replace(/\s+/g, '') || '';
    if (!phone) {
      Alert.alert(
        'Phone required',
        'Selected customer has no phone number to send a WhatsApp message.'
      );
      return;
    }

    if (phone.startsWith('0')) {
      phone = `+92${phone.slice(1)}`;
    }

    const price =
      typeof fullProduct.price === 'number'
        ? fullProduct.price
        : parseFloat(String(fullProduct.price)) || 0;

    const message = `Assalam o Alaikum ${customer.name},

Aap ki sale ka detail:

Product: ${fullProduct.name}${fullProduct.brand ? ` (${fullProduct.brand})` : ''}${fullProduct.modelNumber ? ` - ${fullProduct.modelNumber}` : ''}
Price: Rs. ${price.toLocaleString('en-PK')}
Stock remaining: ${fullProduct.stock}

Shukriya aur dobara tashreef laiye!
— ${require('../constants/companyInfo').COMPANY.name}`;

    const appUrl = `whatsapp://send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${encodeURIComponent(phone.replace('+', ''))}?text=${encodeURIComponent(message)}`;

    setBusy(true);
    try {
      // Open WhatsApp first
      if (Platform.OS === 'web') {
        window.open(webUrl, '_blank');
      } else {
        const canOpenApp = await Linking.canOpenURL(appUrl);
        if (canOpenApp) {
          await Linking.openURL(appUrl);
        } else {
          const canOpenWeb = await Linking.canOpenURL(webUrl);
          if (canOpenWeb) await Linking.openURL(webUrl);
        }
      }

      // Then generate and share PDF receipt
      const invoiceNo = await generateAndShareReceipt(
        {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          email: customer.email,
        },
        fullProduct
      );

      if (Platform.OS === 'web') {
        finishAndReset();
      } else {
        Alert.alert(
          'Order Confirmed',
          `Invoice ${invoiceNo} has been generated and WhatsApp opened.`,
          [{ text: 'Done', onPress: finishAndReset }]
        );
      }
    } catch (e) {
      console.error('Error in confirm+WhatsApp', e);
      Alert.alert('Error', 'Something went wrong. Order is still confirmed.');
      finishAndReset();
    } finally {
      setBusy(false);
    }
  };

  // ── Cancel order ───────────────────────────────────────────────────────────
  const onCancelOrder = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Cancel this order? This will clear the selected customer and product.'
      );
      if (confirmed) finishAndReset();
    } else {
      Alert.alert(
        'Cancel Order',
        'This will clear the selected customer and product. Continue?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, cancel',
            style: 'destructive',
            onPress: finishAndReset,
          },
        ]
      );
    }
  };

  const price =
    typeof fullProduct.price === 'number'
      ? fullProduct.price
      : parseFloat(String(fullProduct.price)) || 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review Order</Text>
      <Text style={styles.subtitle}>
        Review the details below before confirming.
      </Text>

      {/* Customer */}
      <Text style={styles.sectionTitle}>Customer</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{customer.name}</Text>
        {!!customer.phone && (
          <Text style={styles.cardSub}>{customer.phone}</Text>
        )}
      </View>

      {/* Product */}
      <Text style={styles.sectionTitle}>Product</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{fullProduct.name}</Text>
        {!!fullProduct.brand && (
          <Text style={styles.cardSub}>Brand: {fullProduct.brand}</Text>
        )}
        {!!fullProduct.modelNumber && (
          <Text style={styles.cardSub}>Model: {fullProduct.modelNumber}</Text>
        )}
        {!!fullProduct.condition && (
          <Text style={styles.cardSub}>Condition: {fullProduct.condition}</Text>
        )}
        {!!fullProduct.ramMemory && (
          <Text style={styles.cardSub}>RAM/Storage: {fullProduct.ramMemory}</Text>
        )}
        {!!fullProduct.screenSize && (
          <Text style={styles.cardSub}>Screen: {fullProduct.screenSize}</Text>
        )}
        {!!fullProduct.ptaStatus && (
          <Text style={styles.cardSub}>
            PTA: {fullProduct.ptaStatus === 'approved' ? 'Approved' : 'Not Approved'}
          </Text>
        )}
        {!!fullProduct.serialNumber && (
          <Text style={styles.cardSub}>Serial: {fullProduct.serialNumber}</Text>
        )}
      </View>

      {/* Summary */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {customer.name}{customer.phone ? ` · ${customer.phone}` : ''}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {fullProduct.name}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price</Text>
          <Text style={[styles.summaryValue, styles.summaryPrice]}>
            Rs. {price.toLocaleString('en-PK')}
          </Text>
        </View>
      </View>

      <Text style={styles.receiptNote}>
        📄 A PDF receipt will be generated automatically when you confirm.
      </Text>

      {/* Confirm Order */}
      <TouchableOpacity
        style={[styles.primaryButton, busy && styles.buttonDisabled]}
        onPress={onConfirmOrder}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>✓ Confirm Order &amp; Send Receipt</Text>
        )}
      </TouchableOpacity>

      {/* Confirm + WhatsApp */}
      <TouchableOpacity
        style={[styles.whatsAppButton, busy && styles.buttonDisabled]}
        onPress={onConfirmOrderAndWhatsApp}
        disabled={busy}
      >
        <Text style={styles.primaryButtonText}>Confirm Order + WhatsApp + Receipt</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        style={[styles.cancelButton, busy && styles.buttonDisabled]}
        onPress={onCancelOrder}
        disabled={busy}
      >
        <Text style={styles.cancelButtonText}>Cancel Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReviewOrderScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#B91C1C',
    marginVertical: 12,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  summaryPrice: {
    color: '#16A34A',
    fontSize: 15,
  },

  receiptNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },

  primaryButton: {
    marginTop: 12,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  whatsAppButton: {
    marginTop: 10,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
