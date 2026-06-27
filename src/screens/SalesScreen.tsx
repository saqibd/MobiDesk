// src/screens/SalesScreen.tsx
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
import {
  getSelectedCustomerState,
  getSelectedProductState,
  type SelectedCustomer,
  type SelectedProduct,
  resetSaleSelection,
} from '../state/saleSelectionStore';
import { screenStyles as shared } from '../styles/screenStyles';

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

  const step1Done = hasCustomer;
  const step2Done = hasProduct;
  const step3Ready = canReview;

  return (
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
        </View>

        {hasCustomer ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
              <View style={styles.cardIconWrap}>
                <MaterialIcons name="person" size={20} color={Brand.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedCustomer!.name}</Text>
                {!!selectedCustomer!.phone && (
                  <Text style={styles.cardSub}>{selectedCustomer!.phone}</Text>
                )}
              </View>
              <TouchableOpacity onPress={openCustomerSelect}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openCustomerSelect}>
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="person-outline" size={22} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No customer selected</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a customer</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Step 2 · Product</Text>
          {hasProduct && (
            <View style={styles.donePill}>
              <MaterialIcons name="check" size={12} color={Brand.success} />
              <Text style={styles.donePillText}>Selected</Text>
            </View>
          )}
        </View>

        {hasProduct ? (
          <View style={[styles.card, styles.cardSelected]}>
            <View style={styles.cardRow}>
              <View style={styles.cardIconWrap}>
                <MaterialIcons name="inventory-2" size={20} color={Brand.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{selectedProduct!.name}</Text>
                <Text style={styles.cardSub}>
                  Price: PKR {selectedProduct!.price} · Stock: {selectedProduct!.stock}
                </Text>
              </View>
              <TouchableOpacity onPress={openProductSelect}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCard} onPress={openProductSelect}>
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="inventory-2" size={22} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyCardText}>No product selected</Text>
              <Text style={styles.emptyCardHint}>Tap to choose a product</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
          </TouchableOpacity>
        )}
        {!hasProduct && hasCustomer && (
          <Text style={styles.inlineError}>Select a product to continue.</Text>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Sale summary</Text>
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
        <View style={[styles.summaryRow, styles.summaryRowLast]}>
          <Text style={styles.summaryLabel}>Estimated total</Text>
          <Text style={styles.summaryTotal}>
            {selectedProduct ? `PKR ${selectedProduct.price}` : '—'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !canReview && styles.primaryButtonDisabled]}
        onPress={goToReviewOrder}
        disabled={!canReview}
      >
        <Text style={styles.primaryButtonText}>
          {canReview ? 'Step 3 · Review order' : 'Review order'}
        </Text>
      </TouchableOpacity>
      {!canReview && (
        <Text style={styles.reviewHint}>Select a customer and product to continue.</Text>
      )}

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
    </ScrollView>
  );
};

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

  const labelStyle = active || done ? stepStyles.labelActive : stepStyles.labelIdle;

  return (
    <View style={stepStyles.stepItem}>
      <View style={[stepStyles.circle, circleStyle]}>
        {done ? (
          <MaterialIcons name="check" size={16} color="#FFFFFF" />
        ) : (
          <Text style={stepStyles.circleText}>{index}</Text>
        )}
      </View>
      <Text style={[stepStyles.label, labelStyle]}>{label}</Text>
    </View>
  );
}

export default SalesScreen;

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: Brand.border,
    marginBottom: 18,
  },
  stepConnectorDone: {
    backgroundColor: Brand.success,
  },
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
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
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
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
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
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 13,
    fontFamily: Inter.semibold,
    color: Brand.textMuted,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  reviewHint: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Inter.regular,
    color: Brand.textSubtle,
    marginTop: 6,
    marginBottom: 4,
  },
});

const stepStyles = StyleSheet.create({
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
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
  },
});
