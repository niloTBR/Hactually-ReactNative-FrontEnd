/**
 * VenueCheckInScreen - Full-screen venue check-in experience
 * Converted from Hactually 2.0 React app VenueModal
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, spacing, radius, typography } from '../theme';
import { ShimmerText, Button } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// SVG mask from Hactually 2.0 — used as CSS mask-image on web
// Original SVG from Hactually 2.0
// Original shape, left edge extended to -60 so shape is wider on left, right-aligned
const VENUE_MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 0 252 128"><path d="M160,8.58V0H-60v128h156c11.66,0,22.58-3.13,32-8.58v8.58h64V0c-11.66,0-22.58,3.13-32,8.58Z" fill="white"/></svg>`;
const VENUE_MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(VENUE_MASK_SVG)}")`;

// Venue images from Hactually 2.0 project
const VENUE_IMAGES = {
  '1': require('../../assets/venues/1.jpg'),
  '2': require('../../assets/venues/2.jpg'),
  '3': require('../../assets/venues/3.webp'),
  '4': require('../../assets/venues/4.jpg'),
  '5': require('../../assets/venues/5.jpeg'),
  '6': require('../../assets/venues/6.jpg'),
};

const PROFILE_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
];

const AVATAR_SIZE = 72;

// Scrolling marquee — speed adjusts smoothly via ref polling
function MarqueeRow({ photos, reverse, speedRef, blurRef }) {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const totalWidth = photos.length * (AVATAR_SIZE + spacing.md);
  const animRef = useRef(null);
  const doubled = [...photos, ...photos];
  const baseDuration = reverse ? 70000 : 60000;

  const runFromCurrent = () => {
    scrollAnim.stopAnimation((currentValue) => {
      const remaining = 1 - currentValue;
      const speed = speedRef.current || 1;
      const duration = (baseDuration / speed) * remaining;

      animRef.current = Animated.timing(scrollAnim, {
        toValue: 1,
        duration: Math.max(50, duration),
        easing: Easing.linear,
        useNativeDriver: true,
      });

      animRef.current.start(({ finished }) => {
        if (finished) {
          scrollAnim.setValue(0);
          runFromCurrent();
        }
      });
    });
  };

  useEffect(() => {
    runFromCurrent();
    // Poll for speed changes every 150ms
    const interval = setInterval(() => {
      if (animRef.current) {
        animRef.current.stop();
        runFromCurrent();
      }
    }, 150);
    return () => {
      clearInterval(interval);
      if (animRef.current) animRef.current.stop();
    };
  }, []);

  const translateX = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-totalWidth, 0] : [0, -totalWidth],
  });

  return (
    <Animated.View style={[styles.marqueeRow, { transform: [{ translateX }] }]}>
      {doubled.map((photo, i) => (
        <View key={i} style={styles.marqueeAvatar}>
          <Image
            source={{ uri: photo }}
            style={styles.marqueeImage}
            blurRadius={blurRef.current}
          />
        </View>
      ))}
    </Animated.View>
  );
}

export default function VenueCheckInScreen({ route, navigation }) {
  const venue = route?.params?.venue;
  const [slideProgress, setSlideProgress] = useState(0);
  const [credits] = useState(5);
  // Refs for marquee — start blurred, unblur on slide
  const speedRef = useRef(1);
  const blurRef = useRef(3); // Start blurred (matches React app: 2.5px)

  useEffect(() => {
    const marqueeSpeed = 1 + slideProgress * slideProgress * 4;
    speedRef.current = marqueeSpeed;
    // From React app: blur(Math.max(0, 2.5 - (marqueeSpeed - 1) * 3.2))
    blurRef.current = Math.max(0, 3 - (marqueeSpeed - 1) * 3.2);
  }, [slideProgress]);

  // Background: olive.light → orange.dark
  const bgR = Math.round(197 + (224 - 197) * slideProgress);
  const bgG = Math.round(198 + (90 - 198) * slideProgress);
  const bgB = Math.round(173 + (61 - 173) * slideProgress);
  const bgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Text: charcoal → beige
  const txtR = Math.round(26 + (245 - 26) * slideProgress);
  const txtG = Math.round(26 + (241 - 26) * slideProgress);
  const txtB = Math.round(26 + (232 - 26) * slideProgress);
  const textColor = `rgb(${txtR}, ${txtG}, ${txtB})`;
  const textColorMuted = `rgba(${txtR}, ${txtG}, ${txtB}, 0.7)`;

  const colorProgress = slideProgress;
  const imageScale = 1 + slideProgress * 0.15;

  const maskWidth = SCREEN_WIDTH;
  const maskHeight = maskWidth * (128 / 252);

  // Get local image if available
  const venueImage = VENUE_IMAGES[venue?.id] || { uri: venue?.image };

  const handleCheckIn = () => {
    setTimeout(() => navigation.replace('CheckedIn', { venue }), 800);
  };

  if (!venue) return null;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.locationPill}>
            <Text style={[styles.locationText, { color: textColor }]}>
              {venue.area} · {venue.distance}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <X size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Scrolling blurred profile rows */}
        <View style={[styles.marqueeContainer, { opacity: slideProgress < 0.8 ? 0.5 + slideProgress * 0.6 : 1 }]}>
          <MarqueeRow photos={PROFILE_PHOTOS} reverse={false} speedRef={speedRef} blurRef={blurRef} />
          <View style={{ height: spacing.md }} />
          <MarqueeRow photos={PROFILE_PHOTOS.slice().reverse()} reverse={true} speedRef={speedRef} blurRef={blurRef} />
        </View>

        {/* Venue image in brand SVG shape — edge to edge, CSS mask */}
        <View style={styles.maskedImageWrapper}>
          <View
            style={[
              styles.maskedContainer,
              {
                width: maskWidth,
                height: maskHeight,
                maskImage: VENUE_MASK_URL,
                WebkitMaskImage: VENUE_MASK_URL,
                maskSize: '100% 100%',
                WebkitMaskSize: '100% 100%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              },
            ]}
          >
            {/* Image with zoom */}
            <View style={[StyleSheet.absoluteFill, { transform: [{ scale: imageScale }] }]}>
              {/* Full color layer */}
              <Image
                source={venueImage}
                style={[styles.maskedImage, { width: maskWidth, height: maskHeight, opacity: colorProgress }]}
              />
              {/* Grayscale + blue tint layer */}
              <View style={[StyleSheet.absoluteFill, { opacity: 1 - colorProgress }]}>
                <Image
                  source={venueImage}
                  style={[styles.maskedImage, { width: maskWidth, height: maskHeight, filter: 'grayscale(1)' }]}
                />
                <LinearGradient
                  colors={[color.blue.dark + '70', color.blue.dark + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            </View>

            {/* Venue name overlay */}
            <View style={styles.venueNameOverlay}>
              <Text style={styles.venueNameText}>{venue.name}</Text>
              <Text style={styles.venuePeopleText}>
              <Text style={{ fontWeight: '700', color: color.white }}>{venue.peopleCount}</Text> people checked in
            </Text>
            </View>
          </View>
        </View>

        {/* Headline — vertically centered between shape and button */}
        <View style={styles.headlineWrapper}>
          <View style={styles.headlineContainer}>
            <Text style={[styles.headlineText, { color: textColorMuted }]}>It's </Text>
            <ShimmerText
              color={color.blue.dark}
              shimmerColor={color.blue.light}
              duration={2000}
              style={styles.shimmerWord}
            >
              hactually
            </ShimmerText>
            <Text style={[styles.headlineText, { color: textColorMuted }]}> happening.</Text>
          </View>
        </View>

        {/* Check-in button (full width, light/orange variant) */}
        <View style={styles.checkinArea}>
          <Button
            variant="checkin"
            color="orange"
            size="lg"
            fullWidth
            onPress={handleCheckIn}
            onSlideProgress={setSlideProgress}
            caption="1 credit"
          >
            Check In
          </Button>

          <Text style={[styles.creditsText, { color: textColorMuted }]}>
            You have <Text style={{ fontWeight: '700' }}>{credits}</Text> credits remaining
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // ─── Top bar ───
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    zIndex: 30,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: color.charcoal + '14',
  },
  locationText: {
    ...typography.caption,
    fontWeight: '600',
  },
  closeButton: {
    width: spacing['2xl'] + spacing.sm,
    height: spacing['2xl'] + spacing.sm,
    borderRadius: (spacing['2xl'] + spacing.sm) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.charcoal + '14',
  },

  // ─── Marquee rows ───
  marqueeContainer: {
    height: AVATAR_SIZE * 2 + spacing.md + spacing.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  marqueeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marqueeAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: spacing.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: color.white + '26',
  },
  marqueeImage: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
  },

  // ─── Masked venue image ───
  maskedImageWrapper: {
    marginTop: spacing.lg,
  },
  maskedContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  maskedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  venueNameOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    zIndex: 20,
  },
  venueNameText: {
    ...typography.h1,
    color: color.white,
    textShadowColor: color.charcoal + '80',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  venuePeopleText: {
    ...typography.body,
    color: color.white + 'CC',
    marginTop: spacing.xs,
    textShadowColor: color.charcoal + '60',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ─── Headline — centered between shape and button ───
  headlineWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  headlineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  headlineText: {
    ...typography.h2,
  },
  shimmerWord: {
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
  },

  // ─── Check-in area ───
  checkinArea: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  creditsText: {
    ...typography.caption,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
