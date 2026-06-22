// App.tsx
import React from 'react';
import { Text, TextInput, ActivityIndicator, View } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

if (Text.defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.style = [
  { fontFamily: 'Inter_400Regular' },
  (Text as any).defaultProps?.style,
];

if (TextInput.defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.style = [
  { fontFamily: 'Inter_400Regular' },
  (TextInput as any).defaultProps?.style,
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
