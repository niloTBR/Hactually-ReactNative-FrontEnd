/**
 * Welcome Screen - Onboarding with video carousel
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions, Animated, Image, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { LogoIcon } from '../../components/Logo';
import { colors, spacing, borderRadius, fontFamily } from '../../theme';

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

const SLIDES = [
  { lines: ["You've", 'shared a look with someone before.'], video: require('../../../assets/videos/Video_1.mp4') },
  { lines: ["The moment was real. Acting on it wasn't easy."], video: require('../../../assets/videos/Video_2.mp4') },
  { lines: ['continue the moment', 'with hactually'], hasProfiles: true },
  { lines: ['Meet the ones', 'you almost missed!'], video: require('../../../assets/videos/Video_4.mp4'), isFinal: true },
];

const IMAGE_SIZE = 96;
const IMAGE_GAP = 12;
const SET_WIDTH = PROFILES.length * (IMAGE_SIZE + IMAGE_GAP);

// Marquee row
const ProfileRow = ({ reverse }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: reverse ? 35000 : 30000, useNativeDriver: true }),
      { resetBeforeIteration: true }
    ).start();
  }, []);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-SET_WIDTH, 0] : [0, -SET_WIDTH],
  });

  return (
    <View style={styles.marquee}>
      <Animated.View style={[styles.marqueeRow, { transform: [{ translateX }] }]}>
        {[...PROFILES, ...PROFILES, ...PROFILES].map((img, i) => (
          <Image key={i} source={img} style={styles.profileImg} />
        ))}
      </Animated.View>
    </View>
  );
};

// Animated text
const BlurText = ({ lines, center, slideIndex }) => {
  const [anims, setAnims] = useState([]);

  useEffect(() => {
    const words = lines.flatMap(l => l.split(' '));
    const newAnims = words.map(() => new Animated.Value(0));
    setAnims(newAnims);
    newAnims.forEach((a, i) => setTimeout(() => Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }).start(), i * 80));
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
};

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
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setSlide(n);
      setProgress(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  }, []);

  const handleTap = (e) => {
    let x = 0, w = width;
    if (Platform.OS === 'web' && e.nativeEvent?.target?.getBoundingClientRect) {
      const rect = e.nativeEvent.target.getBoundingClientRect();
      w = rect.width;
      x = e.nativeEvent.clientX - rect.left;
    } else {
      x = e.nativeEvent?.locationX ?? 0;
    }
    if (x < w / 2 && slide > 0) goTo(slide - 1);
    else if (x >= w / 2 && slide < SLIDES.length - 1) goTo(slide + 1);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleTap}
      onPressIn={() => { setPaused(true); videoRef.current?.pauseAsync(); }}
      onPressOut={() => { setPaused(false); videoRef.current?.playAsync(); }}
    >
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

      {!current.video && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.blue.default }]} />}

      <SafeAreaView style={styles.safe}>
        <View style={styles.progressRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={styles.progressBar}>
              <View style={[styles.progressFill, { width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%' }]} />
            </View>
          ))}
        </View>

        <View style={styles.logo}><LogoIcon size={48} /></View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {current.hasProfiles ? (
            <View style={styles.profilesWrap}>
              <View style={styles.rows}>
                <ProfileRow /><ProfileRow reverse />
                <LinearGradient colors={['transparent', colors.blue.default]} style={styles.fadeOverlay} pointerEvents="none" />
              </View>
              <View style={styles.center}><BlurText lines={current.lines} center slideIndex={slide} /></View>
              <View style={styles.rows}>
                <LinearGradient colors={[colors.blue.default, 'transparent']} style={styles.fadeOverlay} pointerEvents="none" />
                <ProfileRow /><ProfileRow reverse />
              </View>
            </View>
          ) : (
            <View style={styles.textWrap}><BlurText lines={current.lines} slideIndex={slide} /></View>
          )}
        </Animated.View>

        {current.isFinal && (
          <View style={styles.ctaWrap}>
            <Pressable style={styles.cta} onPress={() => navigation.navigate('AuthOptions')}>
              <LinearGradient colors={['#C94A2F', '#E05A3D', '#C94A2F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <View style={styles.ctaInner}><Text style={styles.ctaText}>Start Spotting</Text></View>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blue.default },
  safe: { flex: 1 },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 32, paddingVertical: 32 },
  progressBar: { flex: 1, height: 4, borderRadius: 99, backgroundColor: 'rgba(200,227,244,0.3)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.blue.light, borderRadius: 99 },
  logo: { paddingHorizontal: 32 },
  content: { flex: 1 },
  profilesWrap: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing[8] },
  rows: { gap: 16, position: 'relative' },
  fadeOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  center: { paddingHorizontal: 32, alignItems: 'center' },
  textWrap: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 32 },
  textLine: { flexDirection: 'row', flexWrap: 'wrap' },
  centerLine: { justifyContent: 'center' },
  centerText: { alignItems: 'center' },
  slideText: { fontSize: 40, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.blue.light, lineHeight: 50 },
  brand: { color: colors.orange.default },
  marquee: { overflow: 'hidden', height: 96 },
  marqueeRow: { flexDirection: 'row', gap: IMAGE_GAP },
  profileImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: 'rgba(200,227,244,0.25)' },
  ctaWrap: { padding: 32 },
  cta: { height: 48, borderRadius: 99, overflow: 'hidden' },
  ctaInner: { position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 11, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.blue.light, textTransform: 'uppercase', letterSpacing: 3 },
});
