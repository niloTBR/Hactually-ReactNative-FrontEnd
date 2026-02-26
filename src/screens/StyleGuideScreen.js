/**
 * StyleGuide Screen - Hactually 2.0 Design System
 * Using LEAN Design Token Standard
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Type, MousePointer, FormInput, Mail, Lock, Search, Palette, Grid, Circle } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
// LEAN tokens
import { color, spacing, radius, typography } from '../theme';
// Legacy (for components not yet migrated)
import { colors, fontFamily, fontFamilySecondary } from '../theme';
import { Button, Input, OTPInput, Chip, DatePicker, GhostInput, GoogleIcon, AppleIcon, LogoMark, LogoWithText, AppIcon } from '../components';
import { GhostTheme } from '../theme';

const sections = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'logo', label: 'Logo', icon: Eye },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'spacing', label: 'Spacing', icon: Grid },
  { id: 'buttons', label: 'Buttons', icon: MousePointer },
  { id: 'inputs', label: 'Forms', icon: FormInput },
];

// Token label (copyable) - simplified naming
const TokenLabel = ({ token }) => {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(token);
  };

  return (
    <TouchableOpacity onPress={handleCopy} style={[styles.tokenLabelContainer, { cursor: 'copy' }]}>
      <Text style={styles.tokenLabel}>{token}</Text>
    </TouchableOpacity>
  );
};

// Color swatch component
const ColorSwatch = ({ tokenName, colorValue, dark }) => (
  <View style={styles.colorSwatchItem}>
    <View style={[styles.colorSwatch, { backgroundColor: colorValue }]}>
      {dark && <View style={styles.colorSwatchBorder} />}
    </View>
    <Text style={styles.colorSwatchValue}>{colorValue}</Text>
    <TokenLabel token={tokenName} />
  </View>
);

// Color group component
const ColorGroup = ({ title, tokens }) => (
  <View style={styles.colorGroup}>
    <Text style={styles.colorGroupTitle}>{title}</Text>
    <View style={styles.colorSwatchRow}>
      {tokens.map(({ name, value, dark }) => (
        <ColorSwatch key={name} tokenName={name} colorValue={value} dark={dark} />
      ))}
    </View>
  </View>
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
          <Icon size={16} color={active === id ? color.blue.light : color.brown.dark} />
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

// Background options for form showcase
// All fields use ghost/outline style - theme is the contrasting color for borders/text
const LIGHT_BACKGROUNDS = [
  { id: 'beige', label: 'Beige', bg: color.beige, text: color.charcoal, theme: color.charcoal },
  { id: 'olive', label: 'Olive', bg: color.brown.light, text: color.brown.dark, theme: color.brown.dark },
];

const DARK_BACKGROUNDS = [
  { id: 'green', label: 'Green', bg: color.green.dark, text: color.green.light, theme: color.green.light },
  { id: 'olive', label: 'Olive', bg: color.brown.dark, text: color.brown.light, theme: color.brown.light },
];

// Simple dropdown selector
const BgSelector = ({ options, selected, onSelect, label }) => (
  <View style={styles.bgSelector}>
    <Text style={styles.bgSelectorLabel}>{label}</Text>
    <View style={styles.bgSelectorOptions}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          onPress={() => onSelect(opt.id)}
          style={[
            styles.bgSelectorOption,
            { backgroundColor: opt.bg },
            selected === opt.id && styles.bgSelectorOptionActive,
          ]}
        >
          <Text style={[styles.bgSelectorOptionText, { color: opt.text }]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function StyleGuideScreen() {
  const [active, setActive] = useState('logo');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [lightBg, setLightBg] = useState('beige');
  const [darkBg, setDarkBg] = useState('green');

  // Get current background settings
  const currentLight = LIGHT_BACKGROUNDS.find(b => b.id === lightBg) || LIGHT_BACKGROUNDS[0];
  const currentDark = DARK_BACKGROUNDS.find(b => b.id === darkBg) || DARK_BACKGROUNDS[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <Sidebar active={active} onNav={setActive} />
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

          {/* COLORS */}
          <Section title="Colors">
            <Label>1.1 BRAND COLORS</Label>
            <View style={styles.colorBrandGrid}>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Orange</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.orange.light" colorValue={color.orange.light} dark />
                  <ColorSwatch tokenName="color.orange.dark" colorValue={color.orange.dark} />
                </View>
              </View>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Blue</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.blue.light" colorValue={color.blue.light} dark />
                  <ColorSwatch tokenName="color.blue.dark" colorValue={color.blue.dark} />
                </View>
              </View>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Olive</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.olive.light" colorValue={color.brown.light} dark />
                  <ColorSwatch tokenName="color.olive.dark" colorValue={color.brown.dark} />
                </View>
              </View>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Green</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.green.light" colorValue={color.green.light} dark />
                  <ColorSwatch tokenName="color.green.dark" colorValue={color.green.dark} />
                </View>
              </View>
            </View>

            <Divider />

            <Label>1.2 NEUTRALS</Label>
            <View style={styles.colorBrandGrid}>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Beige</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.beige" colorValue={color.beige} dark />
                </View>
              </View>
              <View style={styles.colorBrandColumn}>
                <Text style={styles.colorBrandName}>Charcoal</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.charcoal" colorValue={color.charcoal} />
                </View>
              </View>
            </View>
          </Section>

          {/* LOGO */}
          <Section title="Logo">
            <Label>2.1 LOGO MARK</Label>
            <View style={styles.logoMarkSplit}>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Light</Text>
                <View style={styles.logoMarkRow}>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="light" colorVariant="orange" />
                    <Text style={styles.logoMarkLabel}>Orange</Text>
                    <TokenLabel token="color.orange.light" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="light" colorVariant="blue" />
                    <Text style={styles.logoMarkLabel}>Blue</Text>
                    <TokenLabel token="color.blue.light" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="light" colorVariant="brown" />
                    <Text style={styles.logoMarkLabel}>Olive</Text>
                    <TokenLabel token="color.olive.light" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="light" colorVariant="green" />
                    <Text style={styles.logoMarkLabel}>Green</Text>
                    <TokenLabel token="color.green.light" />
                  </View>
                </View>
              </View>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Dark</Text>
                <View style={styles.logoMarkRow}>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="dark" colorVariant="orange" />
                    <Text style={styles.logoMarkLabel}>Orange</Text>
                    <TokenLabel token="color.orange.dark" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="dark" colorVariant="blue" />
                    <Text style={styles.logoMarkLabel}>Blue</Text>
                    <TokenLabel token="color.blue.dark" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="dark" colorVariant="brown" />
                    <Text style={styles.logoMarkLabel}>Olive</Text>
                    <TokenLabel token="color.olive.dark" />
                  </View>
                  <View style={styles.logoMarkItem}>
                    <LogoMark size="lg" colorScheme="dark" colorVariant="green" />
                    <Text style={styles.logoMarkLabel}>Green</Text>
                    <TokenLabel token="color.green.dark" />
                  </View>
                </View>
              </View>
            </View>

            <Divider />

            <Label>2.2 APP ICONS</Label>
            <View style={styles.logoMarkSplit}>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Light Background</Text>
                <View style={styles.logoGrid}>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="light" colorVariant="orange" />
                    <Text style={styles.logoBoxLabel}>Orange</Text>
                    <TokenLabel token="color.orange.light" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="light" colorVariant="blue" />
                    <Text style={styles.logoBoxLabel}>Blue</Text>
                    <TokenLabel token="color.blue.light" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="light" colorVariant="brown" />
                    <Text style={styles.logoBoxLabel}>Olive</Text>
                    <TokenLabel token="color.olive.light" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="light" colorVariant="green" />
                    <Text style={styles.logoBoxLabel}>Green</Text>
                    <TokenLabel token="color.green.light" />
                  </View>
                </View>
              </View>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Dark Background</Text>
                <View style={styles.logoGrid}>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="dark" colorVariant="orange" />
                    <Text style={styles.logoBoxLabel}>Orange</Text>
                    <TokenLabel token="color.orange.dark" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="dark" colorVariant="blue" />
                    <Text style={styles.logoBoxLabel}>Blue</Text>
                    <TokenLabel token="color.blue.dark" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="dark" colorVariant="brown" />
                    <Text style={styles.logoBoxLabel}>Olive</Text>
                    <TokenLabel token="color.olive.dark" />
                  </View>
                  <View style={styles.logoBoxItem}>
                    <AppIcon size="md" colorScheme="dark" colorVariant="green" />
                    <Text style={styles.logoBoxLabel}>Green</Text>
                    <TokenLabel token="color.green.dark" />
                  </View>
                </View>
              </View>
            </View>

            <Divider />

            <Label>2.3 LOGO WITH TEXT</Label>
            <View style={styles.logoMarkSplit}>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Light</Text>
                <View style={styles.logoTextGrid}>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="light" colorVariant="orange" />
                    <Text style={styles.logoBoxLabel}>Orange</Text>
                    <TokenLabel token="color.orange.light" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="light" colorVariant="blue" />
                    <Text style={styles.logoBoxLabel}>Blue</Text>
                    <TokenLabel token="color.blue.light" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="light" colorVariant="brown" />
                    <Text style={styles.logoBoxLabel}>Olive</Text>
                    <TokenLabel token="color.olive.light" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="light" colorVariant="green" />
                    <Text style={styles.logoBoxLabel}>Green</Text>
                    <TokenLabel token="color.green.light" />
                  </View>
                </View>
              </View>
              <View style={styles.logoMarkGroup}>
                <Text style={styles.logoMarkGroupLabel}>Dark</Text>
                <View style={styles.logoTextGrid}>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="dark" colorVariant="orange" />
                    <Text style={styles.logoBoxLabel}>Orange</Text>
                    <TokenLabel token="color.orange.dark" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="dark" colorVariant="blue" />
                    <Text style={styles.logoBoxLabel}>Blue</Text>
                    <TokenLabel token="color.blue.dark" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="dark" colorVariant="brown" />
                    <Text style={styles.logoBoxLabel}>Olive</Text>
                    <TokenLabel token="color.olive.dark" />
                  </View>
                  <View style={styles.logoTextItem}>
                    <LogoWithText size="sm" colorScheme="dark" colorVariant="green" />
                    <Text style={styles.logoBoxLabel}>Green</Text>
                    <TokenLabel token="color.green.dark" />
                  </View>
                </View>
              </View>
            </View>

            <Divider />

            <Label>2.4 SOCIAL ICONS</Label>
            <View style={styles.iconRow}>
              <View style={styles.iconBox}><GoogleIcon size={24} color={color.blue.dark} /><Text style={styles.iconLabel}>Google</Text></View>
              <View style={styles.iconBox}><AppleIcon size={24} color={color.blue.dark} /><Text style={styles.iconLabel}>Apple</Text></View>
            </View>
          </Section>

          {/* TYPOGRAPHY */}
          <Section title="Typography">
            <Label>3.1 TYPE SCALE</Label>
            <View style={styles.typeScaleContainer}>
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.h1]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>H1</Text>
                  <Text style={styles.typeSize}>{typography.h1.fontSize}px / {typography.h1.lineHeight}</Text>
                  <TokenLabel token="typography.h1" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.h2]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>H2</Text>
                  <Text style={styles.typeSize}>{typography.h2.fontSize}px / {typography.h2.lineHeight}</Text>
                  <TokenLabel token="typography.h2" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.h3]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>H3</Text>
                  <Text style={styles.typeSize}>{typography.h3.fontSize}px / {typography.h3.lineHeight}</Text>
                  <TokenLabel token="typography.h3" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.body]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>Body</Text>
                  <Text style={styles.typeSize}>{typography.body.fontSize}px / {typography.body.lineHeight}</Text>
                  <TokenLabel token="typography.body" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.bodyStrong]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>Body Strong</Text>
                  <Text style={styles.typeSize}>{typography.bodyStrong.fontSize}px / {typography.bodyStrong.lineHeight}</Text>
                  <TokenLabel token="typography.bodyStrong" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.caption]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>Caption</Text>
                  <Text style={styles.typeSize}>{typography.caption.fontSize}px / {typography.caption.lineHeight}</Text>
                  <TokenLabel token="typography.caption" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, typography.button]}>START SPOTTING</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>Button</Text>
                  <Text style={styles.typeSize}>{typography.button.fontSize}px / {typography.button.lineHeight}</Text>
                  <TokenLabel token="typography.button" />
                </View>
              </View>
            </View>
          </Section>

          {/* SPACING & RADIUS */}
          <Section title="Spacing & Radius">
            <Label>4.1 SPACING</Label>
            <View style={styles.spacingGrid}>
              {Object.entries(spacing).map(([key, value]) => (
                <View key={key} style={styles.spacingItem}>
                  <View style={[styles.spacingBox, { width: value, height: value }]} />
                  <Text style={styles.spacingLabel}>{key}</Text>
                  <Text style={styles.spacingValue}>{value}px</Text>
                  <TokenLabel token={`spacing.${key}`} />
                </View>
              ))}
            </View>

            <Divider />

            <Label>4.2 RADIUS</Label>
            <View style={styles.radiusGrid}>
              {Object.entries(radius).map(([key, value]) => (
                <View key={key} style={styles.radiusItem}>
                  <View style={[styles.radiusBox, { borderRadius: value }]} />
                  <Text style={styles.radiusLabel}>{key}</Text>
                  <Text style={styles.radiusValue}>{value === 9999 ? 'full' : `${value}px`}</Text>
                  <TokenLabel token={`radius.${key}`} />
                </View>
              ))}
            </View>
          </Section>

          {/* BUTTONS */}
          <Section title="Buttons">
            <Label>5.1 SOLID & OUTLINE</Label>
            <View style={styles.btn2x2Grid}>
              <View style={styles.btn2x2Cell}>
                <Text style={styles.btn2x2Label}>Orange</Text>
                <View style={styles.btn2x2Pair}>
                  <View style={styles.btnColorItem}>
                    <Button variant="solid" color="orange">Button</Button>
                    <TokenLabel token="Button.solid.orange" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="orange">Button</Button>
                    <TokenLabel token="Button.outline.orange" />
                  </View>
                </View>
              </View>
              <View style={styles.btn2x2Cell}>
                <Text style={styles.btn2x2Label}>Blue</Text>
                <View style={styles.btn2x2Pair}>
                  <View style={styles.btnColorItem}>
                    <Button variant="solid" color="blue">Button</Button>
                    <TokenLabel token="Button.solid.blue" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="blue">Button</Button>
                    <TokenLabel token="Button.outline.blue" />
                  </View>
                </View>
              </View>
              <View style={styles.btn2x2Cell}>
                <Text style={styles.btn2x2Label}>Olive</Text>
                <View style={styles.btn2x2Pair}>
                  <View style={styles.btnColorItem}>
                    <Button variant="solid" color="brown">Button</Button>
                    <TokenLabel token="Button.solid.olive" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="brown">Button</Button>
                    <TokenLabel token="Button.outline.olive" />
                  </View>
                </View>
              </View>
              <View style={styles.btn2x2Cell}>
                <Text style={styles.btn2x2Label}>Green</Text>
                <View style={styles.btn2x2Pair}>
                  <View style={styles.btnColorItem}>
                    <Button variant="solid" color="green">Button</Button>
                    <TokenLabel token="Button.solid.green" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="green">Button</Button>
                    <TokenLabel token="Button.outline.green" />
                  </View>
                </View>
              </View>
            </View>

            <Divider />

            <Label>5.2 OUTLINE GRADIENT (fillColor prop)</Label>
            <Text style={styles.btnGradientSubLabel}>Light Backgrounds</Text>
            <View style={styles.btnGradientGrid}>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.orange.light }]}>
                <Button variant="outline-gradient" fillColor={colors.orange.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Orange</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.blue.light }]}>
                <Button variant="outline-gradient" fillColor={colors.blue.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Blue</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.brown.light }]}>
                <Button variant="outline-gradient" fillColor={colors.brown.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Olive</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.green.light }]}>
                <Button variant="outline-gradient" fillColor={colors.green.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Green</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.brown.lighter }]}>
                <Button variant="outline-gradient" fillColor={colors.brown.lighter}>Button</Button>
                <Text style={styles.btnGradientLabel}>Beige</Text>
              </View>
            </View>
            <Text style={styles.btnGradientSubLabel}>Dark Backgrounds</Text>
            <View style={styles.btnGradientGrid}>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.orange.default }]}>
                <Button variant="outline-gradient" color="dark" fillColor={colors.orange.default}>Button</Button>
                <Text style={[styles.btnGradientLabel, { color: colors.white }]}>Orange</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.blue.default }]}>
                <Button variant="outline-gradient" color="dark" fillColor={colors.blue.default}>Button</Button>
                <Text style={[styles.btnGradientLabel, { color: colors.white }]}>Blue</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.brown.dark }]}>
                <Button variant="outline-gradient" color="dark" fillColor={colors.brown.dark}>Button</Button>
                <Text style={[styles.btnGradientLabel, { color: colors.white }]}>Olive</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.green.dark }]}>
                <Button variant="outline-gradient" color="dark" fillColor={colors.green.dark}>Button</Button>
                <Text style={[styles.btnGradientLabel, { color: colors.white }]}>Green</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: color.charcoal }]}>
                <Button variant="outline-gradient" color="dark" fillColor={color.charcoal}>Button</Button>
                <Text style={[styles.btnGradientLabel, { color: colors.white }]}>Charcoal</Text>
              </View>
            </View>

            <Divider />

            <Label>5.3 CHECK IN</Label>
            <View style={styles.btnVariantRow}>
              <View style={[styles.btnVariantGroup, styles.btnOliveBg]}>
                <Text style={styles.btnVariantLabel}>Light</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="checkin" color="light" caption="1 credit">Check in</Button>
                  <TokenLabel token="Button.checkin.light" />
                </View>
              </View>
              <View style={[styles.btnVariantGroup, styles.btnDarkBg]}>
                <Text style={[styles.btnVariantLabel, { color: color.beige }]}>Dark</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="checkin" color="dark" caption="1 credit">Check in</Button>
                  <TokenLabel token="Button.checkin.dark" />
                </View>
              </View>
            </View>

            <Divider />

            <Label>5.4 GLASS</Label>
            <View style={styles.btnGlassRow}>
              <View style={styles.btnColorItem}>
                <Button variant="glass" leftIcon={<GoogleIcon size={20} />}>Google</Button>
                <TokenLabel token="Button.glass" />
              </View>
              <View style={styles.btnColorItem}>
                <Button variant="glass" leftIcon={<AppleIcon size={24} />}>Apple</Button>
                <TokenLabel token="Button.glass" />
              </View>
            </View>

            <Divider />

            <Label>5.5 SIZES</Label>
            <View style={styles.btnColorGrid}>
              <View style={styles.btnColorItem}>
                <Button size="sm" variant="solid" color="blue">Small</Button>
                <TokenLabel token="Button.size.sm" />
              </View>
              <View style={styles.btnColorItem}>
                <Button size="lg" variant="solid" color="blue">Large</Button>
                <TokenLabel token="Button.size.lg" />
              </View>
            </View>
          </Section>

          {/* FORMS */}
          <Section title="Form Components">

            {/* LIGHT BACKGROUNDS */}
            <Label>6.1 LIGHT BACKGROUNDS (Default)</Label>
            <BgSelector options={LIGHT_BACKGROUNDS} selected={lightBg} onSelect={setLightBg} label="Select background:" />

            <GhostTheme themeColor={currentLight.theme} style={[styles.formShowcase, { backgroundColor: currentLight.bg }]}>
              {/* Row 1: With Label & OTP */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>With Label</Text>
                  <Input label="Email" placeholder="you@example.com" variant="ghost" />
                  <TokenLabel token="Input.ghost + label" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>OTP</Text>
                  <View style={{ alignSelf: 'flex-start' }}>
                    <OTPInput value={otp} onChange={setOtp} variant="ghost" />
                  </View>
                  <TokenLabel token="OTPInput.ghost" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentLight.theme + '30' }]} />

              {/* Row 2: Input & With Icon */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>Input</Text>
                  <Input placeholder="Enter text..." variant="ghost" />
                  <TokenLabel token="Input.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>With Icon</Text>
                  <Input placeholder="Search..." variant="ghost" leftIcon={<Search size={18} />} />
                  <TokenLabel token="Input.ghost + leftIcon" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentLight.theme + '30' }]} />

              {/* Row 3: Password & With Error */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>Password</Text>
                  <Input placeholder="Password" variant="ghost" secureTextEntry leftIcon={<Lock size={18} />} />
                  <TokenLabel token="Input.ghost + secureTextEntry" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>With Error</Text>
                  <Input placeholder="Email" variant="ghost" error="Invalid email" />
                  <TokenLabel token="Input.ghost + error" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentLight.theme + '30' }]} />

              {/* Row 4: DatePicker & Multiline */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>DatePicker</Text>
                  <DatePicker placeholder="Date of birth" variant="ghost" onChange={() => {}} />
                  <TokenLabel token="DatePicker.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>Multiline</Text>
                  <Input placeholder="Write your bio..." variant="ghost" multiline numberOfLines={2} />
                  <TokenLabel token="Input.ghost + multiline" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentLight.theme + '30' }]} />

              {/* Row 5: Chips */}
              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.formLabel, { color: currentLight.text }]}>Chips</Text>
                  <View style={styles.chipRow}>
                    <Chip label="Default" variant="ghost" />
                    <Chip label="Selected" variant="ghost" selected onRemove={() => {}} />
                    <Chip label="Fire" emoji="🔥" variant="ghost" />
                    <Chip label="Disabled" variant="ghost" disabled />
                  </View>
                  <TokenLabel token="Chip.ghost" />
                </View>
              </View>
            </GhostTheme>

            <Divider />

            {/* DARK BACKGROUNDS */}
            <Label>6.2 DARK BACKGROUNDS (Ghost Variant)</Label>
            <BgSelector options={DARK_BACKGROUNDS} selected={darkBg} onSelect={setDarkBg} label="Select background:" />

            <GhostTheme themeColor={currentDark.theme} isDark style={[styles.formShowcase, { backgroundColor: currentDark.bg }]}>
              {/* Row 1: With Label & OTP */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>With Label</Text>
                  <Input label="Email" placeholder="you@example.com" variant="ghost" />
                  <TokenLabel token="Input.ghost + label" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>OTP</Text>
                  <View style={{ alignSelf: 'flex-start' }}>
                    <OTPInput value={['', '', '', '', '', '']} onChange={() => {}} variant="ghost" />
                  </View>
                  <TokenLabel token="OTPInput.ghost" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentDark.theme + '30' }]} />

              {/* Row 2: Input & With Icon */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>Input</Text>
                  <Input placeholder="Enter text..." variant="ghost" />
                  <TokenLabel token="Input.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>With Icon</Text>
                  <Input placeholder="Search..." variant="ghost" leftIcon={<Search size={18} />} />
                  <TokenLabel token="Input.ghost + leftIcon" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentDark.theme + '30' }]} />

              {/* Row 3: Password & With Error */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>Password</Text>
                  <Input placeholder="Password" variant="ghost" secureTextEntry leftIcon={<Lock size={18} />} />
                  <TokenLabel token="Input.ghost + secureTextEntry" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>With Error</Text>
                  <Input placeholder="Email" variant="ghost" error="Invalid email" />
                  <TokenLabel token="Input.ghost + error" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentDark.theme + '30' }]} />

              {/* Row 4: DatePicker & Multiline */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>DatePicker</Text>
                  <DatePicker placeholder="Date of birth" variant="ghost" onChange={() => {}} />
                  <TokenLabel token="DatePicker.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>Multiline</Text>
                  <Input placeholder="Write your bio..." variant="ghost" multiline numberOfLines={2} />
                  <TokenLabel token="Input.ghost + multiline" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentDark.theme + '30' }]} />

              {/* Row 5: Email Action & Chips */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>Email Action</Text>
                  <GhostInput placeholder="Enter email..." leftIcon={<Mail />} onSubmit={() => {}} />
                  <TokenLabel token="GhostInput" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentDark.text }]}>Chips</Text>
                  <View style={styles.chipRow}>
                    <Chip label="Default" variant="ghost" />
                    <Chip label="Selected" variant="ghost" selected onRemove={() => {}} />
                    <Chip label="Fire" emoji="🔥" variant="ghost" />
                    <Chip label="Disabled" variant="ghost" disabled />
                  </View>
                  <TokenLabel token="Chip.ghost" />
                </View>
              </View>
            </GhostTheme>

            </Section>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.beige },
  layout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 180, backgroundColor: color.beige, borderRadius: radius.lg, margin: spacing.md, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  sidebarHeader: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: color.brown.light },
  sidebarTitle: { ...typography.h3, color: color.blue.dark },
  sidebarNav: { padding: spacing.sm },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radius.md, marginBottom: 4 },
  navItemActive: { backgroundColor: color.blue.dark },
  navText: { ...typography.body, color: color.brown.dark },
  navTextActive: { color: color.blue.light },
  content: { flex: 1 },
  contentInner: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  card: { backgroundColor: colors.brown.mid, borderRadius: radius.lg, padding: spacing['3xl'] },
  sectionTitle: { ...typography.h1, color: color.charcoal, marginBottom: spacing['2xl'] },
  label: { ...typography.button, color: color.charcoal, marginBottom: spacing.xl, marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: color.brown.dark, marginVertical: spacing['2xl'] },
  // Logo
  logoMarkSplit: { flexDirection: 'row', gap: spacing['3xl'] },
  logoMarkGroup: { flex: 1 },
  logoMarkGroupLabel: { ...typography.body, color: color.charcoal, marginBottom: spacing['2xl'] },
  logoMarkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  logoMarkItem: { alignItems: 'flex-start', gap: spacing.md },
  logoMarkLabel: { ...typography.body, color: color.brown.dark },
  tokenLabelContainer: { backgroundColor: color.beige, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.md, marginTop: 2, alignSelf: 'flex-start' },
  tokenLabel: { fontSize: 10, color: color.charcoal, fontFamily: 'monospace' },
  logoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  logoBoxItem: { alignItems: 'flex-start', gap: spacing.sm },
  logoBox: { width: 80, height: 80, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  logoBoxLabel: { ...typography.body, color: color.brown.dark },
  logoTextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2xl'], width: 480 },
  logoTextItem: { alignItems: 'flex-start', gap: spacing.sm, width: 220, marginBottom: spacing.lg },
  logoTextInline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoText: { ...typography.h3 },
  iconRow: { flexDirection: 'row', gap: spacing['2xl'] },
  iconBox: { alignItems: 'flex-start', gap: spacing.sm },
  iconLabel: { ...typography.body, color: color.brown.dark },
  // Colors
  colorBrandGrid: { flexDirection: 'row', gap: spacing['3xl'] },
  colorBrandColumn: { gap: spacing.md },
  colorBrandName: { ...typography.bodyStrong, color: color.charcoal },
  colorPairRow: { flexDirection: 'row', gap: spacing.lg },
  colorSwatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  colorSwatchItem: { alignItems: 'flex-start', gap: 6 },
  colorSwatch: { width: 64, height: 64, borderRadius: radius.md },
  colorSwatchBorder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.md, borderWidth: 1, borderColor: color.brown.light },
  colorSwatchValue: { fontSize: 10, fontFamily: 'monospace', color: color.brown.dark },
  // Typography
  typeScaleContainer: { width: '60%', gap: 24 },
  typeScaleRow: { gap: 8 },
  typeSample: { color: color.charcoal },
  typeInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  typeStyleName: { fontSize: 14, fontFamily: fontFamilySecondary.regular, color: color.charcoal, fontWeight: '600' },
  typeSize: { fontSize: 12, color: color.brown.dark, fontFamily: fontFamilySecondary.regular },
  typeDivider: { height: 1, backgroundColor: color.brown.light, marginVertical: spacing.lg },
  // Spacing & Radius (matching columns)
  spacingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  spacingItem: { width: 80, alignItems: 'center', gap: 6 },
  spacingBox: { backgroundColor: color.blue.light, borderRadius: radius.md },
  spacingLabel: { fontSize: 14, fontFamily: fontFamily.bold, color: color.charcoal },
  spacingValue: { fontSize: 12, color: color.brown.dark, fontFamily: fontFamilySecondary.regular },
  radiusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  radiusItem: { width: 80, alignItems: 'center', gap: 6 },
  radiusBox: { width: 64, height: 64, backgroundColor: color.blue.light },
  radiusLabel: { fontSize: 14, fontFamily: fontFamily.bold, color: color.charcoal },
  radiusValue: { fontSize: 12, color: color.brown.dark, fontFamily: fontFamilySecondary.regular },
  // Buttons
  btn2x2Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['3xl'] },
  btn2x2Cell: { width: '45%', gap: spacing.lg },
  btn2x2Label: { ...typography.bodyStrong, color: color.charcoal },
  btn2x2Pair: { flexDirection: 'row', gap: spacing.lg },
  btnVariantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2xl'] },
  btnVariantGroup: { width: '45%', gap: spacing.md },
  btnVariantLabel: { ...typography.body, color: color.charcoal, marginBottom: spacing.sm },
  btnColorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  btnColorItem: { alignItems: 'flex-start', gap: spacing.sm },
  btnLightBg: { backgroundColor: colors.brown.mid, padding: spacing.lg, borderRadius: radius.lg },
  btnOliveBg: { backgroundColor: colors.brown.light, padding: spacing.lg, borderRadius: radius.lg },
  btnDarkBg: { backgroundColor: colors.brown.dark, padding: spacing.lg, borderRadius: radius.lg },
  btnGradientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  btnGradientItem: { padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', gap: spacing.sm },
  btnGradientLabel: { fontSize: 11, fontWeight: '600', color: colors.brown.dark },
  btnGradientSubLabel: { fontSize: 12, fontWeight: '600', color: color.brown.dark, marginBottom: spacing.sm, marginTop: spacing.sm },
  btnGlassRow: { flexDirection: 'row', gap: spacing.xl, backgroundColor: color.blue.dark, padding: spacing.xl, borderRadius: radius.lg, alignSelf: 'flex-start' },
  // Forms - Background selector
  bgSelector: { marginBottom: spacing.xl },
  bgSelectorLabel: { ...typography.caption, color: color.charcoal, marginBottom: spacing.sm },
  bgSelectorOptions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  bgSelectorOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 2, borderColor: 'transparent' },
  bgSelectorOptionActive: { borderColor: color.charcoal },
  bgSelectorOptionText: { ...typography.caption, fontWeight: '600' },
  // Forms - Showcase
  formShowcase: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.lg },
  formRow: { flexDirection: 'row', gap: spacing.xl },
  formCol: { flex: 1, gap: spacing.sm },
  formLabel: { ...typography.caption, fontWeight: '600' },
  formDivider: { borderBottomWidth: 1, marginVertical: spacing.sm },
  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  // Token table
  tokenTable: { borderWidth: 1, borderColor: color.brown.light, borderRadius: radius.md, overflow: 'hidden' },
  tokenTableHeader: { flexDirection: 'row', backgroundColor: color.brown.light, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tokenTableHeaderText: { ...typography.caption, fontWeight: '700', color: color.charcoal },
  tokenTableRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.brown.light, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tokenTableCell: { ...typography.caption, color: color.charcoal },
  tokenCode: { fontFamily: 'monospace', fontSize: 11 },
  // Code block
  codeBlock: { backgroundColor: color.charcoal, padding: spacing.lg, borderRadius: radius.lg },
  codeText: { fontFamily: 'monospace', fontSize: 12, color: color.green.light, lineHeight: 20 },
});
