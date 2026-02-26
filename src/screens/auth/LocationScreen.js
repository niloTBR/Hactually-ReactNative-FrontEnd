/**
 * Location Permission Screen
 * Request location access for venue discovery
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Navigation, Shield } from 'lucide-react-native';
import * as Location from 'expo-location';
import { color, spacing, typography, radius } from '../../theme';
import { colors } from '../../theme';
import { Button } from '../../components';
import { useAuthStore } from '../../store/authStore';

export default function LocationScreen({ navigation }) {
  const { updateProfile, setOnboardingStep } = useAuthStore();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionStatus(status);
  };

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    setError('');

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        updateProfile({
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          locationPermission: true,
          onboardingComplete: true,
        });

        setOnboardingStep(4);
        // Navigation handled by AppNavigator detecting onboardingComplete
      } else {
        setError('Location access was denied. Please enable it in settings.');
      }
    } catch (err) {
      console.error('Location error:', err);
      setError('Failed to get location. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleSkip = () => {
    updateProfile({
      locationPermission: false,
      onboardingComplete: true,
    });
    setOnboardingStep(4);
    // Navigation handled by AppNavigator
  };

  const benefits = [
    { icon: Navigation, text: 'See people at venues near you' },
    { icon: MapPin, text: 'Check into places and meet others' },
    { icon: Shield, text: 'Your exact location is never shared' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={color.brown.dark} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enable location</Text>
        <Text style={styles.subtitle}>
          So we can show you who's actually around
        </Text>

        {/* Location illustration */}
        <View style={styles.illustration}>
          <View style={styles.pulseOuter} />
          <View style={styles.pulseInner} />
          <View style={styles.iconContainer}>
            <MapPin size={32} color="white" strokeWidth={1.5} />
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          {benefits.map((item, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <item.icon
                  size={20}
                  color={color.brown.dark}
                  strokeWidth={1.5}
                />
              </View>
              <Text style={styles.benefitText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>
        {permissionStatus === 'denied' ? (
          <>
            <Button variant="solid" size="large" onPress={handleOpenSettings}>
              Open Settings
            </Button>
            <Button variant="outline" size="large" onPress={handleRequestLocation}>
              Try Again
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="large"
            onPress={handleRequestLocation}
            disabled={isRequesting}
            loading={isRequesting}
            icon={<MapPin size={16} color={color.orange.dark} />}
          >
            Allow Location
          </Button>
        )}

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: color.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  title: {
    ...typography.h1,
    color: color.charcoal,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: color.brown.dark,
    marginBottom: spacing['2xl'],
  },
  illustration: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  pulseOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: color.blue.dark + '1A',
  },
  pulseInner: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: color.blue.dark + '26',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: color.blue.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefits: {
    gap: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: color.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    ...typography.caption,
    color: color.charcoal,
  },
  errorContainer: {
    marginTop: spacing.xl,
    backgroundColor: color.orange.dark + '1A',
    borderWidth: 1,
    borderColor: color.orange.dark + '33',
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: color.orange.dark,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
  },
  skipButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    ...typography.caption,
    color: color.brown.dark,
  },
});
