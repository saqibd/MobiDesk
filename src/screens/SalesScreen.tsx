// src/screens/SalesScreen.tsx
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
=======
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand, Inter } from '../constants/brand';
>>>>>>> 8f32440 (Initial app update)
import {
  getSelectedCustomerState,
  getSelectedProductState,
  type SelectedCustomer,
  type SelectedProduct,
  resetSaleSelection,
} from '../state/saleSelectionStore';
<<<<<<< HEAD
=======
import { screenStyles as shared } from '../styles/screenStyles';
>>>>>>> 8f32440 (Initial app update)

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Sales'>;

const SalesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>(
    getSelectedCustomerState()
  );
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>(
    getSelectedProductState()
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedCustomer(getSelectedCustomerState());
      setSelectedProduct(getSelectedProductState());
    });
    return unsubscribe;
  }, [navigation]);

  const hasCustomer = !!selectedCustomer;
  const hasProduct = !!selectedProduct;
  const canReview = hasCustomer && hasProduct;

  const openCustomerSelect = () => navigation.navigate('CustomerSelect');
  const openProductSelect = () => navigation.navigate('ProductSelect');

  const goToReviewOrder = () => {
    if (!hasCustomer) {
      Alert.alert('Customer required', 'Please select a customer first.');
      return;
    }
    if (!hasProduct) {
      Alert.alert('Product required', 'Please select a product first.');
      return;
    }
    navigation.navigate('ReviewOrder');
  };

  const doClear = () => {
    resetSaleSelection();
    setSelectedCustomer(null);
    setSelectedProduct(null);
  };

  const onResetSale = () => {
    if (!hasCustomer && !hasProduct) return;

    if (Platform.OS === 'web') {
<<<<<<< HEAD
      // Alert.alert multi-button onPress is unreliable on web — use native confirm
=======
>>>>>>> 8f32440 (Initial app update)
      if (window.confirm('Clear current sale?\n\nThis will remove the selected customer and product.')) {
        doClear();
      }
    } else {
      Alert.alert(
        'Clear current sale?',
        'This will remove the selected customer and product.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: doClear },
        ]
      );
    }
  };

  const goToMainMenu = () => navigation.navigate('Home');

<<<<<<< HEAD
  // Stepper step states
=======
>>>>>>> 8f32440 (Initial app update)
  const step1Done = hasCustomer;
  const step2Done = hasProduct;
  const step3Ready = canReview;

  return (
<<<<<<< HEAD
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <Text style={styles.title}>New Sale</Text>
      <Text style={styles.subtitle}>Follow the steps below to complete a sale.</Text>

      {/* ── Stepper ── */}
      <View style={styles.stepper}>
        <StepBadge index={1} label="Customer" done={step1Done} active={!step1Done} />
        <View style={styles.stepConnector} />
        <StepBadge index={2} label="Product" done={step2Done} active={step1Done && !step2Done} />
        <View style={styles.stepConnector} />
        <StepBadge index={3} label="Review" done={false} active={step3Ready} />
      </View>

      {/* ── Step 1: Customer ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Step 1 · Customer
          </Text>
          {hasCustomer && <View style={styles.donePill}><Text style={styles.donePillText}>✓ Selected</Text></View>}
=======
    <ScrollView contentContainerStyle={shared.container}>
      <Text style={shared.title}>New sale</Text>
      <Text style={shared.subtitle}>Follow the steps below to complete a sale.</Text>

      <View style={styles.stepper}>
        <StepBadge index={1} label="Customer" done={step1Done} active={!step1Done} />
        <View style={[styles.stepConnector, step1Done && styles.stepConnectorDone]} />
        <StepBadge index={2} label="Product" done={step2Done} active={step1Done && !step2Done} />
        <View style={[styles.stepConnector, step2Done && styles.stepConnectorDone]} />
        <StepBadge index={3} label="Review" done={false} active={step3Ready} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Step 1 · Customer</Text>
          {hasCustomer && (
            <View style={styles.donePill}>
              <MaterialIcons name="check" size={12} color={Brand.success} />
              <Text style={styles.donePillText}>Selected</Text>
            </View>
          )}
>>>>>>> 8f32440 (Initial app update)
        </View>

        {hasCustomer ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
<<<<<<< HEAD
=======
              <View style={styles.cardIconWrap}>
                <MaterialIcons name="person" size={20} color={Brand.success} />
              </View>
>>>>>>> 8f32440 (Initial app update)
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedCustomer!.name}</Text>
                {!!selectedCustomer!.phone && (
                  <Text style={styles.cardSub}>{selectedCustomer!.phone}</Text>
                )}
              </View>
              <TouchableOpacity onPress={openCustomerSelect}>
<<<<<<< HEAD
                <Text style={styles.changeLink}>Change customer</Text>
=======
                <Text style={styles.changeLink}>Change</Text>
>>>>>>> 8f32440 (Initial app update)
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openCustomerSelect}>
<<<<<<< HEAD
            <Text style={styles.emptyCardIcon}>👤</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No customer selected.</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a customer.</Text>
            </View>
            <Text style={styles.emptyCardArrow}>›</Text>
=======
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="person-outline" size={22} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No customer selected</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a customer</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
>>>>>>> 8f32440 (Initial app update)
          </TouchableOpacity>
        )}
      </View>

<<<<<<< HEAD
      {/* ── Step 2: Product ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Step 2 · Product
          </Text>
          {hasProduct && <View style={styles.donePill}><Text style={styles.donePillText}>✓ Selected</Text></View>}
=======
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Step 2 · Product</Text>
          {hasProduct && (
            <View style={styles.donePill}>
              <MaterialIcons name="check" size={12} color={Brand.success} />
              <Text style={styles.donePillText}>Selected</Text>
            </View>
          )}
>>>>>>> 8f32440 (Initial app update)
        </View>

        {hasProduct ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
<<<<<<< HEAD
=======
              <View style={styles.cardIconWrap}>
                <MaterialIcons name="inventory-2" size={20} color={Brand.success} />
              </View>
>>>>>>> 8f32440 (Initial app update)
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedProduct!.name}</Text>
                <Text style={styles.cardSub}>
                  Price: PKR {selectedProduct!.price} · Stock: {selectedProduct!.stock}
                </Text>
              </View>
              <TouchableOpacity onPress={openProductSelect}>
<<<<<<< HEAD
                <Text style={styles.changeLink}>Change product</Text>
=======
                <Text style={styles.changeLink}>Change</Text>
>>>>>>> 8f32440 (Initial app update)
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openProductSelect}>
<<<<<<< HEAD
            <Text style={styles.emptyCardIcon}>📦</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No product selected.</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a product.</Text>
            </View>
            <Text style={styles.emptyCardArrow}>›</Text>
=======
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="inventory-2" size={22} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No product selected</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a product</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
>>>>>>> 8f32440 (Initial app update)
          </TouchableOpacity>
        )}
        {!hasProduct && hasCustomer && (
          <Text style={styles.inlineError}>Select a product to continue.</Text>
        )}
      </View>

<<<<<<< HEAD
      {/* ── Sale Summary ── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Sale Summary</Text>
=======
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Sale summary</Text>
>>>>>>> 8f32440 (Initial app update)
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer</Text>
          <Text style={styles.summaryValue}>{selectedCustomer?.name ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product</Text>
          <Text style={styles.summaryValue}>{selectedProduct?.name ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Quantity</Text>
          <Text style={styles.summaryValue}>1</Text>
        </View>
<<<<<<< HEAD
        <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.summaryLabel}>Estimated Total</Text>
          <Text style={[styles.summaryValue, { fontWeight: '700', color: '#16a34a' }]}>
=======
        <View style={[styles.summaryRow, styles.summaryRowLast]}>
          <Text style={styles.summaryLabel}>Estimated total</Text>
          <Text style={styles.summaryTotal}>
>>>>>>> 8f32440 (Initial app update)
            {selectedProduct ? `PKR ${selectedProduct.price}` : '—'}
          </Text>
        </View>
      </View>

<<<<<<< HEAD
      {/* ── Step 3: Review Order ── */}
=======
>>>>>>> 8f32440 (Initial app update)
      <TouchableOpacity
        style={[styles.primaryButton, !canReview && styles.primaryButtonDisabled]}
        onPress={goToReviewOrder}
        disabled={!canReview}
      >
        <Text style={styles.primaryButtonText}>
<<<<<<< HEAD
          {canReview ? 'Step 3 · Review Order' : 'Review Order'}
=======
          {canReview ? 'Step 3 · Review order' : 'Review order'}
>>>>>>> 8f32440 (Initial app update)
        </Text>
      </TouchableOpacity>
      {!canReview && (
        <Text style={styles.reviewHint}>Select a customer and product to continue.</Text>
      )}

<<<<<<< HEAD
      {/* ── Secondary actions ── */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={onResetSale}
        >
          <Text style={styles.outlineButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={goToMainMenu}
        >
          <Text style={styles.outlineButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

=======
      <View style={shared.secondaryRow}>
        <TouchableOpacity style={shared.outlineButton} onPress={onResetSale}>
          <MaterialIcons name="refresh" size={18} color={Brand.text} />
          <Text style={shared.outlineButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={shared.outlineButton} onPress={goToMainMenu}>
          <MaterialIcons name="home" size={18} color={Brand.text} />
          <Text style={shared.outlineButtonText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
>>>>>>> 8f32440 (Initial app update)
    </ScrollView>
  );
};

<<<<<<< HEAD
// ── StepBadge helper component ──
=======
>>>>>>> 8f32440 (Initial app update)
function StepBadge({
  index,
  label,
  done,
  active,
}: {
  index: number;
  label: string;
  done: boolean;
  active: boolean;
}) {
  const circleStyle = done
    ? stepStyles.circleDone
    : active
    ? stepStyles.circleActive
    : stepStyles.circleIdle;

<<<<<<< HEAD
  const textStyle = done
    ? stepStyles.circleTextDone
    : active
    ? stepStyles.circleTextActive
    : stepStyles.circleTextIdle;

=======
>>>>>>> 8f32440 (Initial app update)
  const labelStyle = active || done ? stepStyles.labelActive : stepStyles.labelIdle;

  return (
    <View style={stepStyles.stepItem}>
      <View style={[stepStyles.circle, circleStyle]}>
<<<<<<< HEAD
        <Text style={[stepStyles.circleText, textStyle]}>
          {done ? '✓' : index}
        </Text>
=======
        {done ? (
          <MaterialIcons name="check" size={16} color="#FFFFFF" />
        ) : (
          <Text style={stepStyles.circleText}>{index}</Text>
        )}
>>>>>>> 8f32440 (Initial app update)
      </View>
      <Text style={[stepStyles.label, labelStyle]}>{label}</Text>
    </View>
  );
}

export default SalesScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
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
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },

  // Stepper
=======
>>>>>>> 8f32440 (Initial app update)
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepConnector: {
    flex: 1,
    height: 2,
<<<<<<< HEAD
    backgroundColor: '#E2E8F0',
    marginBottom: 18,
  },

  // Section
=======
    backgroundColor: Brand.border,
    marginBottom: 18,
  },
  stepConnectorDone: {
    backgroundColor: Brand.success,
  },
>>>>>>> 8f32440 (Initial app update)
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
<<<<<<< HEAD
    fontWeight: '700',
    color: '#334155',
  },
  donePill: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  donePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },

  // Filled selection card
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSelected: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
=======
    fontFamily: Inter.semibold,
    color: Brand.text,
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.successBg,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  donePillText: {
    fontSize: 11,
    fontFamily: Inter.bold,
    color: Brand.success,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  cardSelected: {
    borderColor: '#86EFAC',
    backgroundColor: Brand.successBg,
>>>>>>> 8f32440 (Initial app update)
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
=======
    gap: 10,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Brand.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: Inter.semibold,
    color: Brand.text,
>>>>>>> 8f32440 (Initial app update)
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
<<<<<<< HEAD
    color: '#64748B',
  },
  changeLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 8,
  },

  // Empty tap-to-select card
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
=======
    fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  changeLink: {
    fontSize: 12,
    color: Brand.primary,
    fontFamily: Inter.semibold,
    marginLeft: 8,
  },
  emptyCard: {
    backgroundColor: Brand.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Brand.border,
>>>>>>> 8f32440 (Initial app update)
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
<<<<<<< HEAD
  emptyCardIcon: {
    fontSize: 22,
  },
  emptyCardText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  emptyCardHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  emptyCardArrow: {
    fontSize: 20,
    color: '#CBD5E1',
  },

  // Inline validation hint
  inlineError: {
    marginTop: 5,
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },

  // Sale summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
=======
  emptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardText: {
    fontSize: 13,
    color: Brand.text,
    fontFamily: Inter.semibold,
  },
  emptyCardHint: {
    fontSize: 11,
    color: Brand.textSubtle,
    fontFamily: Inter.regular,
    marginTop: 1,
  },
  inlineError: {
    marginTop: 6,
    fontSize: 12,
    color: Brand.danger,
    fontFamily: Inter.medium,
  },
  summaryCard: {
    backgroundColor: Brand.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
>>>>>>> 8f32440 (Initial app update)
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
<<<<<<< HEAD
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
=======
    fontFamily: Inter.semibold,
    color: Brand.textMuted,
    marginBottom: 10,
>>>>>>> 8f32440 (Initial app update)
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    maxWidth: '55%',
    textAlign: 'right',
  },

  // Primary button
  primaryButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
=======
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderLight,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: Inter.medium,
    color: Brand.text,
    maxWidth: '55%',
    textAlign: 'right',
  },
  summaryTotal: {
    fontSize: 14,
    fontFamily: Inter.bold,
    color: Brand.success,
    maxWidth: '55%',
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: Brand.success,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: Brand.border,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: Inter.bold,
>>>>>>> 8f32440 (Initial app update)
  },
  reviewHint: {
    textAlign: 'center',
    fontSize: 12,
<<<<<<< HEAD
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 4,
  },

  // Secondary actions
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
=======
    fontFamily: Inter.regular,
    color: Brand.textSubtle,
    marginTop: 6,
    marginBottom: 4,
  },
>>>>>>> 8f32440 (Initial app update)
});

const stepStyles = StyleSheet.create({
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
<<<<<<< HEAD
    width: 30,
    height: 30,
    borderRadius: 15,
=======
    width: 32,
    height: 32,
    borderRadius: 16,
>>>>>>> 8f32440 (Initial app update)
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
<<<<<<< HEAD
    backgroundColor: '#16a34a',
  },
  circleActive: {
    backgroundColor: '#2563eb',
  },
  circleIdle: {
    backgroundColor: '#E2E8F0',
  },
  circleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  circleTextDone: {
    color: '#fff',
  },
  circleTextActive: {
    color: '#fff',
  },
  circleTextIdle: {
    color: '#94A3B8',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: '#0F172A',
  },
  labelIdle: {
    color: '#94A3B8',
=======
    backgroundColor: Brand.success,
  },
  circleActive: {
    backgroundColor: Brand.primary,
  },
  circleIdle: {
    backgroundColor: Brand.border,
  },
  circleText: {
    fontSize: 13,
    fontFamily: Inter.bold,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 11,
    fontFamily: Inter.semibold,
  },
  labelActive: {
    color: Brand.text,
  },
  labelIdle: {
    color: Brand.textSubtle,
>>>>>>> 8f32440 (Initial app update)
  },
});
