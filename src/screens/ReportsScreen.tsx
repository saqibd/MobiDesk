// src/screens/ReportsScreen.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Brand, Inter } from '../constants/brand';
import { screenStyles as shared } from '../styles/screenStyles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Reports'>;

const REPORT_LINKS = [
  {
    title: 'Sales history',
    description: 'View all past sales, filter by date, and open sale details.',
    icon: 'receipt-long' as const,
    route: 'SalesHistory' as const,
  },
];

const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  return (
    <ScrollView contentContainerStyle={shared.container}>
      <Text style={shared.title}>Reports</Text>
      <Text style={shared.subtitle}>
        Track sales performance and review your store activity.
      </Text>

      <View style={shared.surfaceCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="insights" size={22} color={Brand.primary} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Sales overview</Text>
            <Text style={styles.cardSub}>
              Detailed analytics are coming soon. For now, open sales history to review every transaction.
            </Text>
          </View>
        </View>
      </View>

      {REPORT_LINKS.map(link => (
        <TouchableOpacity
          key={link.route}
          style={styles.linkCard}
          onPress={() => navigation.navigate(link.route)}
          activeOpacity={0.7}
        >
          <View style={styles.linkIconWrap}>
            <MaterialIcons name={link.icon} size={22} color={Brand.primary} />
          </View>
          <View style={styles.linkTextWrap}>
            <Text style={styles.linkTitle}>{link.title}</Text>
            <Text style={styles.linkDescription}>{link.description}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Brand.textSubtle} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Inter.semibold,
    color: Brand.text,
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 13,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
    lineHeight: 20,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  linkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Brand.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTextWrap: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontFamily: Inter.semibold,
    color: Brand.text,
    marginBottom: 2,
  },
  linkDescription: {
    fontSize: 12,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
    lineHeight: 18,
  },
});
