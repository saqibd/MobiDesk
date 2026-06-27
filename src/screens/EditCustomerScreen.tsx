// src/screens/EditCustomerScreen.tsx
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
<ScrollView contentContainerStyle={form.container} keyboardShouldPersistTaps="handled">
      <Text style={form.title}>Edit customer</Text>

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

      <TouchableOpacity
style={[form.primaryButton, saving && form.primaryButtonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={form.primaryButtonText}>
          {saving ? 'Saving…' : 'Save changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditCustomerScreen;

