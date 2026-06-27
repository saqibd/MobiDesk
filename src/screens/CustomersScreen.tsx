// src/screens/CustomersScreen.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand, Inter } from '../constants/brand';
import { getCustomers, type Customer } from '../services/customerService';
import { screenStyles as shared } from '../styles/screenStyles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Customers'>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function CustomerListItem({
  customer,
  onEdit,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
}) {
  const initials = getInitials(customer.name);
  const subLine = [customer.phone, customer.city].filter(Boolean).join(' • ');

  const onCallPress = () => {
    if (customer.phone) {
      Linking.openURL(`tel:${customer.phone}`).catch(() => {});
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onEdit(customer)}
      activeOpacity={0.75}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{customer.name}</Text>
        {subLine ? (
          <TouchableOpacity onPress={onCallPress} activeOpacity={0.7}>
            <Text style={styles.cardSub}>{subLine}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity onPress={() => onEdit(customer)} style={styles.editBtn}>
<MaterialIcons name="edit" size={16} color={Brand.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const CustomersScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error('Error loading customers', e);
      Alert.alert('Error', 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCustomers);
    return unsubscribe;
  }, [navigation]);

  const onAddCustomer = () => navigation.navigate('AddCustomer');
  const onImportCsv = () => navigation.navigate('CsvImport', { type: 'customers' });
  const onEditCustomer = (customer: Customer) =>
    navigation.navigate('EditCustomer', { customer });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        (c.phone ?? '').toLowerCase().includes(term)
    );
  }, [search, customers]);

  return (
    <ScrollView
contentContainerStyle={shared.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={shared.title}>Customers</Text>
      <Text style={shared.subtitle}>
        Manage customers and quickly access them for new sales.
      </Text>

      <View style={shared.searchBar}>
        <MaterialIcons name="search" size={20} color={Brand.textSubtle} style={{ marginRight: 10 }} />
        <TextInput
          style={shared.searchInput}
          placeholder="Search by name or phone"
          placeholderTextColor={Brand.textSubtle}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

<TouchableOpacity style={shared.primaryButton} onPress={onAddCustomer}>
        <Text style={shared.primaryButtonText}>+ Add customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onImportCsv}>
        <MaterialIcons name="upload-file" size={18} color={Brand.text} />
        <Text style={styles.secondaryButtonText}>Import / update from CSV</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={shared.loadingRow}>
          <ActivityIndicator size="small" color={Brand.primary} />
          <Text style={shared.loadingText}>Loading customers…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={shared.emptyState}>
          {customers.length === 0 ? (
            <>
              <MaterialIcons name="people" size={40} color={Brand.border} style={{ marginBottom: 12 }} />
              <Text style={shared.emptyTitle}>No customers yet</Text>
              <Text style={shared.emptyHint}>
                Tap &quot;Add customer&quot; to create your first one.
              </Text>
            </>
          ) : (
            <Text style={shared.emptyTitle}>No customers found.</Text>
          )}
        </View>
      ) : (
        filtered.map(c => (
          <CustomerListItem key={c.id} customer={c} onEdit={onEditCustomer} />
        ))
      )}
    </ScrollView>
  );
};

export default CustomersScreen;

const styles = StyleSheet.create({
secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: Brand.surface,
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: Brand.text,
    fontSize: 13,
    fontFamily: Inter.semibold,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
fontFamily: Inter.bold,
    color: Brand.primary,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
fontFamily: Inter.semibold,
    color: Brand.text,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  editBtn: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
  },
});
