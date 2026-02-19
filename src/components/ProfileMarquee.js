/**
 * Hactually Profile Marquee Component
 * Infinite scrolling profile images
 */
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { spacing } from '../theme';

const IMAGE_SIZE = 96;
const IMAGE_GAP = 12;

const ProfileMarquee = ({
  images,
  reverse = false,
  duration = 30000,
  imageSize = IMAGE_SIZE,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const singleSetWidth = images.length * (imageSize + IMAGE_GAP);

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: reverse ? duration + 5000 : duration,
        useNativeDriver: true,
        isInteraction: false,
      }),
      { resetBeforeIteration: true }
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-singleSetWidth, 0] : [0, -singleSetWidth],
  });

  return (
    <View style={[styles.container, { height: imageSize }]}>
      <Animated.View
        style={[styles.row, { transform: [{ translateX }] }]}
      >
        {[...images, ...images, ...images].map((img, i) => (
          <Image
            key={i}
            source={img}
            style={[
              styles.image,
              {
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2
              }
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: IMAGE_GAP,
  },
  image: {
    borderWidth: 2,
    borderColor: 'rgba(200, 227, 244, 0.25)',
  },
});

export default ProfileMarquee;
