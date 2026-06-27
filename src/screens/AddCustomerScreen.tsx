// src/screens/AddCustomerScreen.tsx
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
<ScrollView contentContainerStyle={form.container} keyboardShouldPersistTaps="handled">
      <Text style={form.title}>Add customer</Text>

      <Text style={form.label}>Name</Text>
      <TextInput
        style={form.input}
        placeholder="Customer name"
        placeholderTextColor={Brand.textSubtle}
        value={name}
        onChangeText={setName}
      />

<Text style={form.label}>Phone</Text>
      <TextInput
        style={form.input}
        placeholder="03xx xxxxxxx"
        placeholderTextColor={Brand.textSubtle}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

<Text style={form.label}>Address</Text>
      <TextInput
        style={[form.input, { height: 72, textAlignVertical: 'top' }]}
        placeholder="Street address (optional)"
        placeholderTextColor={Brand.textSubtle}
        multiline
        value={address}
        onChangeText={setAddress}
      />

<Text style={form.label}>City</Text>
      <TextInput
        style={form.input}
        placeholder="City"
        placeholderTextColor={Brand.textSubtle}
        value={city}
        onChangeText={setCity}
      />

<Text style={form.label}>Email</Text>
      <TextInput
        style={form.input}
        placeholder="Email (optional)"
        placeholderTextColor={Brand.textSubtle}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

<Text style={form.label}>Notes</Text>
      <TextInput
        style={[form.input, form.notesInput]}
        placeholder="Notes (optional)"
        placeholderTextColor={Brand.textSubtle}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

<TouchableOpacity style={form.primaryButton} onPress={onSave}>
        <Text style={form.primaryButtonText}>Save customer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddCustomerScreen;

