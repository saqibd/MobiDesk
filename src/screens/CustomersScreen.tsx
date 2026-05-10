// src/screens/CustomersScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCustomers, type Customer } from '../services/customerService';

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
        <Text style={styles.editBtnText}>Edit</Text>
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
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <Text style={styles.title}>Customers</Text>
      <Text style={styles.subtitle}>
        Manage customers and quickly access them for new sales.
      </Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.primaryButton} onPress={onAddCustomer}>
        <Text style={styles.primaryButtonText}>+ Add Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onImportCsv}>
        <Text style={styles.secondaryButtonText}>📥 Import / Update from CSV</Text>
      </TouchableOpacity>

      {/* List */}
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          {customers.length === 0 ? (
            <>
              <Text style={styles.emptyTitle}>No customers yet.</Text>
              <Text style={styles.emptyHint}>
                Tap "+ Add Customer" to create your first one.
              </Text>
            </>
          ) : (
            <Text style={styles.emptyTitle}>No customers found.</Text>
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
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },

  // Header
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '500',
  },

  // Customer card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  editBtnText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },

  // States
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
