// src/screens/EditCustomerScreen.tsx
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
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { updateCustomer } from '../services/customerService';
=======
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand } from '../constants/brand';
import { updateCustomer } from '../services/customerService';
import { formStyles as form } from '../styles/formStyles';
>>>>>>> 8f32440 (Initial app update)

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
<<<<<<< HEAD
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer name"
=======
    <ScrollView contentContainerStyle={form.container} keyboardShouldPersistTaps="handled">
      <Text style={form.title}>Edit customer</Text>

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

      <TouchableOpacity
<<<<<<< HEAD
        style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.primaryButtonText}>
          {saving ? 'Saving...' : 'Save Changes'}
=======
        style={[form.primaryButton, saving && form.primaryButtonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={form.primaryButtonText}>
          {saving ? 'Saving…' : 'Save changes'}
>>>>>>> 8f32440 (Initial app update)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditCustomerScreen;
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
=======
>>>>>>> 8f32440 (Initial app update)
