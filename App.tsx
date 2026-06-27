// App.tsx
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import React from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const TextAny = Text as typeof Text & { defaultProps?: { style?: unknown } };
if (TextAny.defaultProps == null) TextAny.defaultProps = {};
TextAny.defaultProps.style = [
  { fontFamily: 'Inter_400Regular' },
  TextAny.defaultProps?.style,
];

const TextInputAny = TextInput as typeof TextInput & { defaultProps?: { style?: unknown } };
if (TextInputAny.defaultProps == null) TextInputAny.defaultProps = {};
TextInputAny.defaultProps.style = [
  { fontFamily: 'Inter_400Regular' },
  TextInputAny.defaultProps?.style,
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
