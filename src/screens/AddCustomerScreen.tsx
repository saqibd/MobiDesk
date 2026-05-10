// src/screens/AddCustomerScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { addCustomer, type Customer } from '../services/customerService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AddCustomer'>;

const AddCustomerScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

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
      const payload: Omit<Customer, 'id'> = {
        name: name.trim(),
        phone: phone.trim(),
      };

      if (address.trim()) payload.address = address.trim();
      if (city.trim()) payload.city = city.trim();
      if (email.trim()) payload.email = email.trim();
      if (notes.trim()) payload.notes = notes.trim();

      await addCustomer(payload);

      Alert.alert('Success', 'Customer added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.error('Error creating customer', e);
      Alert.alert('Error', 'Could not create customer.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Customer</Text>

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

      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>Save Customer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddCustomerScreen;

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
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
