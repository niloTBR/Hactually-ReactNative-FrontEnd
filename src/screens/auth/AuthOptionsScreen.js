/**
 * Auth Options Screen - Email, Google, Apple sign-in
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Dimensions, Animated, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowRight } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontFamily } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { validateEmail } from '../../lib/utils';
import { LogoIcon, GoogleIcon, AppleIcon } from '../../components';

const { width } = Dimensions.get('window');

const PROFILES = [
  require('../../../assets/images/profiles/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg'),
  require('../../../assets/images/profiles/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'),
  require('../../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../../assets/images/profiles/brooke-cagle-KriecpTIWgY-unsplash.jpg'),
  require('../../../assets/images/profiles/natalia-blauth-gw2udfGe_tM-unsplash.jpg'),
  require('../../../assets/images/profiles/jakob-owens-lkMJcGDZLVs-unsplash.jpg'),
  require('../../../assets/images/profiles/rayul-_M6gy9oHgII-unsplash.jpg'),
  require('../../../assets/images/profiles/arrul-lin-sYhUhse5uT8-unsplash.jpg'),
];

const SET_WIDTH = PROFILES.length * 108; // 96 + 12 gap

const ProfileRow = ({ reverse }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: reverse ? 35000 : 30000, useNativeDriver: true }),
      { resetBeforeIteration: true }
    ).start();
  }, []);

  return (
    <View style={styles.marquee}>
      <Animated.View style={[styles.marqueeRow, { transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: reverse ? [-SET_WIDTH, 0] : [0, -SET_WIDTH] }) }] }]}>
        {[...PROFILES, ...PROFILES, ...PROFILES].map((img, i) => <Image key={i} source={img} style={styles.profileImg} />)}
      </Animated.View>
    </View>
  );
};

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

  const animStyle = (i) => ({ opacity: fadeAnims[i], transform: [{ translateY: fadeAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] });

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.logoRow}>
              <LogoIcon size={44} />
              <Text style={styles.logoText}>hactually</Text>
            </View>

            <View style={styles.profiles}>
              <ProfileRow />
              <ProfileRow reverse />
            </View>

            <View style={styles.bottom}>
              {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}

              <Text style={styles.title}>continue the moment</Text>

              <Animated.View style={[styles.inputRow, animStyle(0)]}>
                <Mail size={16} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onSubmitEditing={handleEmailSubmit}
                />
                <TouchableOpacity onPress={handleEmailSubmit} disabled={isLoading || !email.trim()} style={[styles.submitBtn, (!email.trim() || isLoading) && { opacity: 0.3 }]}>
                  {isLoading ? <ActivityIndicator size="small" color="white" /> : <ArrowRight size={16} color="white" />}
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[styles.divider, animStyle(1)]}>
                <View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} />
              </Animated.View>

              <Animated.View style={animStyle(2)}>
                <TouchableOpacity onPress={() => handleOAuth('google')} style={styles.oauth}>
                  <GoogleIcon size={20} /><Text style={styles.oauthText}><Text style={styles.oauthSmall}>continue with </Text>Google</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={animStyle(3)}>
                <TouchableOpacity onPress={() => handleOAuth('apple')} style={styles.oauth}>
                  <AppleIcon size={24} /><Text style={styles.oauthText}><Text style={styles.oauthSmall}>continue with </Text>Apple</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.Text style={[styles.terms, animStyle(4)]}>
                By continuing, you agree to our{'\n'}Terms of Service and Privacy Policy
              </Animated.Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {showBlinds && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {blindsAnims.map((a, i) => (
            <Animated.View key={i} style={[StyleSheet.absoluteFill, { backgroundColor: ['#4752C4', '#5865F2', 'rgba(88,101,242,0.8)', 'rgba(88,101,242,0.6)', 'rgba(88,101,242,0.4)'][i], zIndex: 5 - i, transform: [{ translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, width] }) }] }]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blue.default },
  scroll: { flexGrow: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingTop: 32, gap: 12 },
  logoText: { fontSize: 28, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.blue.light, marginTop: 5 },
  profiles: { flex: 1, justifyContent: 'center', gap: 16, paddingVertical: spacing[4] },
  marquee: { overflow: 'hidden', height: 96 },
  marqueeRow: { flexDirection: 'row', gap: 12 },
  profileImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: 'rgba(200,227,244,0.25)' },
  bottom: { paddingHorizontal: 32, paddingBottom: 32 },
  error: { backgroundColor: 'rgba(224,90,61,0.2)', padding: 12, borderRadius: 99, marginBottom: 16 },
  errorText: { color: colors.orange.light, fontSize: 12, fontFamily: fontFamily.bold, textAlign: 'center' },
  title: { fontSize: 28, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.blue.light, marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99, paddingLeft: 16, paddingRight: 8, gap: 12 },
  input: { flex: 1, fontSize: 14, fontFamily: fontFamily.regular, color: 'white', height: '100%', outlineStyle: 'none' },
  submitBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 16 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  or: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: fontFamily.bold, textTransform: 'uppercase', letterSpacing: 2 },
  oauth: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: 'rgba(200,227,244,0.15)', borderRadius: 99, borderWidth: 1, borderColor: 'rgba(200,227,244,0.2)', marginBottom: 12, gap: 8 },
  oauthText: { fontSize: 14, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.blue.light },
  oauthSmall: { fontSize: 12, fontFamily: fontFamily.regular, fontWeight: '400' },
  terms: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: fontFamily.medium, textAlign: 'center', marginTop: 24, lineHeight: 18 },
});
