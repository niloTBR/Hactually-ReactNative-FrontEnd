/**
 * Hactually React Native App
 * Main entry point
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong:</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Ezra-Regular': require('./assets/fonts/Ezra-Regular.ttf'),
          'Ezra-Medium': require('./assets/fonts/Ezra-Medium.ttf'),
          'Ezra-SemiBold': require('./assets/fonts/Ezra-SemiBold.ttf'),
          'Ezra-Bold': require('./assets/fonts/Ezra-Bold.ttf'),
          'Ezra-ExtraBold': require('./assets/fonts/Ezra-ExtraBold.ttf'),
          'Ezra-Black': require('./assets/fonts/Ezra-Black.ttf'),
          'Ezra-Light': require('./assets/fonts/Ezra-Light.ttf'),
          'Ezra-Italic': require('./assets/fonts/Ezra-Italic.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
        setFontsLoaded(true); // Continue anyway with system fonts
      }
    }
    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});
