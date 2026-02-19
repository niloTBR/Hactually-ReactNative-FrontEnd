/**
 * StyleGuide Screen - Hactually 2.0 Design System
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Eye, Type, MousePointer, FormInput, Mail, Lock, Search } from 'lucide-react-native';
import { colors, fontSize, fontFamily, spacing, borderRadius } from '../theme';
import { Button, Input, OTPInput, GoogleIcon, AppleIcon } from '../components';

const sections = [
  { id: 'logo', label: 'Logo', icon: Eye },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: MousePointer },
  { id: 'inputs', label: 'Forms', icon: FormInput },
];

// Logo SVG
const HactuallyLogo = ({ size = 80, useGradient = false, color = '#E05A3D' }) => (
  <Svg width={size * 1.5} height={size} viewBox="0 0 192 128" fill="none">
    {useGradient ? (
      <>
        <Defs>
          <SvgGradient id="logoGrad" x1="128" y1="64" x2="128" y2="0" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#E0593D" />
            <Stop offset="1" stopColor="#D9081E" />
          </SvgGradient>
        </Defs>
        <Path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" fill="url(#logoGrad)" />
      </>
    ) : (
      <Path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" fill={color} />
    )}
  </Svg>
);

// Sidebar
const Sidebar = ({ active, onNav }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarHeader}>
      <Text style={styles.sidebarTitle}>hactually</Text>
    </View>
    <View style={styles.sidebarNav}>
      {sections.map(({ id, label, icon: Icon }) => (
        <TouchableOpacity key={id} onPress={() => onNav(id)} style={[styles.navItem, active === id && styles.navItemActive]}>
          <Icon size={16} color={active === id ? colors.white : colors.brown.default} />
          <Text style={[styles.navText, active === id && styles.navTextActive]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  </View>
);

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;
const Divider = () => <View style={styles.divider} />;

export default function StyleGuideScreen() {
  const [active, setActive] = useState('logo');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <Sidebar active={active} onNav={setActive} />
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

          {/* LOGO */}
          <Section title="Logo">
            <Label>APP ICONS</Label>
            <View style={styles.logoGrid}>
              <View style={[styles.logoBox, { backgroundColor: colors.orange.light }]}>
                <HactuallyLogo size={80} useGradient />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.blue.light }]}>
                <HactuallyLogo size={80} color={colors.blue.default} />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.brown.light }]}>
                <HactuallyLogo size={80} color="#6A6B5A" />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.green.light }]}>
                <HactuallyLogo size={80} color="#3A6262" />
              </View>
            </View>

            <Divider />

            <Label>LOGO WITH TEXT</Label>
            <View style={styles.logoTextRow}>
              <View style={[styles.logoTextBox, { backgroundColor: colors.blue.default }]}>
                <HactuallyLogo size={24} color={colors.blue.light} />
                <Text style={[styles.logoText, { color: colors.blue.light, marginTop: 2 }]}>hactually</Text>
              </View>
              <View style={[styles.logoTextBox, { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.brown.light }]}>
                <HactuallyLogo size={24} color={colors.blue.default} />
                <Text style={[styles.logoText, { color: colors.blue.default, marginTop: 2 }]}>hactually</Text>
              </View>
            </View>

            <Divider />

            <Label>SOCIAL ICONS</Label>
            <View style={styles.iconRow}>
              <View style={styles.iconBox}><GoogleIcon size={24} color={colors.blue.default} /><Text style={styles.iconLabel}>Google</Text></View>
              <View style={styles.iconBox}><AppleIcon size={24} color={colors.blue.default} /><Text style={styles.iconLabel}>Apple</Text></View>
            </View>
          </Section>

          {/* TYPOGRAPHY */}
          <Section title="Typography">
            <Label>FONT FAMILY</Label>
            <Text style={styles.fontShowcase}>hactually</Text>
            <Text style={styles.fontMono}>font-family: 'Ezra', sans-serif</Text>

            <Divider />

            <Label>FONT WEIGHTS</Label>
            <View style={styles.weightRow}>
              <View style={styles.weightItem}><Text style={[styles.weightText, { fontWeight: '400' }]}>Regular</Text><Text style={styles.weightNum}>400</Text></View>
              <View style={styles.weightItem}><Text style={[styles.weightText, { fontWeight: '500' }]}>Medium</Text><Text style={styles.weightNum}>500</Text></View>
              <View style={styles.weightItem}><Text style={[styles.weightText, { fontWeight: '700' }]}>Bold</Text><Text style={styles.weightNum}>700</Text></View>
              <View style={styles.weightItem}><Text style={[styles.weightText, { fontWeight: '900' }]}>Black</Text><Text style={styles.weightNum}>900</Text></View>
            </View>

            <Divider />

            <Label>TYPE SCALE</Label>
            <View style={styles.typeScale}>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 40, fontWeight: '900' }]}>Display</Text><Text style={styles.typeSize}>40px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 32, fontWeight: '700' }]}>Heading</Text><Text style={styles.typeSize}>32px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 24, fontWeight: '700' }]}>Title</Text><Text style={styles.typeSize}>24px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 20, fontWeight: '500' }]}>Subtitle</Text><Text style={styles.typeSize}>20px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 16 }]}>Body</Text><Text style={styles.typeSize}>16px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 14 }]}>Small</Text><Text style={styles.typeSize}>14px</Text></View>
              <View style={styles.typeRow}><Text style={[styles.typeText, { fontSize: 12 }]}>Caption</Text><Text style={styles.typeSize}>12px</Text></View>
            </View>
          </Section>

          {/* BUTTONS */}
          <Section title="Buttons">
            <Label>SOLID</Label>
            <View style={styles.btnRow}>
              <Button variant="solid" color="blue">Blue</Button>
              <Button variant="solid" color="orange">Orange</Button>
              <Button variant="solid" color="brown">Brown</Button>
            </View>

            <Divider />

            <Label>OUTLINE</Label>
            <View style={styles.btnRow}>
              <Button variant="outline" color="blue">Blue</Button>
              <Button variant="outline" color="orange">Orange</Button>
              <Button variant="outline" color="brown">Brown</Button>
            </View>

            <Divider />

            <Label>GLASS (SOCIAL AUTH)</Label>
            <View style={styles.btnRow}>
              <Button variant="glass" leftIcon={<GoogleIcon size={20} />}>Google</Button>
              <Button variant="glass" leftIcon={<AppleIcon size={24} />}>Apple</Button>
            </View>

            <Divider />

            <Label>SIZES</Label>
            <View style={styles.btnRow}>
              <Button size="sm" variant="solid" color="blue">Small</Button>
              <Button size="md" variant="solid" color="blue">Medium</Button>
              <Button size="lg" variant="solid" color="blue">Large</Button>
            </View>
          </Section>

          {/* FORMS */}
          <Section title="Form Components">
            <Label>TEXT INPUT</Label>
            <View style={styles.inputBox}><Input placeholder="Default input" /></View>

            <Divider />

            <Label>WITH LABEL</Label>
            <View style={styles.inputBox}><Input label="Email Address" placeholder="you@example.com" keyboardType="email-address" /></View>

            <Divider />

            <Label>WITH ICON</Label>
            <View style={styles.inputBox}><Input placeholder="Search..." leftIcon={<Search size={18} color={colors.brown.default} />} /></View>

            <Divider />

            <Label>PASSWORD</Label>
            <View style={styles.inputBox}><Input placeholder="Enter password" secureTextEntry leftIcon={<Lock size={18} color={colors.brown.default} />} /></View>

            <Divider />

            <Label>WITH ERROR</Label>
            <View style={styles.inputBox}><Input placeholder="Email" error="Please enter a valid email" leftIcon={<Mail size={18} color={colors.orange.default} />} /></View>

            <Divider />

            <Label>MULTILINE (ROUNDED RECTANGLE)</Label>
            <View style={styles.inputBox}><Input placeholder="Write your bio..." multiline numberOfLines={3} /></View>

            <Divider />

            <Label>OTP INPUT</Label>
            <OTPInput value={otp} onChange={setOtp} />
          </Section>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brown.lighter },
  layout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 180, backgroundColor: colors.white, borderRadius: 16, margin: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  sidebarHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.brown.light + '33' },
  sidebarTitle: { fontSize: 18, fontFamily: fontFamily.black, fontWeight: '900', color: colors.blue.default },
  sidebarNav: { padding: 8 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  navItemActive: { backgroundColor: colors.blue.default },
  navText: { fontSize: 14, fontFamily: fontFamily.medium, color: colors.brown.default },
  navTextActive: { color: colors.white },
  content: { flex: 1 },
  contentInner: { padding: 16 },
  section: { marginBottom: 24 },
  card: { backgroundColor: colors.brown.mid, borderRadius: 16, padding: 20 },
  sectionTitle: { fontSize: 24, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.brown.dark, marginBottom: 20 },
  label: { fontSize: 12, fontFamily: fontFamily.bold, fontWeight: '700', color: colors.brown.dark, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  divider: { height: 1, backgroundColor: colors.brown.default + '33', marginVertical: 20 },
  // Logo
  logoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  logoBox: { width: 120, height: 120, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  logoTextRow: { flexDirection: 'row', gap: 12 },
  logoTextBox: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16 },
  logoText: { fontSize: 18, fontFamily: fontFamily.black, fontWeight: '900' },
  iconRow: { flexDirection: 'row', gap: 16 },
  iconBox: { alignItems: 'center', gap: 8 },
  iconLabel: { fontSize: 12, color: colors.brown.default },
  // Typography
  fontShowcase: { fontSize: 32, fontFamily: fontFamily.black, fontWeight: '900', color: colors.blue.default, marginBottom: 4 },
  fontMono: { fontSize: 12, fontFamily: 'monospace', color: colors.brown.default },
  weightRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  weightItem: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  weightText: { fontSize: 20, fontFamily: fontFamily.regular, color: colors.brown.dark },
  weightNum: { fontSize: 12, color: colors.brown.default },
  typeScale: { gap: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12 },
  typeText: { fontFamily: fontFamily.regular, color: colors.brown.dark },
  typeSize: { fontSize: 12, color: colors.brown.default },
  // Buttons
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  // Forms
  inputBox: { maxWidth: 400 },
});
