// src/screens/AddCustomerScreen.tsx
<<<<<<< HEAD
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
=======
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand } from '../constants/brand';
import { addCustomer, type Customer } from '../services/customerService';
import { formStyles as form } from '../styles/formStyles';
>>>>>>> 8f32440 (Initial app update)

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
<<<<<<< HEAD
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Customer</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer name"
=======
    <ScrollView contentContainerStyle={form.container} keyboardShouldPersistTaps="handled">
      <Text style={form.title}>Add customer</Text>

      <Text style={form.label}>Name</Text>
      <TextInput
        style={form.input}
        placeholder="Customer name"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        value={name}
        onChangeText={setName}
      />

<<<<<<< HEAD
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="03xx xxxxxxx"
=======
      <Text style={form.label}>Phone</Text>
      <TextInput
        style={form.input}
        placeholder="03xx xxxxxxx"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

<<<<<<< HEAD
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, { height: 72 }]}
        placeholder="Street address (optional)"
=======
      <Text style={form.label}>Address</Text>
      <TextInput
        style={[form.input, { height: 72, textAlignVertical: 'top' }]}
        placeholder="Street address (optional)"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        multiline
        value={address}
        onChangeText={setAddress}
      />

<<<<<<< HEAD
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
=======
      <Text style={form.label}>City</Text>
      <TextInput
        style={form.input}
        placeholder="City"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        value={city}
        onChangeText={setCity}
      />

<<<<<<< HEAD
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
=======
      <Text style={form.label}>Email</Text>
      <TextInput
        style={form.input}
        placeholder="Email (optional)"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

<<<<<<< HEAD
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes (optional)"
=======
      <Text style={form.label}>Notes</Text>
      <TextInput
        style={[form.input, form.notesInput]}
        placeholder="Notes (optional)"
        placeholderTextColor={Brand.textSubtle}
>>>>>>> 8f32440 (Initial app update)
        multiline
        value={notes}
        onChangeText={setNotes}
      />

<<<<<<< HEAD
      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>Save Customer</Text>
=======
      <TouchableOpacity style={form.primaryButton} onPress={onSave}>
        <Text style={form.primaryButtonText}>Save customer</Text>
>>>>>>> 8f32440 (Initial app update)
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddCustomerScreen;
<<<<<<< HEAD

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
=======
>>>>>>> 8f32440 (Initial app update)
