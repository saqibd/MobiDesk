// src/screens/SalesScreen.tsx
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
import {
  getSelectedCustomerState,
  getSelectedProductState,
  type SelectedCustomer,
  type SelectedProduct,
  resetSaleSelection,
} from '../state/saleSelectionStore';

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
      // Alert.alert multi-button onPress is unreliable on web — use native confirm
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

  // Stepper step states
  const step1Done = hasCustomer;
  const step2Done = hasProduct;
  const step3Ready = canReview;

  return (
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
        </View>

        {hasCustomer ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedCustomer!.name}</Text>
                {!!selectedCustomer!.phone && (
                  <Text style={styles.cardSub}>{selectedCustomer!.phone}</Text>
                )}
              </View>
              <TouchableOpacity onPress={openCustomerSelect}>
                <Text style={styles.changeLink}>Change customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openCustomerSelect}>
            <Text style={styles.emptyCardIcon}>👤</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No customer selected.</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a customer.</Text>
            </View>
            <Text style={styles.emptyCardArrow}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Step 2: Product ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Step 2 · Product
          </Text>
          {hasProduct && <View style={styles.donePill}><Text style={styles.donePillText}>✓ Selected</Text></View>}
        </View>

        {hasProduct ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedProduct!.name}</Text>
                <Text style={styles.cardSub}>
                  Price: PKR {selectedProduct!.price} · Stock: {selectedProduct!.stock}
                </Text>
              </View>
              <TouchableOpacity onPress={openProductSelect}>
                <Text style={styles.changeLink}>Change product</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openProductSelect}>
            <Text style={styles.emptyCardIcon}>📦</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No product selected.</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a product.</Text>
            </View>
            <Text style={styles.emptyCardArrow}>›</Text>
          </TouchableOpacity>
        )}
        {!hasProduct && hasCustomer && (
          <Text style={styles.inlineError}>Select a product to continue.</Text>
        )}
      </View>

      {/* ── Sale Summary ── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Sale Summary</Text>
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
        <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.summaryLabel}>Estimated Total</Text>
          <Text style={[styles.summaryValue, { fontWeight: '700', color: '#16a34a' }]}>
            {selectedProduct ? `PKR ${selectedProduct.price}` : '—'}
          </Text>
        </View>
      </View>

      {/* ── Step 3: Review Order ── */}
      <TouchableOpacity
        style={[styles.primaryButton, !canReview && styles.primaryButtonDisabled]}
        onPress={goToReviewOrder}
        disabled={!canReview}
      >
        <Text style={styles.primaryButtonText}>
          {canReview ? 'Step 3 · Review Order' : 'Review Order'}
        </Text>
      </TouchableOpacity>
      {!canReview && (
        <Text style={styles.reviewHint}>Select a customer and product to continue.</Text>
      )}

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

    </ScrollView>
  );
};

// ── StepBadge helper component ──
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

  const textStyle = done
    ? stepStyles.circleTextDone
    : active
    ? stepStyles.circleTextActive
    : stepStyles.circleTextIdle;

  const labelStyle = active || done ? stepStyles.labelActive : stepStyles.labelIdle;

  return (
    <View style={stepStyles.stepItem}>
      <View style={[stepStyles.circle, circleStyle]}>
        <Text style={[stepStyles.circleText, textStyle]}>
          {done ? '✓' : index}
        </Text>
      </View>
      <Text style={[stepStyles.label, labelStyle]}>{label}</Text>
    </View>
  );
}

export default SalesScreen;

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
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 18,
  },

  // Section
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
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
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
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
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
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  reviewHint: {
    textAlign: 'center',
    fontSize: 12,
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
});

const stepStyles = StyleSheet.create({
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
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
  },
});
