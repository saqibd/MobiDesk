import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brand, Inter } from '../constants/brand';
import { COMPANY } from '../constants/companyInfo';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const location = [COMPANY.city, COMPANY.province, COMPANY.country].filter(Boolean).join(', ');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your {COMPANY.name} store</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Store name</Text>
            <Text style={styles.infoValue}>{COMPANY.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {[COMPANY.addressLine1, COMPANY.addressLine2, location].filter(Boolean).join('\n')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{COMPANY.phone}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{COMPANY.email}</Text>
          </View>
          <Text style={styles.sectionHint}>
            Edit details in src/constants/companyInfo.ts — used on receipts and invoices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User preferences</Text>
          <Text style={styles.sectionText}>
            Notification controls and dashboard display settings will be available in a future update.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & restore</Text>
          <Text style={styles.sectionText}>
            Export and restore your inventory and sales data to keep your store records secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {COMPANY.name}</Text>
          <Text style={styles.sectionText}>{COMPANY.tagline}</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>Version {APP_VERSION}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.background },
  container: { padding: 20, paddingBottom: 32 },
  title: {
    fontSize: 26,
    fontFamily: Inter.bold,
    color: Brand.text,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
    marginBottom: 20,
  },
  section: {
    backgroundColor: Brand.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Inter.semibold,
    color: Brand.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Inter.regular,
    color: Brand.textMuted,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Inter.regular,
    color: Brand.textSubtle,
    marginTop: 12,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Brand.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Inter.medium,
    color: Brand.textSubtle,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Inter.semibold,
    color: Brand.text,
    lineHeight: 20,
  },
  versionPill: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: Brand.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Inter.semibold,
    color: Brand.primary,
  },
});
