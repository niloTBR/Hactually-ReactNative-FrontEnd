/**
 * OTP Verification Screen
 * Dark green theme with ghost-style inputs
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, RefreshCw } from 'lucide-react-native';
import { color, spacing, typography, radius } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { OTPInput, Logo, GradientBackground } from '../../components';

export default function OTPScreen({ navigation, route }) {
  const { email, devOTP } = route.params || {};
  const { verifyOTP, sendOTP, isLoading } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (code) => {
    setError('');
    const result = await verifyOTP(email, code);

    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigation.navigate('ProfileSetup');
      }
    } else {
      setError(result.error || 'Invalid code. Please try again.');
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isLoading) return;

    const result = await sendOTP(email);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ChevronLeft size={24} color={color.orange.dark} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <Logo size={32} color={color.orange.dark} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>enter the code</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* OTP Input - using component library */}
        <View style={styles.otpContainer}>
          <OTPInput
            value={otp}
            onChange={(val) => { setOtp(val); setError(''); }}
            onComplete={handleVerify}
            disabled={isLoading}
            error={!!error}
            variant="ghost"
            themeColor={color.orange.dark}
          />
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>
              Resend code in{' '}
              <Text style={styles.resendTimerBold}>{resendTimer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={isLoading}
              style={styles.resendButton}
              activeOpacity={0.7}
            >
              <RefreshCw size={14} color={color.orange.dark} />
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dev OTP helper - Footer */}
      {devOTP && (
        <View style={styles.devOtpContainer}>
          <Text style={styles.devOtpText}>
            Dev Mode - Code:{' '}
            <Text style={styles.devOtpCode}>{devOTP}</Text>
          </Text>
        </View>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={color.orange.dark} />
        </View>
      )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerSpacer: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: color.orange.dark + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  title: {
    ...typography.h2,
    color: color.beige,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: color.beige + '80',
    marginBottom: spacing['2xl'],
  },
  devOtpContainer: {
    backgroundColor: color.orange.dark + '20',
    borderWidth: 1,
    borderColor: color.orange.dark + '40',
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    alignSelf: 'center',
  },
  devOtpText: {
    ...typography.caption,
    color: color.orange.dark,
    textAlign: 'center',
  },
  devOtpCode: {
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    backgroundColor: color.error.dark + '33',
    borderRadius: radius.full,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: color.error.light,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: spacing['2xl'],
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimer: {
    ...typography.caption,
    color: color.orange.dark + '80',
  },
  resendTimerBold: {
    fontWeight: '700',
    color: color.orange.dark,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: color.orange.dark + '20',
  },
  resendButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: color.orange.dark,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.charcoal + 'E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
