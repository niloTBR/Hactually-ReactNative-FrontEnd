/**
 * Location Permission Screen
 * Modal popup for requesting location access
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { MapPin, X, Check } from 'lucide-react-native';
import * as Location from 'expo-location';
import { color, spacing, typography, radius } from '../../theme';
import { Button, LogoMark } from '../../components';
import { useAuthStore } from '../../store/authStore';

export default function LocationScreen({ navigation }) {
  const { updateProfile, setOnboardingStep } = useAuthStore();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(true);

  // Fade in/out animation for logo
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkPermission();

    // Start blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
        setVisible(false);
      } else {
        setError('Location access was denied');
      }
    } catch (err) {
      console.error('Location error:', err);
      setError('Failed to get location');
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
    setVisible(false);
  };

  const benefits = [
    'Discover who\'s nearby right now',
    'Get notified when someone checks in',
    'We never share your exact location',
  ];

  const themeColor = color.green.light;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close button */}
          <TouchableOpacity onPress={handleSkip} style={styles.closeButton}>
            <X size={18} color={themeColor + '80'} />
          </TouchableOpacity>

          {/* Animated Logo */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
            <LogoMark size="lg" colorScheme="light" colorVariant="green" />
          </Animated.View>

          {/* Content */}
          <Text style={styles.title}>one last thing</Text>
          <Text style={styles.subtitle}>
            Enable location to see who's{'\n'}actually around you
          </Text>

          {/* Benefits */}
          <View style={styles.benefits}>
            {benefits.map((text, index) => (
              <View key={index} style={styles.benefitRow}>
                <View style={styles.checkIcon}>
                  <Check size={12} color={color.green.dark} strokeWidth={3} />
                </View>
                <Text style={styles.benefitText}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Error */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Primary Button */}
          <View style={styles.buttons}>
            {permissionStatus === 'denied' ? (
              <Button
                variant="outline-gradient"
                color="dark"
                fillColor={color.green.dark}
                size="lg"
                fullWidth
                onPress={handleOpenSettings}
              >
                Open Settings
              </Button>
            ) : (
              <Button
                variant="outline-gradient"
                color="dark"
                fillColor={color.green.dark}
                size="lg"
                fullWidth
                onPress={handleRequestLocation}
                disabled={isRequesting}
                loading={isRequesting}
                leftIcon={<MapPin size={18} />}
              >
                Enable Location
              </Button>
            )}
          </View>

          {/* Skip Link */}
          <TouchableOpacity onPress={handleSkip} style={styles.linkButton}>
            <Text style={styles.linkText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  popup: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: color.green.dark,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: color.green.light,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: color.green.light + 'CC',
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefits: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: color.green.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    ...typography.caption,
    color: color.green.light,
    flex: 1,
  },
  errorText: {
    ...typography.caption,
    color: color.error.light,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttons: {
    width: '100%',
  },
  linkButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.link,
    color: color.green.light,
  },
});
