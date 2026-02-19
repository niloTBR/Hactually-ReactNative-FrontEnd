/**
 * Hactually Date Picker Component
 * Cross-platform date picker with web support
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown } from 'lucide-react-native';
import { colors, spacing, fontSize, borderRadius, fontFamily } from '../theme';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const DatePicker = ({ value, onChange, visible, onClose }) => {
  const [selectedDay, setSelectedDay] = useState(value ? value.getDate() : 1);
  const [selectedMonth, setSelectedMonth] = useState(value ? value.getMonth() : 0);
  const [selectedYear, setSelectedYear] = useState(value ? value.getFullYear() : 2000);
  const [activeColumn, setActiveColumn] = useState(null);

  const handleDone = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onChange(newDate);
    onClose();
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const validDays = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={Platform.OS === 'android'}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date of Birth</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            {/* Day Column */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Day</Text>
              <ScrollView
                style={styles.scrollColumn}
                showsVerticalScrollIndicator={false}
              >
                {validDays.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.option,
                      selectedDay === day && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDay === day && styles.optionTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Month Column */}
            <View style={[styles.column, { flex: 1.5 }]}>
              <Text style={styles.columnLabel}>Month</Text>
              <ScrollView
                style={styles.scrollColumn}
                showsVerticalScrollIndicator={false}
              >
                {MONTHS.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.option,
                      selectedMonth === index && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedMonth === index && styles.optionTextSelected,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year Column */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Year</Text>
              <ScrollView
                style={styles.scrollColumn}
                showsVerticalScrollIndicator={false}
              >
                {YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.option,
                      selectedYear === year && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedYear === year && styles.optionTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : colors.white,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '4D',
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.black,
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    height: 250,
    gap: spacing[2],
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brown.default,
    textAlign: 'center',
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollColumn: {
    flex: 1,
    backgroundColor: colors.brown.lighter,
    borderRadius: borderRadius.lg,
  },
  option: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: colors.blue.default,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing[1],
  },
  optionText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.brown.default,
  },
  optionTextSelected: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  doneButton: {
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
