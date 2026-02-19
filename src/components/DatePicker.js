/**
 * Hactually Date Picker Component
 * Simple date input field with modal picker
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius, fontFamily, shadows } from '../theme';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const DatePicker = ({ value, onChange, label, error, placeholder = 'Date of birth' }) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value ? value.getMonth() : 0);
  const [day, setDay] = useState(value ? value.getDate() : 1);
  const [year, setYear] = useState(value ? value.getFullYear() : 2000);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleDone = () => {
    const maxDay = getDaysInMonth(month, year);
    const validDay = Math.min(day, maxDay);
    onChange(new Date(year, month, validDay));
    setOpen(false);
  };

  const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.field, error && styles.fieldError]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <ChevronDown size={16} color={colors.brown.default} />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={open} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Date</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.picker}>
              <View style={styles.column}>
                <Text style={styles.colLabel}>Month</Text>
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                  {MONTHS.map((m, i) => (
                    <TouchableOpacity key={m} style={[styles.option, month === i && styles.optionActive]} onPress={() => setMonth(i)}>
                      <Text style={[styles.optionText, month === i && styles.optionTextActive]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.column, { flex: 0.6 }]}>
                <Text style={styles.colLabel}>Day</Text>
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                  {days.map((d) => (
                    <TouchableOpacity key={d} style={[styles.option, day === d && styles.optionActive]} onPress={() => setDay(d)}>
                      <Text style={[styles.optionText, day === d && styles.optionTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.column, { flex: 0.8 }]}>
                <Text style={styles.colLabel}>Year</Text>
                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                  {YEARS.map((y) => (
                    <TouchableOpacity key={y} style={[styles.option, year === y && styles.optionActive]} onPress={() => setYear(y)}>
                      <Text style={[styles.optionText, year === y && styles.optionTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    fontWeight: '600',
    color: colors.brown.dark,
    marginBottom: spacing[2],
  },
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.brown.light + '4D',
    paddingHorizontal: spacing[4],
    ...shadows.card,
  },
  fieldError: { borderColor: colors.orange.default },
  fieldText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  placeholder: { color: colors.brown.default + '80' },
  error: {
    fontSize: fontSize.xs,
    color: colors.orange.default,
    marginTop: spacing[1],
    marginLeft: spacing[2],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '30',
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.black,
  },
  picker: {
    flexDirection: 'row',
    height: 220,
    paddingHorizontal: spacing[3],
    gap: spacing[2],
  },
  column: { flex: 1 },
  colLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    color: colors.brown.default,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingVertical: spacing[2],
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.brown.lighter,
    borderRadius: borderRadius.lg,
  },
  option: {
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing[1],
  },
  optionText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.brown.default,
  },
  optionTextActive: {
    color: colors.white,
    fontFamily: fontFamily.bold,
  },
  footer: { padding: spacing[4] },
  doneBtn: {
    height: 48,
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.white,
  },
});

export default DatePicker;
