/**
 * Welcome Screen - Onboarding intro with video carousel
 * Features: Video playback, blur text reveal, fade transitions,
 * tap navigation, press-hold pause, shimmer CTA button
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { LogoIcon } from '../../components/Logo';
import { colors, spacing, borderRadius, fontFamily } from '../../theme';

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

// Slide content with video sources
const SLIDES = [
  {
    lines: ["You've", 'shared a look with someone before.'],
    video: require('../../../assets/videos/Video_1.mp4'),
    hasVideo: true,
  },
  {
    lines: ["The moment was real. Acting on it wasn't easy."],
    video: require('../../../assets/videos/Video_2.mp4'),
    hasVideo: true,
  },
  {
    lines: ['continue the moment', 'with hactually'],
    hasProfiles: true,
  },
  {
    lines: ['Meet the ones', 'you almost missed!'],
    video: require('../../../assets/videos/Video_4.mp4'),
    hasVideo: true,
    isFinal: true,
    videoPosition: '70%', // Crop position for this video
  },
];

// Shimmer animation component for CTA button
const ShimmerButton = ({ onPress, children }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width * 1.5],
  });

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.ctaButton}>
        {/* Orange gradient border */}
        <LinearGradient
          colors={['#C94A2F', '#E05A3D', '#C94A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        />
        {/* Frosted glass inner */}
        <View style={styles.ctaInner}>
          {/* Shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              { transform: [{ translateX }] },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
              style={styles.shimmerGradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Calculate exact width of one set for seamless loop
const IMAGE_SIZE = 96;
const IMAGE_GAP = 12;
const SINGLE_SET_WIDTH = PROFILES.length * (IMAGE_SIZE + IMAGE_GAP);

// Marquee row component - smooth looping animation with real images
const ProfileRow = ({ images, reverse = false }) => {
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
        style={[
          styles.marqueeRow,
          { transform: [{ translateX }] },
        ]}
      >
        {[...images, ...images, ...images].map((img, i) => (
          <View key={i} style={styles.profileImageWrapper}>
            <Image source={img} style={styles.profileImage} />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

// Animated blur text reveal - simulates blur(8px) to blur(0) with opacity/translateY
const BlurText = ({ lines, center = false, slideIndex }) => {
  const [wordAnimations, setWordAnimations] = useState([]);

  useEffect(() => {
    // Create animation values for each word
    const allWords = lines.flatMap((line) => line.split(' '));
    const anims = allWords.map(() => new Animated.Value(0));
    setWordAnimations(anims);

    // Stagger the word reveal animation - smooth blur-like effect
    const staggeredAnimations = anims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    );

    // Start animations with stagger delay
    anims.forEach((anim, index) => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, index * 80);
    });

    return () => {
      anims.forEach((a) => a.stopAnimation());
    };
  }, [slideIndex, lines]);

  let wordIndex = 0;

  return (
    <View style={center && styles.centerText}>
      {lines.map((line, lineIdx) => (
        <View
          key={lineIdx}
          style={[styles.textLine, center && styles.centerTextLine]}
        >
          {line.split(' ').map((word, wordIdx) => {
            const currentWordIndex = wordIndex++;
            const isHactually = word.toLowerCase() === 'hactually';
            const anim = wordAnimations[currentWordIndex];

            // Simulate blur effect with opacity fade from 0 and slight vertical movement
            const opacity = anim
              ? anim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: [0, 0.5, 1],
                })
              : 1;

            const translateY = anim
              ? anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                })
              : 0;

            // Subtle scale for blur-like softness
            const scale = anim
              ? anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.02, 1],
                })
              : 1;

            return (
              <Animated.Text
                key={wordIdx}
                style={[
                  styles.slideText,
                  isHactually && styles.brandText,
                  {
                    opacity,
                    transform: [{ translateY }, { scale }],
                  },
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const startTime = useRef(Date.now());
  const pausedAt = useRef(0);

  const slide = SLIDES[currentSlide];

  // Handle slide progress
  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    startTime.current = Date.now() - (pausedAt.current || 0);

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / 5000) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && currentSlide < SLIDES.length - 1) {
        goToSlide(currentSlide + 1);
      }
    }, 16);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSlide, isPaused]);

  // Fade transition to new slide
  const goToSlide = useCallback((newSlide) => {
    if (newSlide < 0 || newSlide >= SLIDES.length) return;

    pausedAt.current = 0;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentSlide(newSlide);
      setProgress(0);

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);

  // Handle tap - left side goes back, right side goes forward
  const handleTap = (event) => {
    // Use pageX for better cross-platform support (web + native)
    const touchX = event.nativeEvent?.pageX || event.nativeEvent?.locationX || 0;
    const isLeftSide = touchX < width / 2;

    if (isLeftSide && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else if (!isLeftSide && currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  // Handle long press - pause/resume
  const handlePressIn = () => {
    pausedAt.current = Date.now() - startTime.current;
    setIsPaused(true);
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
  };

  const handlePressOut = () => {
    setIsPaused(false);
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  };

  const handleStart = () => {
    navigation.navigate('AuthOptions', { showTransition: true });
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleTap}
      onLongPress={() => {}} // Placeholder to enable long press detection
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={200}
    >
        {/* Background video */}
        {slide.hasVideo && slide.video && (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={slide.video}
              style={[
                styles.backgroundVideo,
                Platform.OS === 'web' && {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                },
              ]}
              videoStyle={Platform.OS === 'web' ? {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slide.isFinal ? 'right center' : 'center center',
              } : undefined}
              resizeMode={ResizeMode.COVER}
              shouldPlay={!isPaused}
              isLooping
              isMuted
              rate={slide.isFinal ? 0.5 : 1.0}
            />
          </View>
        )}

        {/* Gradient overlay for video slides - bottom blur effect */}
        {slide.hasVideo && (
          <>
            <LinearGradient
              colors={['transparent', 'rgba(88,101,242,0.6)', 'rgba(88,101,242,0.9)']}
              locations={[0.4, 0.7, 1]}
              style={styles.videoOverlay}
            />
          </>
        )}

        {/* Non-video slide background */}
        {!slide.hasVideo && <View style={styles.solidBackground} />}

        <SafeAreaView style={styles.safeArea}>
          {/* Progress bars */}
          <View style={styles.progressContainer}>
            {SLIDES.map((_, i) => (
              <View key={i} style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width:
                        i < currentSlide
                          ? '100%'
                          : i === currentSlide
                          ? `${progress}%`
                          : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Logo - icon only on WelcomeScreen */}
          <View style={styles.logoContainer}>
            <LogoIcon size={48} />
          </View>

          {/* Content with fade animation */}
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {slide.hasProfiles ? (
              <View style={styles.profilesContent}>
                <View style={styles.topProfiles}>
                  <ProfileRow images={PROFILES} />
                  <ProfileRow images={PROFILES} reverse />
                </View>

                <View style={styles.centerContent}>
                  <BlurText lines={slide.lines} center slideIndex={currentSlide} />
                </View>

                <View style={styles.bottomProfiles}>
                  <ProfileRow images={PROFILES} />
                  <ProfileRow images={PROFILES} reverse />
                </View>
              </View>
            ) : (
              <View style={styles.textContent}>
                <BlurText lines={slide.lines} slideIndex={currentSlide} />
              </View>
            )}
          </Animated.View>

          {/* CTA Button with shimmer */}
          {slide.isFinal && (
            <View style={styles.ctaContainer}>
              <ShimmerButton onPress={handleStart}>
                <Text style={styles.ctaText}>Start Spotting</Text>
              </ShimmerButton>
            </View>
          )}
        </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue.default,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: colors.blue.default,
  },
  backgroundVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  solidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blue.default,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(200, 227, 244, 0.3)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blue.light,
    borderRadius: borderRadius.full,
  },
  logoContainer: {
    paddingHorizontal: 32,
  },
  profilesContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing[8],
  },
  topProfiles: {
    gap: 16,
  },
  bottomProfiles: {
    gap: 16,
  },
  centerContent: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 0,
  },
  textLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  centerTextLine: {
    justifyContent: 'center',
  },
  centerText: {
    alignItems: 'center',
  },
  slideText: {
    fontSize: 40,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.light,
    lineHeight: 50,
  },
  brandText: {
    color: colors.orange.default,
  },
  marqueeContainer: {
    overflow: 'hidden',
    height: 96,
  },
  marqueeRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  profileImageWrapper: {
    width: 96,
    height: 96,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(200, 227, 244, 0.25)',
  },
  ctaContainer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
  },
  ctaButton: {
    height: 48,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  ctaGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ctaInner: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 80,
  },
  shimmerGradient: {
    flex: 1,
  },
  ctaText: {
    fontSize: 11,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.blue.light,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
