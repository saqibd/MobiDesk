// src/screens/ReviewOrderScreen.tsx
<<<<<<< HEAD
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
=======
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { resetToSalesScreen } from '../navigation/salesNavigation';
import { Brand, Inter } from '../constants/brand';
import { COMPANY } from '../constants/companyInfo';
import { generateAndShareReceipt } from '../services/receiptService';
>>>>>>> 8f32440 (Initial app update)
import {
  getSelectedCustomerState,
  getSelectedProductState,
  resetSaleSelection,
} from '../state/saleSelectionStore';
<<<<<<< HEAD
import { generateAndShareReceipt } from '../services/receiptService';
=======
import { formStyles as form } from '../styles/formStyles';
import { screenStyles as shared } from '../styles/screenStyles';
>>>>>>> 8f32440 (Initial app update)
import type { ProductWithId } from '../types/product';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ReviewOrder'>;

const ReviewOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [busy, setBusy] = useState(false);

  const customer = getSelectedCustomerState();
  const product = getSelectedProductState();

  if (!customer || !product) {
    return (
<<<<<<< HEAD
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
=======
      <View style={[form.container, styles.centered]}>
        <MaterialIcons name="warning" size={40} color={Brand.warning} style={{ marginBottom: 12 }} />
        <Text style={shared.title}>Review order</Text>
        <Text style={styles.warningText}>
          Please select both customer and product from the Sales screen first.
        </Text>
        <TouchableOpacity
          style={form.primaryButton}
          onPress={() => navigation.navigate('Sales')}
        >
          <Text style={form.primaryButtonText}>Back to sales</Text>
>>>>>>> 8f32440 (Initial app update)
        </TouchableOpacity>
      </View>
    );
  }

<<<<<<< HEAD
  // Cast to ProductWithId — the saleSelectionStore stores the full product object.
=======
>>>>>>> 8f32440 (Initial app update)
  const fullProduct = product as ProductWithId;

  const finishAndReset = () => {
    resetSaleSelection();
<<<<<<< HEAD
    navigation.navigate('Sales');
  };

  // ── Confirm + send PDF receipt ──────────────────────────────────────────────
=======
    resetToSalesScreen(navigation);
  };

>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
      // After share/print dialog closes, wrap up the sale
=======
>>>>>>> 8f32440 (Initial app update)
      if (Platform.OS === 'web') {
        finishAndReset();
      } else {
        Alert.alert(
<<<<<<< HEAD
          'Order Confirmed',
=======
          'Order confirmed',
>>>>>>> 8f32440 (Initial app update)
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

<<<<<<< HEAD
  // ── Confirm + WhatsApp + PDF receipt ───────────────────────────────────────
=======
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
— ${require('../constants/companyInfo').COMPANY.name}`;
=======
— ${COMPANY.name}`;
>>>>>>> 8f32440 (Initial app update)

    const appUrl = `whatsapp://send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${encodeURIComponent(phone.replace('+', ''))}?text=${encodeURIComponent(message)}`;

    setBusy(true);
    try {
<<<<<<< HEAD
      // Open WhatsApp first
=======
>>>>>>> 8f32440 (Initial app update)
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

<<<<<<< HEAD
      // Then generate and share PDF receipt
=======
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
          'Order Confirmed',
=======
          'Order confirmed',
>>>>>>> 8f32440 (Initial app update)
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

<<<<<<< HEAD
  // ── Cancel order ───────────────────────────────────────────────────────────
=======
>>>>>>> 8f32440 (Initial app update)
  const onCancelOrder = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Cancel this order? This will clear the selected customer and product.'
      );
      if (confirmed) finishAndReset();
    } else {
      Alert.alert(
<<<<<<< HEAD
        'Cancel Order',
=======
        'Cancel order',
>>>>>>> 8f32440 (Initial app update)
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
<<<<<<< HEAD
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
=======
    <ScrollView contentContainerStyle={form.container}>
      <Text style={shared.title}>Review order</Text>
      <Text style={shared.subtitle}>Review the details below before confirming.</Text>

      <Text style={form.sectionLabel}>Customer</Text>
      <View style={form.card}>
        <Text style={form.cardTitle}>{customer.name}</Text>
        {!!customer.phone && <Text style={form.cardSub}>{customer.phone}</Text>}
      </View>

      <Text style={form.sectionLabel}>Product</Text>
      <View style={form.card}>
        <Text style={form.cardTitle}>{fullProduct.name}</Text>
        {!!fullProduct.brand && <Text style={form.cardSub}>Brand: {fullProduct.brand}</Text>}
        {!!fullProduct.modelNumber && <Text style={form.cardSub}>Model: {fullProduct.modelNumber}</Text>}
        {!!fullProduct.condition && <Text style={form.cardSub}>Condition: {fullProduct.condition}</Text>}
        {!!fullProduct.ramMemory && <Text style={form.cardSub}>RAM/Storage: {fullProduct.ramMemory}</Text>}
        {!!fullProduct.screenSize && <Text style={form.cardSub}>Screen: {fullProduct.screenSize}</Text>}
        {!!fullProduct.ptaStatus && (
          <Text style={form.cardSub}>
            PTA: {fullProduct.ptaStatus === 'approved' ? 'Approved' : 'Not approved'}
          </Text>
        )}
        {!!fullProduct.serialNumber && <Text style={form.cardSub}>Serial: {fullProduct.serialNumber}</Text>}
      </View>

      <Text style={form.sectionLabel}>Summary</Text>
      <View style={form.card}>
>>>>>>> 8f32440 (Initial app update)
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {customer.name}{customer.phone ? ` · ${customer.phone}` : ''}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product</Text>
<<<<<<< HEAD
          <Text style={styles.summaryValue} numberOfLines={1}>
            {fullProduct.name}
          </Text>
=======
          <Text style={styles.summaryValue} numberOfLines={1}>{fullProduct.name}</Text>
>>>>>>> 8f32440 (Initial app update)
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price</Text>
<<<<<<< HEAD
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
=======
          <Text style={styles.summaryPrice}>Rs. {price.toLocaleString('en-PK')}</Text>
        </View>
      </View>

      <View style={styles.receiptNote}>
        <MaterialIcons name="description" size={16} color={Brand.textMuted} />
        <Text style={styles.receiptNoteText}>A PDF receipt is generated when you confirm.</Text>
      </View>

      <TouchableOpacity
        style={[form.successButton, busy && styles.buttonDisabled]}
>>>>>>> 8f32440 (Initial app update)
        onPress={onConfirmOrder}
        disabled={busy}
      >
        {busy ? (
<<<<<<< HEAD
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
=======
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <View style={styles.buttonContent}>
            <MaterialIcons name="check-circle" size={18} color="#FFFFFF" />
            <Text style={form.primaryButtonText}>Confirm order & send receipt</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[form.whatsAppButton, busy && styles.buttonDisabled]}
        onPress={onConfirmOrderAndWhatsApp}
        disabled={busy}
      >
        <View style={styles.buttonContent}>
          <MaterialIcons name="chat" size={18} color="#FFFFFF" />
          <Text style={form.primaryButtonText}>Confirm + WhatsApp + receipt</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[form.cancelButton, busy && styles.buttonDisabled]}
        onPress={onCancelOrder}
        disabled={busy}
      >
        <Text style={form.cancelButtonText}>Cancel order</Text>
>>>>>>> 8f32440 (Initial app update)
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReviewOrderScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
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

=======
  centered: { justifyContent: 'center', flex: 1 },
  warningText: {
    fontSize: 14,
    fontFamily: Inter.regular,
    color: Brand.danger,
    marginVertical: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
>>>>>>> 8f32440 (Initial app update)
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
    paddingVertical: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Brand.borderLight,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Inter.semibold,
    color: Brand.text,
>>>>>>> 8f32440 (Initial app update)
    maxWidth: '65%',
    textAlign: 'right',
  },
  summaryPrice: {
<<<<<<< HEAD
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
=======
    fontSize: 15,
    fontFamily: Inter.bold,
    color: Brand.success,
    maxWidth: '65%',
    textAlign: 'right',
  },
  receiptNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 4,
  },
  receiptNoteText: {
    fontSize: 12,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
>>>>>>> 8f32440 (Initial app update)
});
