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
import { colors, spacing, fontSize, borderRadius } from '../../theme';
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
          <ChevronLeft size={20} color={colors.brown.default} />
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
            <MapPin size={32} color={colors.white} strokeWidth={1.5} />
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          {benefits.map((item, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <item.icon
                  size={20}
                  color={colors.brown.default}
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
            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRequestLocation}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleRequestLocation}
            disabled={isRequesting}
            style={styles.gradientButton}
            activeOpacity={0.8}
          >
            {isRequesting ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <View style={styles.buttonContent}>
                <MapPin size={16} color={colors.black} />
                <Text style={styles.gradientButtonText}>Allow Location</Text>
              </View>
            )}
          </TouchableOpacity>
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
    backgroundColor: colors.brown.lighter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
    marginBottom: spacing[8],
  },
  illustration: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
  },
  pulseOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.blue.default + '1A',
  },
  pulseInner: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.blue.default + '26',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefits: {
    gap: spacing[4],
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: fontSize.sm,
    color: colors.black,
  },
  errorContainer: {
    marginTop: spacing[6],
    backgroundColor: colors.orange.default + '1A',
    borderWidth: 1,
    borderColor: colors.orange.default + '33',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.orange.default,
  },
  bottomSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
    gap: spacing[3],
  },
  primaryButton: {
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.blue.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.white,
  },
  secondaryButton: {
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.black,
  },
  gradientButton: {
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.orange.default,
    backgroundColor: colors.brown.lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  gradientButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.black,
  },
  skipButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
  },
});
