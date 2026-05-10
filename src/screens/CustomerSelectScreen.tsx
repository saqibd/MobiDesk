// src/screens/CustomerSelectScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getCustomers, type Customer } from '../services/customerService';
import { setSelectedCustomerState } from '../state/saleSelectionStore';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CustomerSelect'>;

export default function CustomerSelectScreen() {
  const navigation = useNavigation<NavProp>();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error('Error loading customers in selector', e);
      Alert.alert('Error', 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const onSelectCustomer = (customer: Customer) => {
    setSelectedCustomerState({
      id: customer.id ?? '',
      name: customer.name ?? '',
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      city: customer.city ?? '',
      email: customer.email ?? '',
    });

    navigation.navigate('Sales');
  };

  const onAddNewCustomer = () => {
    Alert.alert('Coming soon', 'Add new customer form will be here.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={onAddNewCustomer}>
        <Text style={styles.addButtonText}>+ Add new customer</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      ) : customers.length === 0 ? (
        <Text style={styles.emptyText}>
          No customers yet. Add some from the Customers screen.
        </Text>
      ) : (
        customers.map(c => (
          <TouchableOpacity
            key={c.id}
            style={styles.item}
            onPress={() => onSelectCustomer(c)}
          >
            <View>
              <Text style={styles.itemName}>{c.name}</Text>
              <Text style={styles.itemSub}>
                {c.phone || 'No phone'}{c.city ? ` · ${c.city}` : ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 12,
    color: '#666',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#444',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
  },
});
