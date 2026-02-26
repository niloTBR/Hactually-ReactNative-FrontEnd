/**
 * Welcome Screen - Onboarding with video carousel
 */
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo, ProfileMarquee, Button } from '../../components';
import { color, spacing, typography } from '../../theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  { lines: ["You've", 'shared a look with someone before.'], video: require('../../../assets/videos/Video_1.mp4') },
  { lines: ["The moment was real. Acting on it wasn't easy."], video: require('../../../assets/videos/Video_2.mp4') },
  { lines: ['continue the moment', 'with hactually'], hasProfiles: true },
  { lines: ['Meet the ones', 'you almost missed!'], video: require('../../../assets/videos/Video_4.mp4'), isFinal: true },
];

// Animated text component
const AnimatedText = memo(({ lines, center, slideIndex }) => {
  const [anims, setAnims] = useState([]);

  useEffect(() => {
    const words = lines.flatMap(l => l.split(' '));
    const newAnims = words.map(() => new Animated.Value(0));
    setAnims(newAnims);
    newAnims.forEach((a, i) => setTimeout(() =>
      Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }).start(), i * 80
    ));
    return () => newAnims.forEach(a => a.stopAnimation());
  }, [slideIndex, lines]);

  let idx = 0;
  return (
    <View style={center && styles.centerText}>
      {lines.map((line, li) => (
        <View key={li} style={[styles.textLine, center && styles.centerLine]}>
          {line.split(' ').map((word, wi) => {
            const a = anims[idx++];
            return (
              <Animated.Text
                key={wi}
                style={[
                  styles.slideText,
                  center && styles.slideTextCenter,
                  word.toLowerCase() === 'hactually' && styles.brand,
                  a && { opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
                ]}
              >
                {word}{' '}
              </Animated.Text>
            );
          })}
        </View>
      ))}
    </View>
  );
});

export default function WelcomeScreen({ navigation }) {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const startTime = useRef(Date.now());

  const current = SLIDES[slide];

  useEffect(() => {
    if (paused) return;
    startTime.current = Date.now();
    const interval = setInterval(() => {
      const p = Math.min(((Date.now() - startTime.current) / 5000) * 100, 100);
      setProgress(p);
      if (p >= 100 && slide < SLIDES.length - 1) goTo(slide + 1);
    }, 16);
    return () => clearInterval(interval);
  }, [slide, paused]);

  const goTo = useCallback((n) => {
    if (n < 0 || n >= SLIDES.length) return;
    // Change slide immediately and animate in - more reliable than waiting for callback
    setSlide(n);
    setProgress(0);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handlePrev = useCallback(() => {
    if (slide > 0) goTo(slide - 1);
  }, [slide, goTo]);

  const handleNext = useCallback(() => {
    if (slide < SLIDES.length - 1) goTo(slide + 1);
  }, [slide, goTo]);

  return (
    <View style={styles.container}>
      {current.video && (
        <View style={StyleSheet.absoluteFill}>
          <Video
            ref={videoRef}
            source={current.video}
            style={StyleSheet.absoluteFill}
            videoStyle={Platform.OS === 'web' ? { width: '100%', height: '100%', objectFit: 'cover', objectPosition: current.isFinal ? 'right center' : 'center' } : undefined}
            resizeMode={ResizeMode.COVER}
            shouldPlay={!paused}
            isLooping
            isMuted
            rate={current.isFinal ? 0.5 : 1}
          />
          <LinearGradient colors={['transparent', 'rgba(88,101,242,0.6)', 'rgba(88,101,242,0.9)']} locations={[0.4, 0.7, 1]} style={StyleSheet.absoluteFill} />
        </View>
      )}

      {!current.video && <View style={[StyleSheet.absoluteFill, { backgroundColor: color.blue.dark }]} />}

      <SafeAreaView style={styles.safe}>
        <View style={styles.progressRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={styles.progressBar}>
              <View style={[styles.progressFill, { width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%' }]} />
            </View>
          ))}
        </View>

        <View style={styles.logo}><Logo size={48} color={color.blue.light} /></View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]} pointerEvents="box-none">
          {current.hasProfiles ? (
            <View style={styles.profilesWrap}>
              <View style={styles.rows}>
                <ProfileMarquee />
                <ProfileMarquee reverse speed={35000} />
                <LinearGradient colors={['transparent', color.blue.dark]} style={styles.fadeOverlay} />
              </View>
              <View style={styles.center}>
                <AnimatedText lines={current.lines} center slideIndex={slide} />
              </View>
              <View style={styles.rows}>
                <LinearGradient colors={[color.blue.dark, 'transparent']} style={styles.fadeOverlay} />
                <ProfileMarquee />
                <ProfileMarquee reverse speed={35000} />
              </View>
            </View>
          ) : (
            <View style={[styles.textWrap, !current.isFinal && styles.textWrapPadded]}>
              <AnimatedText lines={current.lines} slideIndex={slide} />
            </View>
          )}
        </Animated.View>

        {current.isFinal && (
          <View style={styles.ctaWrap}>
            <Button variant="solid" color="orange" size="lg" onPress={() => navigation.navigate('AuthOptions')}>
              Start Spotting
            </Button>
          </View>
        )}
      </SafeAreaView>

      {/* Tap zones for navigation */}
      <View style={styles.tapZones} pointerEvents="box-none">
        <Pressable
          style={styles.tapLeft}
          onPress={handlePrev}
          onPressIn={() => { setPaused(true); videoRef.current?.pauseAsync(); }}
          onPressOut={() => { setPaused(false); videoRef.current?.playAsync(); }}
        />
        <Pressable
          style={styles.tapRight}
          onPress={handleNext}
          onPressIn={() => { setPaused(true); videoRef.current?.pauseAsync(); }}
          onPressOut={() => { setPaused(false); videoRef.current?.playAsync(); }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.blue.dark },
  safe: { flex: 1 },
  tapZones: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 100, flexDirection: 'row' },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
  progressRow: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing['2xl'], paddingVertical: spacing['2xl'] },
  progressBar: { flex: 1, height: 4, borderRadius: 99, backgroundColor: 'rgba(200,227,244,0.3)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: color.blue.light, borderRadius: 99 },
  logo: { paddingHorizontal: spacing['2xl'] },
  content: { flex: 1 },
  profilesWrap: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing['2xl'] },
  rows: { gap: spacing.lg, position: 'relative' },
  fadeOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  center: { paddingHorizontal: spacing['2xl'], alignItems: 'center' },
  textWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: spacing['2xl'] },
  textWrapPadded: { paddingBottom: spacing['2xl'] },
  textLine: { flexDirection: 'row', flexWrap: 'wrap' },
  centerLine: { justifyContent: 'center' },
  centerText: { alignItems: 'center' },
  slideText: { ...typography.h1, color: color.blue.light },
  slideTextCenter: { ...typography.h2 },
  brand: { color: color.orange.dark },
  ctaWrap: { padding: spacing['2xl'] },
});
