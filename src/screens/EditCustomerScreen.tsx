// src/screens/EditCustomerScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateCustomer } from '../services/customerService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EditCustomer'>;
type RouteProps = RouteProp<RootStackParamList, 'EditCustomer'>;

const EditCustomerScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { customer } = route.params;

  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address ?? '');
  const [city, setCity] = useState(customer.city ?? '');
  const [email, setEmail] = useState(customer.email ?? '');
  const [notes, setNotes] = useState(customer.notes ?? '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validation', 'Phone is required.');
      return;
    }

    try {
      setSaving(true);

      const updates: Parameters<typeof updateCustomer>[1] = {
        name: name.trim(),
        phone: phone.trim(),
      };
      if (address.trim()) updates.address = address.trim();
      if (city.trim()) updates.city = city.trim();
      if (email.trim()) updates.email = email.trim();
      if (notes.trim()) updates.notes = notes.trim();

      await updateCustomer(customer.id, updates);

      if (Platform.OS === 'web') {
        navigation.goBack();
        Alert.alert('Saved', 'Customer updated successfully.');
      } else {
        Alert.alert('Success', 'Customer updated successfully.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      console.error('Error updating customer', e);
      Alert.alert('Error', 'Could not update customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="03xx xxxxxxx"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, { height: 72 }]}
        placeholder="Street address (optional)"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes (optional)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditCustomerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
