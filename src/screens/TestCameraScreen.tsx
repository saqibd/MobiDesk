<<<<<<< HEAD
// src/screens/TestCameraScreen.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function TestCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Checking permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    requestPermission();
    return (
      <SafeAreaView style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CameraView style={StyleSheet.absoluteFill} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
=======
// src/screens/TestCameraScreen.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function TestCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Checking permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    requestPermission();
    return (
      <SafeAreaView style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CameraView style={StyleSheet.absoluteFill} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
>>>>>>> 8f32440 (Initial app update)
});