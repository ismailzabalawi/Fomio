import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { AppThemeProvider } from './_theme';

export default function App() {
  return (
    <AppThemeProvider>
      {/* The app's entry point is now handled by expo-router */}
      <></>
    </AppThemeProvider>
  );
}