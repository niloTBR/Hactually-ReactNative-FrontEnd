/**
 * LocationDropdown - Location selector with dropdown search
 * ABSOLUTELY positioned dropdown overlays everything below
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ScrollView,
  Keyboard,
} from 'react-native';
import { MapPin, ChevronDown, Search, X } from 'lucide-react-native';
import { color, spacing, radius, typography } from '../theme';

const LOCATIONS = [
  { id: '1', name: 'DIFC', city: 'Dubai' },
  { id: '2', name: 'Downtown', city: 'Dubai' },
  { id: '3', name: 'Marina', city: 'Dubai' },
  { id: '4', name: 'JBR', city: 'Dubai' },
  { id: '5', name: 'Business Bay', city: 'Dubai' },
  { id: '6', name: 'Palm Jumeirah', city: 'Dubai' },
  { id: '7', name: 'Al Quoz', city: 'Dubai' },
  { id: '8', name: 'Jumeirah', city: 'Dubai' },
];

export default function LocationDropdown({ selected, onSelect, locations = LOCATIONS }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const current = selected || locations[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: open ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: open ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [open]);

  const dropdownHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const dropdownOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (location) => {
    onSelect?.(location);
    setOpen(false);
    setSearch('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        activeOpacity={0.8}
        onPress={() => setOpen(!open)}
      >
        <Search size={18} color={color.blue.dark} />
        <Text style={styles.triggerText} numberOfLines={1}>
          {current.name}, {current.city}
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <ChevronDown size={20} color={color.olive.dark} />
        </Animated.View>
      </TouchableOpacity>

      {/* Dropdown - ABSOLUTE so it overlays everything */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={[
          styles.dropdown,
          {
            maxHeight: dropdownHeight,
            opacity: dropdownOpacity,
          },
        ]}
      >
        {/* Search input */}
        <View style={styles.searchContainer}>
          <Search size={16} color={color.olive.dark} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor={color.olive.dark + '80'}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color={color.olive.dark} />
            </TouchableOpacity>
          )}
        </View>

        {/* Location list */}
        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filtered.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.locationItem,
                current.id === loc.id && styles.locationItemActive,
              ]}
              onPress={() => handleSelect(loc)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.locationText,
                  current.id === loc.id && styles.locationTextActive,
                ]}
              >
                {loc.name}, {loc.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.beige,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    shadowColor: color.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  triggerText: {
    ...typography.body,
    fontWeight: '700',
    color: color.charcoal,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: color.beige,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    overflow: 'hidden',
    shadowColor: color.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: color.olive.light + '4D',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: color.charcoal,
    padding: 0,
  },
  list: {
    maxHeight: 220,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  locationItemActive: {
    backgroundColor: color.blue.dark + '10',
  },
  locationText: {
    ...typography.body,
    color: color.charcoal,
  },
  locationTextActive: {
    fontWeight: '700',
    color: color.blue.dark,
  },
});
