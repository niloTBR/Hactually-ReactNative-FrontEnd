/**
 * Auth Options Screen
 * Email, Google, and Apple sign-in options
 * Features: Blinds transition, blur text reveal, marquee profiles
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, fontSize, borderRadius, fontFamily } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { validateEmail } from '../../lib/utils';
import { LogoIcon } from '../../components/Logo';

const { width, height } = Dimensions.get('window');

// Profile images for marquee
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

// Blinds transition layers
const LAYERS = [
  colors.blue.dark,
  colors.blue.default,
  'rgba(88,101,242,0.8)',
  'rgba(88,101,242,0.6)',
  'rgba(88,101,242,0.4)',
];

// Google Icon
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill={colors.blue.light}
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill={colors.blue.light}
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill={colors.blue.light}
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill={colors.blue.light}
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

// Apple Icon
const AppleIcon = () => (
  <Svg width={24} height={24} fill={colors.blue.light} viewBox="0 0 24 24">
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
);

// Animated blur text reveal
const BlurTextReveal = ({ words }) => {
  const animations = useRef(words.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, staggeredAnimations).start();
  }, []);

  return (
    <View style={styles.blurTextContainer}>
      {words.map((word, index) => {
        const opacity = animations[index];
        const scale = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        return (
          <Animated.Text
            key={index}
            style={[
              styles.titleWord,
              {
                opacity,
                transform: [{ scale }],
              },
            ]}
          >
            {word}{' '}
          </Animated.Text>
        );
      })}
    </View>
  );
};

// Marquee row component with infinite loop
// Calculate exact width of one set of images for seamless loop
const IMAGE_SIZE = 96;
const IMAGE_GAP = 12;
const SINGLE_SET_WIDTH = PROFILES.length * (IMAGE_SIZE + IMAGE_GAP);

const ProfileRow = ({ reverse = false }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: reverse ? 35000 : 30000,
        useNativeDriver: true,
        isInteraction: false,
      }),
      { resetBeforeIteration: true }
    ).start();
  }, []);

  // Translate exactly one set width for seamless infinite loop
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-SINGLE_SET_WIDTH, 0] : [0, -SINGLE_SET_WIDTH],
  });

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View
        style={[styles.marqueeRow, { transform: [{ translateX }] }]}
      >
        {[...PROFILES, ...PROFILES, ...PROFILES].map((img, i) => (
          <Image key={i} source={img} style={styles.profileImage} />
        ))}
      </Animated.View>
    </View>
  );
};

// Blinds transition overlay
const BlindsTransition = ({ visible, onComplete }) => {
  const layerAnims = useRef(LAYERS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      // Animate layers sliding out to the right
      const animations = layerAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          delay: index * 50,
          useNativeDriver: true,
        })
      );

      Animated.stagger(50, animations).start(() => {
        onComplete && onComplete();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.blindsContainer} pointerEvents="none">
      {LAYERS.map((color, index) => {
        const translateX = layerAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, width],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.blindsLayer,
              {
                backgroundColor: color,
                zIndex: LAYERS.length - index,
                transform: [{ translateX }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default function AuthOptionsScreen({ navigation, route }) {
  const { login, sendOTP, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showBlinds, setShowBlinds] = useState(route?.params?.showTransition ?? true);

  // Fade in animations for form elements
  const fadeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Start fade-in animations after blinds complete or immediately if no blinds
    const startAnimations = () => {
      const animations = fadeAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        })
      );
      Animated.stagger(100, animations).start();
    };

    if (!showBlinds) {
      startAnimations();
    }
  }, [showBlinds]);

  const handleBlindsComplete = () => {
    setShowBlinds(false);
    // Start content animations
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  };

  const handleEmailSubmit = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    const result = await sendOTP(email);

    if (result.success) {
      navigation.navigate('OTP', {
        email,
        devOTP: result.devOTP,
      });
    } else {
      setError(result.error || 'Failed to send code');
    }
  };

  const handleOAuth = async (provider) => {
    setError('');

    const result = await login(provider, {
      email: `user_${Date.now()}@${provider}.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    });

    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigation.navigate('ProfileSetup');
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const getTranslateY = (index) => {
    return fadeAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo with icon and text */}
            <View style={styles.logoContainer}>
              <LogoIcon size={44} />
              <Text style={styles.logoText}>hactually</Text>
            </View>

            {/* Profile images marquee */}
            <View style={styles.profilesContainer}>
              <ProfileRow />
              <ProfileRow reverse />
            </View>

            {/* Bottom section */}
            <View style={styles.bottomSection}>
              {/* Error message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Title with blur reveal */}
              <BlurTextReveal words={['continue', 'the', 'moment']} />

              {/* Email input */}
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    opacity: fadeAnims[0],
                    transform: [{ translateY: getTranslateY(0) }],
                  },
                ]}
              >
                <Mail
                  size={16}
                  color="rgba(255,255,255,0.5)"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  style={styles.input}
                  onSubmitEditing={handleEmailSubmit}
                />
                <TouchableOpacity
                  onPress={handleEmailSubmit}
                  disabled={isLoading || !email.trim()}
                  style={[
                    styles.submitButton,
                    (!email.trim() || isLoading) && styles.submitButtonDisabled,
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <ArrowRight size={16} color="white" />
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <Animated.View
                style={[
                  styles.divider,
                  {
                    opacity: fadeAnims[1],
                    transform: [{ translateY: getTranslateY(1) }],
                  },
                ]}
              >
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </Animated.View>

              {/* OAuth buttons */}
              <Animated.View
                style={{
                  opacity: fadeAnims[2],
                  transform: [{ translateY: getTranslateY(2) }],
                }}
              >
                <TouchableOpacity
                  onPress={() => handleOAuth('google')}
                  disabled={isLoading}
                  style={styles.oauthButton}
                  activeOpacity={0.8}
                >
                  <GoogleIcon />
                  <Text style={styles.oauthButtonText}>
                    <Text style={styles.oauthButtonSmall}>continue with </Text>
                    Google
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: fadeAnims[3],
                  transform: [{ translateY: getTranslateY(3) }],
                }}
              >
                <TouchableOpacity
                  onPress={() => handleOAuth('apple')}
                  disabled={isLoading}
                  style={styles.oauthButton}
                  activeOpacity={0.8}
                >
                  <AppleIcon />
                  <Text style={styles.oauthButtonText}>
                    <Text style={styles.oauthButtonSmall}>continue with </Text>
                    Apple
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Terms */}
              <Animated.Text
                style={[
                  styles.terms,
                  {
                    opacity: fadeAnims[4],
                    transform: [{ translateY: getTranslateY(4) }],
                  },
                ]}
              >
                By continuing, you agree to our{'\n'}Terms of Service and Privacy
                Policy
              </Animated.Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Blinds transition overlay */}
      <BlindsTransition visible={showBlinds} onComplete={handleBlindsComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue.default,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 12,
  },
  logoText: {
    fontSize: 28, // Icon is 2x the cap height of H
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.light,
    marginTop: 5, // Offset to center on baseline (not including 'y' descender)
  },
  profilesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    paddingVertical: spacing[4],
  },
  marqueeContainer: {
    overflow: 'hidden',
    height: 96,
  },
  marqueeRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(200, 227, 244, 0.25)',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  errorContainer: {
    backgroundColor: 'rgba(224, 90, 61, 0.2)',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
    marginBottom: spacing[4],
  },
  errorText: {
    color: colors.orange.light,
    fontSize: 12,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    textAlign: 'center',
  },
  blurTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing[6],
  },
  titleWord: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
  },
  inputIcon: {
    marginRight: spacing[3],
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: 'white',
    height: '100%',
    outlineStyle: 'none',
  },
  submitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[4],
    gap: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: 'rgba(200, 227, 244, 0.15)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(200, 227, 244, 0.2)',
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  oauthButtonText: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.light,
  },
  oauthButtonSmall: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  terms: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: spacing[6],
    lineHeight: 18,
  },
  blindsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  blindsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
