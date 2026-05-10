// src/screens/ScanBarcodeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import type { RootStackParamList } from '../../App';

type ScanBarcodeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ScanBarcode'
>;

export default function ScanBarcodeScreen() {
  const navigation = useNavigation<ScanBarcodeNavProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission().catch(err => {
        console.error('Error requesting camera permission', err);
      });
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (!isScanning) return;
      setIsScanning(false);

      const value = result.data?.toString?.() ?? '';
      if (!value) {
        Alert.alert('Scan failed', 'No data found in barcode.', [
          {
            text: 'OK',
            onPress: () => setIsScanning(true),
          },
        ]);
        return;
      }

      navigation.navigate('AddProduct', {
        scannedBarcode: value,
      });
    },
    [isScanning, navigation]
  );

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.infoText}>Checking camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.infoText}>
          Camera access is required to scan barcodes.
        </Text>
        <Button title="Allow camera" onPress={() => requestPermission()} />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Scan Barcode</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
          }}
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Align the barcode within the frame</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  infoText: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  bottom: {
    padding: 16,
    backgroundColor: '#000',
  },
});