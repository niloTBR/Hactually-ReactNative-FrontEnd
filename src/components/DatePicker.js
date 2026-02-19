/**
 * Hactually Date Input Component
 * Standardized three-field date selector (Month / Day / Year)
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius, fontFamily, shadows } from '../theme';

const MONTHS = [
  { value: 0, label: 'January', short: 'Jan' },
  { value: 1, label: 'February', short: 'Feb' },
  { value: 2, label: 'March', short: 'Mar' },
  { value: 3, label: 'April', short: 'Apr' },
  { value: 4, label: 'May', short: 'May' },
  { value: 5, label: 'June', short: 'Jun' },
  { value: 6, label: 'July', short: 'Jul' },
  { value: 7, label: 'August', short: 'Aug' },
  { value: 8, label: 'September', short: 'Sep' },
  { value: 9, label: 'October', short: 'Oct' },
  { value: 10, label: 'November', short: 'Nov' },
  { value: 11, label: 'December', short: 'Dec' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

// Dropdown select component
const Select = ({ label, value, displayValue, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.selectContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.select} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
        <ChevronDown size={16} color={colors.brown.default} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{label}</Text>
            </View>
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, value === opt.value && styles.optionSelected]}
                  onPress={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Text style={[styles.optionText, value === opt.value && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                  {value === opt.value && <Check size={16} color={colors.blue.default} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const DatePicker = ({ value, onChange, label, error }) => {
  const date = value instanceof Date ? value : null;
  const [month, setMonth] = useState(date ? date.getMonth() : null);
  const [day, setDay] = useState(date ? date.getDate() : null);
  const [year, setYear] = useState(date ? date.getFullYear() : null);

  const updateDate = (m, d, y) => {
    if (m !== null && d !== null && y !== null) {
      const maxDay = getDaysInMonth(m, y);
      const validDay = Math.min(d, maxDay);
      onChange(new Date(y, m, validDay));
    }
  };

  const handleMonth = (m) => { setMonth(m); updateDate(m, day, year); };
  const handleDay = (d) => { setDay(d); updateDate(month, d, year); };
  const handleYear = (y) => { setYear(y); updateDate(month, day, y); };

  const dayOptions = Array.from(
    { length: month !== null && year ? getDaysInMonth(month, year) : 31 },
    (_, i) => ({ value: i + 1, label: String(i + 1).padStart(2, '0') })
  );

  const yearOptions = YEARS.map(y => ({ value: y, label: String(y) }));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.mainLabel}>{label}</Text>}
      <View style={styles.row}>
        <Select
          label="Month"
          value={month}
          displayValue={month !== null ? MONTHS[month].short : null}
          options={MONTHS.map(m => ({ value: m.value, label: m.label }))}
          onChange={handleMonth}
          placeholder="Month"
        />
        <Select
          label="Day"
          value={day}
          displayValue={day ? String(day).padStart(2, '0') : null}
          options={dayOptions}
          onChange={handleDay}
          placeholder="Day"
        />
        <Select
          label="Year"
          value={year}
          displayValue={year ? String(year) : null}
          options={yearOptions}
          onChange={handleYear}
          placeholder="Year"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  mainLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    fontWeight: '600',
    color: colors.brown.dark,
    marginBottom: spacing[2],
  },
  row: { flexDirection: 'row', gap: spacing[3] },
  selectContainer: { flex: 1 },
  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.brown.default,
    marginBottom: spacing[1],
  },
  select: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[3],
    ...shadows.card,
  },
  selectText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  placeholder: { color: colors.brown.default + '80' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  dropdown: {
    width: '100%',
    maxWidth: 320,
    maxHeight: '60%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  dropdownHeader: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '30',
  },
  dropdownTitle: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  optionsList: { maxHeight: 300 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '20',
  },
  optionSelected: { backgroundColor: colors.blue.default + '10' },
  optionText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  optionTextSelected: {
    fontFamily: fontFamily.bold,
    fontWeight: '600',
    color: colors.blue.default,
  },
  error: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
    color: colors.orange.default,
    marginTop: spacing[2],
  },
});

export default DatePicker;
