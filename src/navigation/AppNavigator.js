/**
 * Hactually App Navigation
 * Main navigation setup using React Navigation
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

// Flows Screen (initial)
import FlowsScreen from '../screens/FlowsScreen';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import AuthOptionsScreen from '../screens/auth/AuthOptionsScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import LocationScreen from '../screens/auth/LocationScreen';

// Main Screens
import StyleGuideScreen from '../screens/StyleGuideScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Root Navigator - FlowsScreen is the entry point
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Flows"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Flows - Entry Point */}
        <Stack.Screen name="Flows" component={FlowsScreen} />

        {/* Auth Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />

        {/* Main App */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StyleGuide" component={StyleGuideScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
