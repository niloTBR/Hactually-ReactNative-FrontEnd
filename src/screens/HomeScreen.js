/**
 * Home Screen - Main map view with nearby venues
 * Beige background (map placeholder), location dropdown, auto-scrolling venue carousel
 * "View all" expands to full-screen scrollable venue list
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, spacing, radius, typography } from '../theme';
import {
  LocationDropdown,
  MeMarker,
  PeopleMarker,
  VenueCard,
  BottomNav,
  NearbyIcon,
} from '../components';
import { useVenueStore } from '../store/venueStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_GAP = spacing.md;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// Venue images from Hactually 2.0 project
const VENUE_IMAGES = {
  '1': require('../../assets/venues/1.jpg'),
  '2': require('../../assets/venues/2.jpg'),
  '3': require('../../assets/venues/3.webp'),
  '4': require('../../assets/venues/4.jpg'),
  '5': require('../../assets/venues/5.jpeg'),
  '6': require('../../assets/venues/6.jpg'),
};

// Mock data
const MOCK_PEOPLE = [
  { photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
];

const MOCK_VENUES = [
  {
    id: '1',
    name: 'White Dubai',
    image: VENUE_IMAGES['1'],
    category: 'Nightclub',
    area: 'Atlantis',
    distance: '8.2km',
    people: MOCK_PEOPLE,
    peopleCount: 16,
  },
  {
    id: '2',
    name: 'Nammos',
    image: VENUE_IMAGES['2'],
    category: 'Beach Club',
    area: 'Four Seasons',
    distance: '5.3km',
    people: MOCK_PEOPLE,
    peopleCount: 37,
  },
  {
    id: '3',
    name: 'Coya',
    image: VENUE_IMAGES['3'],
    category: 'Restaurant & Bar',
    area: 'DIFC',
    distance: '0.4km',
    people: MOCK_PEOPLE,
    peopleCount: 29,
  },
  {
    id: '4',
    name: 'Soho Garden',
    image: VENUE_IMAGES['4'],
    category: 'Club & Garden',
    area: 'Meydan',
    distance: '4.7km',
    people: MOCK_PEOPLE,
    peopleCount: 54,
  },
  {
    id: '5',
    name: 'LIV',
    image: VENUE_IMAGES['5'],
    category: 'Nightclub',
    area: 'Marina',
    distance: '1.2km',
    people: MOCK_PEOPLE,
    peopleCount: 16,
  },
  {
    id: '6',
    name: 'Zuma',
    image: VENUE_IMAGES['6'],
    category: 'Restaurant',
    area: 'DIFC',
    distance: '0.2km',
    people: MOCK_PEOPLE,
    peopleCount: 11,
  },
];

const MOCK_VENUE_MARKERS = [
  { id: '1', venueName: 'Coya', people: MOCK_PEOPLE, count: 29, top: '38%', left: '55%' },
];

// Triple the venues for infinite loop illusion
const LOOP_VENUES = [...MOCK_VENUES, ...MOCK_VENUES, ...MOCK_VENUES];
const LOOP_START = MOCK_VENUES.length;

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('nearby');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const checkedInVenue = useVenueStore((s) => s.checkedInVenue);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const currentIndex = useRef(0);
  const userTouching = useRef(false);

  // Stagger animations for expanded list
  const fadeAnims = useRef(MOCK_VENUES.map(() => new Animated.Value(0))).current;

  const expandList = () => {
    setIsExpanded(true);
    fadeAnims.forEach((anim) => anim.setValue(0));
    fadeAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: i * 50,
        useNativeDriver: true,
      }).start();
    });
  };

  const collapseList = () => {
    setIsExpanded(false);
  };

  // Start at the middle set for infinite illusion
  const initialOffset = LOOP_START * SNAP_INTERVAL;
  const hasSetInitial = useRef(false);

  useEffect(() => {
    if (!hasSetInitial.current) {
      scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
      currentIndex.current = LOOP_START;
      hasSetInitial.current = true;
    }
  }, []);

  // Auto-scroll carousel with infinite loop
  useEffect(() => {
    if (isExpanded) return;
    const lastOfMiddle = LOOP_START + MOCK_VENUES.length - 1;

    const interval = setInterval(() => {
      if (userTouching.current) return;

      currentIndex.current += 1;

      if (currentIndex.current > lastOfMiddle) {
        const resetIdx = LOOP_START;
        currentIndex.current = resetIdx;
        scrollRef.current?.scrollTo({ x: resetIdx * SNAP_INTERVAL, animated: false });
        setTimeout(() => {
          currentIndex.current = resetIdx + 1;
          scrollRef.current?.scrollTo({ x: (resetIdx + 1) * SNAP_INTERVAL, animated: true });
        }, 50);
        return;
      }

      scrollRef.current?.scrollTo({
        x: currentIndex.current * SNAP_INTERVAL,
        animated: true,
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isExpanded]);

  const handleScrollEnd = useCallback((e) => {
    userTouching.current = false;
    const offsetX = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / SNAP_INTERVAL);
    currentIndex.current = idx;

    const lastOfMiddle = LOOP_START + MOCK_VENUES.length - 1;
    const firstOfMiddle = LOOP_START;

    if (idx > lastOfMiddle) {
      const resetIdx = firstOfMiddle + (idx - lastOfMiddle - 1);
      currentIndex.current = resetIdx;
      scrollRef.current?.scrollTo({ x: resetIdx * SNAP_INTERVAL, animated: false });
    } else if (idx < firstOfMiddle) {
      const resetIdx = lastOfMiddle - (firstOfMiddle - idx - 1);
      currentIndex.current = resetIdx;
      scrollRef.current?.scrollTo({ x: resetIdx * SNAP_INTERVAL, animated: false });
    }
  }, []);

  const handleScrollBegin = useCallback(() => {
    userTouching.current = true;
  }, []);

  // ─── EXPANDED LIST VIEW ───
  if (isExpanded) {
    return (
      <View style={styles.expandedContainer}>
        <SafeAreaView edges={['top']} style={styles.expandedSafeArea}>
          {/* Header */}
          <View style={styles.expandedHeader}>
            <Text style={styles.sectionTitle}>Where people are tonight</Text>
            <TouchableOpacity style={styles.closeButton} onPress={collapseList} activeOpacity={0.7}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable venue list */}
          <ScrollView
            style={styles.expandedList}
            contentContainerStyle={styles.expandedListContent}
            showsVerticalScrollIndicator={false}
          >
            {MOCK_VENUES.map((venue, index) => (
              <Animated.View
                key={venue.id}
                style={[{
                    opacity: fadeAnims[index],
                    transform: [{
                      translateY: fadeAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <VenueCard venue={venue} onPress={() => navigation.navigate('VenueCheckIn', { venue })} />
              </Animated.View>
            ))}
          </ScrollView>
        </SafeAreaView>

        {/* Bottom nav - floating over content */}
        <View style={styles.expandedNavWrapper}>
          <SafeAreaView edges={['bottom']}>
            <BottomNav activeTab={activeTab} checkedInVenue={checkedInVenue} onTabChange={(tab) => { if (tab === 'venue') navigation.navigate('CheckedIn', { venue: checkedInVenue }); else if (tab === 'profile') navigation.navigate('Profile'); else if (tab === 'spots') navigation.navigate('Spots'); else if (tab === 'likes') navigation.navigate('Matches'); else setActiveTab(tab); }} />
          </SafeAreaView>
        </View>
      </View>
    );
  }

  // ─── NORMAL MAP VIEW ───
  return (
    <View style={styles.container}>
      {/* Map area (beige placeholder) */}
      <View style={styles.mapArea}>
        <SafeAreaView edges={['top']} style={styles.topControls}>
          <View style={styles.headerBar}>
            <View style={styles.locationBar}>
              <LocationDropdown
                selected={selectedLocation}
                onSelect={setSelectedLocation}
              />
            </View>
            {/* Near me button */}
            <TouchableOpacity style={styles.heartButton} activeOpacity={0.8}>
              <NearbyIcon size={22} color={color.blue.dark} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.meMarkerPosition}>
          <MeMarker size={36} />
        </View>

        {MOCK_VENUE_MARKERS.map((marker) => (
          <View
            key={marker.id}
            style={[
              styles.venueMarkerPosition,
              { top: marker.top, left: marker.left },
            ]}
          >
            <PeopleMarker
              people={marker.people}
              count={marker.count}
              venueName={marker.venueName}
            />
          </View>
        ))}
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Where people are tonight</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={expandList} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.cardsContainer}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {LOOP_VENUES.map((venue, index) => {
            const inputRange = [
              (index - 1) * SNAP_INTERVAL,
              index * SNAP_INTERVAL,
              (index + 1) * SNAP_INTERVAL,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.85, 1, 0.85],
              extrapolate: 'clamp',
            });

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [0, -60, 0],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`${venue.id}-${index}`}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale }, { translateY }] },
                ]}
              >
                <VenueCard venue={venue} onPress={() => navigation.navigate('VenueCheckIn', { venue })} />
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.bottomNavWrapper}>
          <BottomNav activeTab={activeTab} checkedInVenue={checkedInVenue} onTabChange={(tab) => { if (tab === 'venue') navigation.navigate('CheckedIn', { venue: checkedInVenue }); else if (tab === 'profile') navigation.navigate('Profile'); else if (tab === 'spots') navigation.navigate('Spots'); else if (tab === 'likes') navigation.navigate('Matches'); else setActiveTab(tab); }} />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ─── Normal map view ───
  container: {
    flex: 1,
    backgroundColor: color.beige,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  topControls: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 100,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationBar: {
    flex: 1,
  },
  heartButton: {
    width: spacing['3xl'],
    height: spacing['3xl'],
    borderRadius: spacing['3xl'] / 2,
    backgroundColor: color.white + 'CC',
    borderWidth: 1,
    borderColor: color.olive.light + '4D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: color.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  meMarkerPosition: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    marginTop: -35,
    marginLeft: -35,
  },
  venueMarkerPosition: {
    position: 'absolute',
  },
  bottomSection: {
    paddingBottom: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: color.charcoal,
    flex: 1,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: color.olive.light + '80',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  viewAllText: {
    ...typography.caption,
    fontWeight: '500',
    color: color.olive.dark,
  },
  cardsContainer: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: spacing.md + 60,
    paddingBottom: spacing.xl,
    zIndex: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    zIndex: 10,
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    zIndex: 1,
  },

  // ─── Expanded list view ───
  expandedContainer: {
    flex: 1,
    backgroundColor: color.beige,
  },
  expandedSafeArea: {
    flex: 1,
    paddingBottom: 0,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: color.olive.light + '80',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  closeText: {
    ...typography.caption,
    fontWeight: '500',
    color: color.olive.dark,
  },
  expandedList: {
    flex: 1,
  },
  expandedListContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'] * 2,
    gap: spacing.xl,
  },
  expandedNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
});
