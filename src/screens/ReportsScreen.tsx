// src/screens/ReportsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Reports'>;

const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const openSalesHistory = () => {
    navigation.navigate('SalesHistory');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>
        View your sales history and summary information.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sales Overview</Text>
        <Text style={styles.cardSub}>
          Detailed analytics will be added here. For now, you can view all past
          sales in the Sales History screen.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={openSalesHistory}
      >
        <Text style={styles.primaryButtonText}>Open Sales History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#444',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
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