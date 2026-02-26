/**
 * Auth Options Screen - Email, Google, Apple sign-in
 * Green theme with ghost-style inputs
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { color, spacing, typography, radius, GhostTheme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { validateEmail } from '../../lib/utils';
import { Logo, GoogleIcon, AppleIcon, ProfileMarquee, Button, GhostInput } from '../../components';

const { width } = Dimensions.get('window');

export default function AuthOptionsScreen({ navigation, route }) {
  const { login, sendOTP, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showBlinds, setShowBlinds] = useState(route?.params?.showTransition ?? true);
  const fadeAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const blindsAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (showBlinds) {
      Animated.stagger(50, blindsAnims.map(a => Animated.timing(a, { toValue: 1, duration: 350, useNativeDriver: true }))).start(() => {
        setShowBlinds(false);
        startFadeIn();
      });
    } else {
      startFadeIn();
    }
  }, []);

  const startFadeIn = () => {
    Animated.stagger(100, fadeAnims.map(a => Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }))).start();
  };

  const handleEmailSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Please enter your email');
    if (!validateEmail(email)) return setError('Please enter a valid email');
    const result = await sendOTP(email);
    if (result.success) navigation.navigate('OTP', { email, devOTP: result.devOTP });
    else setError(result.error || 'Failed to send code');
  };

  const handleOAuth = async (provider) => {
    const result = await login(provider, { email: `user_${Date.now()}@${provider}.com`, name: `${provider} User` });
    if (result.success && (result.isNewUser || !result.user.onboardingComplete)) navigation.navigate('ProfileSetup');
    else if (!result.success) setError(result.error || 'Login failed');
  };

  const animStyle = (i) => ({
    opacity: fadeAnims[i],
    transform: [{ translateY: fadeAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.logoRow}>
              <Logo size={44} color={color.green.light} />
              <Text style={styles.logoText}>hactually</Text>
            </View>

            <View style={styles.profiles}>
              <ProfileMarquee />
              <ProfileMarquee reverse speed={35000} />
            </View>

            <View style={styles.bottom}>
              <Text style={styles.title}>continue the moment</Text>

              <Animated.View style={animStyle(0)}>
                <GhostTheme themeColor={color.green.light} isDark={true}>
                  <GhostInput
                    value={email}
                    onChangeText={(text) => { setEmail(text); setError(''); }}
                    placeholder="Enter your email"
                    leftIcon={<Mail />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onSubmit={handleEmailSubmit}
                    loading={isLoading}
                    error={error}
                  />
                </GhostTheme>
              </Animated.View>

              <Animated.View style={[styles.divider, animStyle(1)]}>
                <View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} />
              </Animated.View>

              <Animated.View style={animStyle(2)}>
                <Button
                  variant="ghost"
                  themeColor={color.green.light}
                  leftIcon={<GoogleIcon size={20} />}
                  onPress={() => handleOAuth('google')}
                  fullWidth
                >
                  Continue with Google
                </Button>
              </Animated.View>

              <Animated.View style={[animStyle(3), { marginTop: spacing.md }]}>
                <Button
                  variant="ghost"
                  themeColor={color.green.light}
                  leftIcon={<AppleIcon size={24} />}
                  onPress={() => handleOAuth('apple')}
                  fullWidth
                >
                  Continue with Apple
                </Button>
              </Animated.View>

              <Animated.Text style={[styles.terms, animStyle(4)]}>
                By continuing, you agree to our{'\n'}<Text style={styles.termsBold}>Terms of Service</Text> and <Text style={styles.termsBold}>Privacy Policy</Text>
              </Animated.Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {showBlinds && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {blindsAnims.map((a, i) => (
            <Animated.View
              key={i}
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: [color.green.dark, color.green.dark, 'rgba(74,124,124,0.8)', 'rgba(74,124,124,0.6)', 'rgba(74,124,124,0.4)'][i],
                  zIndex: 5 - i,
                  transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, width] }) }]
                }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.green.dark },
  scroll: { flexGrow: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['2xl'], paddingTop: spacing['2xl'], gap: spacing.md },
  logoText: { ...typography.h2, color: color.green.light, marginTop: 5 },
  profiles: { flex: 1, justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  bottom: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing['2xl'] },
  title: { ...typography.h2, color: color.green.light, marginBottom: spacing.xl },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg, gap: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: color.green.light + '50' },
  or: { ...typography.caption, fontWeight: '700', color: color.green.light + '80', textTransform: 'uppercase', letterSpacing: 2 },
  terms: { ...typography.caption, color: color.green.light + '80', textAlign: 'center', marginTop: spacing.xl },
  termsBold: { fontWeight: '700' },
});
