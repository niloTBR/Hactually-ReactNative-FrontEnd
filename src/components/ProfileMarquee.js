/**
 * Profile Marquee - Seamless infinite scrolling profile images
 */
import React, { useEffect, useRef, memo } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

const DEFAULT_PROFILES = [
  require('../../assets/images/profiles/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'),
  require('../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-KriecpTIWgY-unsplash.jpg'),
  require('../../assets/images/profiles/natalia-blauth-gw2udfGe_tM-unsplash.jpg'),
  require('../../assets/images/profiles/jakob-owens-lkMJcGDZLVs-unsplash.jpg'),
  require('../../assets/images/profiles/rayul-_M6gy9oHgII-unsplash.jpg'),
  require('../../assets/images/profiles/arrul-lin-sYhUhse5uT8-unsplash.jpg'),
];

const SIZE = 96;
const GAP = 12;

const ProfileImage = memo(({ source }) => <Image source={source} style={styles.img} />);

const ProfileMarquee = memo(({ images = DEFAULT_PROFILES, reverse = false, speed = 30000 }) => {
  const setWidth = images.length * (SIZE + GAP);
  const anim = useRef(new Animated.Value(reverse ? -setWidth : 0)).current;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const loop = () => {
      if (!mounted.current) return;
      anim.setValue(reverse ? -setWidth : 0);
      Animated.timing(anim, {
        toValue: reverse ? 0 : -setWidth,
        duration: speed,
        useNativeDriver: true,
        isInteraction: false,
      }).start(({ finished }) => finished && loop());
    };
    loop();
    return () => { mounted.current = false; anim.stopAnimation(); };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.row, { transform: [{ translateX: anim }] }]}>
        {[...images, ...images].map((img, i) => <ProfileImage key={i} source={img} />)}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { overflow: 'hidden', height: SIZE },
  row: { flexDirection: 'row', gap: GAP },
  img: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 2, borderColor: 'rgba(200,227,244,0.25)' },
});

export default ProfileMarquee;
