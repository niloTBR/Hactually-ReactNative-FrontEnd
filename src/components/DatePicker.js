/**
 * Hactually Date Picker Component
 * Uses native date picker on iOS/Android, styled input on web
 * Supports solid (light bg) and ghost (dark bg) variants
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Platform,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { color, spacing, typography, radius, useGhostTheme } from '../theme';
import { colors, shadows } from '../theme';
import FormError from './FormError';

// Only import DateTimePicker on native platforms
let DateTimePicker = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const DatePicker = ({
  value,
  onChange,
  label,
  error,
  placeholder = 'Date of birth',
  variant = 'solid', // 'solid' | 'ghost'
  themeColor, // For ghost variant - auto-detected from context if not provided
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(null); // iOS: track spinner value before confirming
  const isGhost = variant === 'ghost';

  // Use context theme if themeColor not explicitly provided
  const ghostTheme = useGhostTheme();
  const resolvedThemeColor = themeColor || ghostTheme.themeColor;
  const isDarkBg = ghostTheme.isDark;
  // Default to a reasonable birth year for adults
  const defaultDate = new Date(2000, 0, 1);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Android: handle date selection or dismissal
  const handleAndroidDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  // iOS: track spinner changes (don't save yet)
  const handleIOSDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  // iOS: confirm selection
  const handleIOSDone = () => {
    const dateToSave = tempDate || value || defaultDate;
    onChange(dateToSave);
    setShowPicker(false);
    setTempDate(null);
  };

  // iOS: cancel without saving
  const handleIOSCancel = () => {
    setShowPicker(false);
    setTempDate(null);
  };

  const handleWebDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      onChange(new Date(year, month - 1, day));
    }
  };

  // Helper functions for ghost variant styling
  const getFieldStyle = () => {
    if (isGhost) {
      return {
        backgroundColor: 'transparent',
        borderColor: error ? color.error.light : resolvedThemeColor + '80', // 50% when not focused
        ...shadows.none,
      };
    }
    return {
      backgroundColor: colors.white,
      borderColor: error ? color.error.dark : color.olive.light + '80',
    };
  };

  const getTextColor = () => isGhost ? resolvedThemeColor : color.charcoal; // 100%
  const getPlaceholderColor = () => isGhost ? resolvedThemeColor + 'BF' : color.olive.dark + 'BF'; // 75%
  const getIconColor = () => isGhost ? resolvedThemeColor : color.olive.dark; // 100%
  const getLabelColor = () => isGhost ? resolvedThemeColor : color.olive.dark; // 100%

  // Web: Use native HTML date input with custom icon
  if (Platform.OS === 'web') {
    const webDateValue = value
      ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
      : '';

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>}
        <style>{`
          input[type="date"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            position: absolute;
            right: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        `}</style>
        <View style={[styles.field, !isGhost && shadows.card, getFieldStyle()]}>
          <View style={styles.webInputWrapper}>
            <input
              type="date"
              value={webDateValue}
              onChange={handleWebDateChange}
              max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
              min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: 14,
                color: value ? getTextColor() : getPlaceholderColor(),
                cursor: 'pointer',
                position: 'relative',
              }}
            />
          </View>
          <ChevronDown size={16} color={getIconColor()} />
        </View>
        <FormError message={error} variant={variant} />
      </View>
    );
  }

  // iOS: Use inline picker that we control with our own modal
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>}

        <TouchableOpacity
          style={[styles.field, !isGhost && shadows.card, getFieldStyle()]}
          onPress={() => {
            setTempDate(value || defaultDate);
            setShowPicker(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldText, { color: value ? getTextColor() : getPlaceholderColor() }]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <ChevronDown size={16} color={getIconColor()} />
        </TouchableOpacity>

        <FormError message={error} variant={variant} />

        <Modal visible={showPicker} transparent animationType="slide">
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleIOSCancel}
          >
            <View style={styles.modal}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleIOSCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Date of Birth</Text>
                <TouchableOpacity onPress={handleIOSDone} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>

              {DateTimePicker && (
                <DateTimePicker
                  value={tempDate || defaultDate}
                  mode="date"
                  display="spinner"
                  onChange={handleIOSDateChange}
                  maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
                  minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                  style={styles.picker}
                  textColor={color.charcoal}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  // Android: Show native date picker dialog
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: getLabelColor() }]}>{label}</Text>}

      <TouchableOpacity
        style={[styles.field, !isGhost && shadows.card, getFieldStyle()]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldText, { color: value ? getTextColor() : getPlaceholderColor() }]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <ChevronDown size={16} color={getIconColor()} />
      </TouchableOpacity>

      <FormError message={error} variant={variant} />

      {showPicker && DateTimePicker && (
        <DateTimePicker
          value={value || defaultDate}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
          maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
          minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.caption,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  webInputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  fieldText: {
    ...typography.body,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: color.olive.light + '30',
  },
  title: {
    ...typography.h3,
    color: color.charcoal,
  },
  cancelText: {
    ...typography.body,
    color: color.olive.dark,
  },
  doneText: {
    ...typography.body,
    fontWeight: '600',
    color: color.blue.dark,
  },
  picker: {
    height: 200,
  },
});

export default DatePicker;
