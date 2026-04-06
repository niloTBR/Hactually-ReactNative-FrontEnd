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
import VenueCheckInScreen from '../screens/VenueCheckInScreen';
import CheckedInScreen from '../screens/CheckedInScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MatchesScreen from '../screens/MatchesScreen';
import SpotsScreen from '../screens/SpotsScreen';

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

        {/* Main App — tab screens use fade, others slide */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="VenueCheckIn" component={VenueCheckInScreen} />
        <Stack.Screen name="CheckedIn" component={CheckedInScreen} />
        <Stack.Screen name="Spots" component={SpotsScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Matches" component={MatchesScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="StyleGuide" component={StyleGuideScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
