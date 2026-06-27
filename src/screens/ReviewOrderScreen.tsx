// src/screens/ReviewOrderScreen.tsx
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
import {
  getSelectedCustomerState,
  getSelectedProductState,
  resetSaleSelection,
} from '../state/saleSelectionStore';
import { formStyles as form } from '../styles/formStyles';
import { screenStyles as shared } from '../styles/screenStyles';
import type { ProductWithId } from '../types/product';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'ReviewOrder'>;

const ReviewOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [busy, setBusy] = useState(false);

  const customer = getSelectedCustomerState();
  const product = getSelectedProductState();

  if (!customer || !product) {
    return (
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
        </TouchableOpacity>
      </View>
    );
  }

  const fullProduct = product as ProductWithId;

  const finishAndReset = () => {
    resetSaleSelection();
    resetToSalesScreen(navigation);
  };

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
      if (Platform.OS === 'web') {
        finishAndReset();
      } else {
        Alert.alert(
          'Order confirmed',
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
— ${COMPANY.name}`;

    const appUrl = `whatsapp://send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${encodeURIComponent(phone.replace('+', ''))}?text=${encodeURIComponent(message)}`;

    setBusy(true);
    try {
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
          'Order confirmed',
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

  const onCancelOrder = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Cancel this order? This will clear the selected customer and product.'
      );
      if (confirmed) finishAndReset();
    } else {
      Alert.alert(
        'Cancel order',
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
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {customer.name}{customer.phone ? ` · ${customer.phone}` : ''}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>{fullProduct.name}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price</Text>
          <Text style={styles.summaryPrice}>Rs. {price.toLocaleString('en-PK')}</Text>
        </View>
      </View>

      <View style={styles.receiptNote}>
        <MaterialIcons name="description" size={16} color={Brand.textMuted} />
        <Text style={styles.receiptNoteText}>A PDF receipt is generated when you confirm.</Text>
      </View>

      <TouchableOpacity
        style={[form.successButton, busy && styles.buttonDisabled]}
        onPress={onConfirmOrder}
        disabled={busy}
      >
        {busy ? (
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
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReviewOrderScreen;

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', flex: 1 },
  warningText: {
    fontSize: 14,
    fontFamily: Inter.regular,
    color: Brand.danger,
    marginVertical: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    maxWidth: '65%',
    textAlign: 'right',
  },
  summaryPrice: {
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
});
