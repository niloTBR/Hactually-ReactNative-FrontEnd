/**
 * OTP Verification Screen
 * 6-digit code input with auto-verify
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, RefreshCw } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export default function OTPScreen({ navigation, route }) {
  const { email, devOTP } = route.params || {};
  const { verifyOTP, sendOTP, isLoading } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleChange = (index, value) => {
    // Only accept digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (value && index === 5 && newOtp.every((d) => d)) {
      Keyboard.dismiss();
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code) => {
    setError('');
    const result = await verifyOTP(email, code);

    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigation.navigate('ProfileSetup');
      }
      // If onboarding complete, AppNavigator will handle navigation
    } else {
      setError(result.error || 'Invalid code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isLoading) return;

    const result = await sendOTP(email);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ChevronLeft size={24} color={colors.brown.default} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter the code</Text>
        <Text style={styles.subtitle}>We sent a code to {email}</Text>

        {/* Dev OTP helper */}
        {devOTP && (
          <View style={styles.devOtpContainer}>
            <Text style={styles.devOtpText}>
              Dev Mode - Code:{' '}
              <Text style={styles.devOtpCode}>{devOTP}</Text>
            </Text>
          </View>
        )}

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
            />
          ))}
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
              <RefreshCw size={14} color={colors.blue.default} />
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue.default} />
        </View>
      )}
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
    color: colors.blue.default,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
    marginBottom: spacing[8],
  },
  devOtpContainer: {
    backgroundColor: colors.blue.light + '4D',
    borderWidth: 1,
    borderColor: colors.blue.default + '33',
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  devOtpText: {
    fontSize: fontSize.xs,
    color: colors.blue.default,
    textAlign: 'center',
  },
  devOtpCode: {
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    backgroundColor: colors.orange.default + '1A',
    borderWidth: 1,
    borderColor: colors.orange.default + '33',
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.orange.default,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[1.5],
    marginBottom: spacing[8],
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    backgroundColor: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.black,
    ...shadows.card,
  },
  otpInputFilled: {
    borderColor: colors.blue.default,
  },
  otpInputError: {
    borderColor: colors.orange.default,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimer: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
  },
  resendTimerBold: {
    fontWeight: '700',
    color: colors.black,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  resendButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.blue.default,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.brown.lighter + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
