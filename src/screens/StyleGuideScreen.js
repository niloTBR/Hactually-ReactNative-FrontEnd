/**
 * StyleGuide Screen - Hactually 2.0 Design System
 * Using LEAN Design Token Standard
 */
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Type, MousePointer, FormInput, Mail, Lock, Search, Palette, Grid, Circle } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
// LEAN tokens
import { color, spacing, radius, typography } from '../theme';
// Legacy (for components not yet migrated)
import { colors, fontFamily, fontFamilySecondary } from '../theme';
import { Button, Input, OTPInput, Chip, DatePicker, GhostInput, GoogleIcon, AppleIcon, LogoMark, LogoWithText, AppIcon, ShimmerText } from '../components';
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
          <Icon size={16} color={active === id ? color.blue.light : color.olive.dark} />
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

/**
 * Form Theme Tokens
 * Two themes for ghost/outline form components:
 * - Light: Beige background
 * - Dark: Green background
 */
const FORM_THEMES = {
  light: {
    id: 'light',
    label: 'Light (Olive)',
    bg: color.olive.light,
    text: color.charcoal,
    theme: color.charcoal,
  },
  dark: {
    id: 'dark',
    label: 'Dark (Green)',
    bg: color.green.dark,
    text: color.green.light,
    theme: color.green.light,
  },
};

// Theme switcher component
const ThemeSwitcher = ({ selected, onSelect }) => (
  <View style={styles.themeSwitcher}>
    {Object.values(FORM_THEMES).map((theme) => (
      <TouchableOpacity
        key={theme.id}
        onPress={() => onSelect(theme.id)}
        style={[
          styles.themeSwitcherOption,
          { backgroundColor: theme.bg },
          selected === theme.id && styles.themeSwitcherOptionActive,
        ]}
      >
        <Text style={[styles.themeSwitcherText, { color: theme.text }]}>
          {theme.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function StyleGuideScreen() {
  const [active, setActive] = useState('colors');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formTheme, setFormTheme] = useState('light');

  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({});

  // Get current form theme
  const currentTheme = FORM_THEMES[formTheme];

  const handleNav = (sectionId) => {
    setActive(sectionId);
    const y = sectionPositions.current[sectionId];
    if (y !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: y - 16, animated: true });
    }
  };

  const handleSectionLayout = (sectionId) => (event) => {
    sectionPositions.current[sectionId] = event.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        <Sidebar active={active} onNav={handleNav} />
        <ScrollView ref={scrollViewRef} style={styles.content} contentContainerStyle={styles.contentInner}>

          {/* COLORS */}
          <View onLayout={handleSectionLayout('colors')}>
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
                  <ColorSwatch tokenName="color.olive.light" colorValue={color.olive.light} dark />
                  <ColorSwatch tokenName="color.olive.dark" colorValue={color.olive.dark} />
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
          </View>

          {/* LOGO */}
          <View onLayout={handleSectionLayout('logo')}>
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
                    <LogoMark size="lg" colorScheme="light" colorVariant="olive" />
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
                    <LogoMark size="lg" colorScheme="dark" colorVariant="olive" />
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
                    <AppIcon size="md" colorScheme="light" colorVariant="olive" />
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
                    <AppIcon size="md" colorScheme="dark" colorVariant="olive" />
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
                    <LogoWithText size="sm" colorScheme="light" colorVariant="olive" />
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
                    <LogoWithText size="sm" colorScheme="dark" colorVariant="olive" />
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
          </View>

          {/* TYPOGRAPHY */}
          <View onLayout={handleSectionLayout('typography')}>
          <Section title="Typography">
            <Label>3.1 TYPE SCALE</Label>
            <View style={styles.typeScaleContainer}>
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, styles.typeSampleHeadline, typography.h1]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>H1</Text>
                  <Text style={styles.typeSize}>{typography.h1.fontSize}px / {typography.h1.lineHeight}</Text>
                  <TokenLabel token="typography.h1" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, styles.typeSampleHeadline, typography.h2]}>It's hactually happening</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>H2</Text>
                  <Text style={styles.typeSize}>{typography.h2.fontSize}px / {typography.h2.lineHeight}</Text>
                  <TokenLabel token="typography.h2" />
                </View>
              </View>
              <View style={styles.typeDivider} />
              <View style={styles.typeScaleRow}>
                <Text style={[styles.typeSample, styles.typeSampleHeadline, typography.h3]}>It's hactually happening</Text>
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
                <Text style={[styles.typeSample, typography.link]}>Maybe later</Text>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeStyleName}>Link</Text>
                  <Text style={styles.typeSize}>{typography.link.fontSize}px / underline</Text>
                  <TokenLabel token="typography.link" />
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

            <Divider />

            <Label>3.2 SHIMMER TEXT</Label>
            <View style={[styles.shimmerShowcase, { backgroundColor: color.blue.dark }]}>
              <View style={styles.shimmerRow}>
                <Text style={[typography.h1, { color: color.blue.light }]}>it's </Text>
                <ShimmerText style={typography.h1} color={color.orange.dark} shimmerColor="rgba(255,255,255,0.5)">
                  hactually
                </ShimmerText>
                <Text style={[typography.h1, { color: color.blue.light }]}> happening</Text>
              </View>
              <TokenLabel token="ShimmerText" />
            </View>
          </Section>
          </View>

          {/* SPACING & RADIUS */}
          <View onLayout={handleSectionLayout('spacing')}>
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
          </View>

          {/* BUTTONS */}
          <View onLayout={handleSectionLayout('buttons')}>
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
                    <Button variant="solid" color="olive">Button</Button>
                    <TokenLabel token="Button.solid.olive" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="olive">Button</Button>
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
              <View style={[styles.btnGradientItem, { backgroundColor: colors.olive.light }]}>
                <Button variant="outline-gradient" fillColor={colors.olive.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Olive</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.green.light }]}>
                <Button variant="outline-gradient" fillColor={colors.green.light}>Button</Button>
                <Text style={styles.btnGradientLabel}>Green</Text>
              </View>
              <View style={[styles.btnGradientItem, { backgroundColor: colors.olive.lighter }]}>
                <Button variant="outline-gradient" fillColor={colors.olive.lighter}>Button</Button>
                <Text style={styles.btnGradientLabel}>Beige</Text>
              </View>
            </View>
            <TokenLabel token="Button.outline-gradient (uses gradients.borderLight)" />

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
              <View style={[styles.btnGradientItem, { backgroundColor: colors.olive.dark }]}>
                <Button variant="outline-gradient" color="dark" fillColor={colors.olive.dark}>Button</Button>
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
            <TokenLabel token="Button.outline-gradient + color='dark' (uses gradients.borderDark)" />

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

            <Label>5.4 OAUTH / SOCIAL</Label>
            <View style={styles.btnVariantRow}>
              <View style={[styles.btnVariantGroup, styles.btnOliveBg]}>
                <Text style={styles.btnVariantLabel}>Light</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="ghost" themeColor={color.olive.dark} leftIcon={<GoogleIcon size={20} variant="dark" />} fullWidth>
                    Continue with Google
                  </Button>
                  <TokenLabel token="Button.ghost + themeColor" />
                </View>
                <View style={styles.btnColorItem}>
                  <Button variant="ghost" themeColor={color.olive.dark} leftIcon={<AppleIcon size={24} variant="dark" />} fullWidth>
                    Continue with Apple
                  </Button>
                </View>
              </View>
              <View style={[styles.btnVariantGroup, styles.btnGreenDarkBg]}>
                <Text style={[styles.btnVariantLabel, { color: color.green.light }]}>Dark</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="ghost" themeColor={color.green.light} leftIcon={<GoogleIcon size={20} variant="light" />} fullWidth>
                    Continue with Google
                  </Button>
                  <TokenLabel token="Button.ghost + themeColor" />
                </View>
                <View style={styles.btnColorItem}>
                  <Button variant="ghost" themeColor={color.green.light} leftIcon={<AppleIcon size={24} variant="light" />} fullWidth>
                    Continue with Apple
                  </Button>
                </View>
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
          </View>

          {/* FORMS */}
          <View onLayout={handleSectionLayout('inputs')}>
          <Section title="Form Components">

            <Label>6.1 GHOST VARIANT (Theme Adaptive)</Label>
            <ThemeSwitcher selected={formTheme} onSelect={setFormTheme} />

            <GhostTheme
              themeColor={currentTheme.theme}
              isDark={formTheme === 'dark'}
              style={[styles.formShowcase, { backgroundColor: currentTheme.bg }]}
            >
              {/* Row 1: With Label & OTP */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>With Label</Text>
                  <Input label="Email" placeholder="you@example.com" variant="ghost" />
                  <TokenLabel token="Input.ghost + label" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>OTP</Text>
                  <View style={{ alignSelf: 'flex-start' }}>
                    <OTPInput value={otp} onChange={setOtp} variant="ghost" />
                  </View>
                  <TokenLabel token="OTPInput.ghost" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentTheme.theme + '30' }]} />

              {/* Row 2: Input & With Icon */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>Input</Text>
                  <Input placeholder="Enter text..." variant="ghost" />
                  <TokenLabel token="Input.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>With Icon</Text>
                  <Input placeholder="Search..." variant="ghost" leftIcon={<Search size={18} />} />
                  <TokenLabel token="Input.ghost + leftIcon" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentTheme.theme + '30' }]} />

              {/* Row 3: Password & With Error */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>Password</Text>
                  <Input placeholder="Password" variant="ghost" secureTextEntry leftIcon={<Lock size={18} />} />
                  <TokenLabel token="Input.ghost + secureTextEntry" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>With Error</Text>
                  <Input placeholder="Email" variant="ghost" error="Invalid email" />
                  <TokenLabel token="Input.ghost + error" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentTheme.theme + '30' }]} />

              {/* Row 4: DatePicker & Multiline */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>DatePicker</Text>
                  <DatePicker placeholder="Date of birth" variant="ghost" onChange={() => {}} />
                  <TokenLabel token="DatePicker.ghost" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>Multiline</Text>
                  <Input placeholder="Write your bio..." variant="ghost" multiline numberOfLines={2} />
                  <TokenLabel token="Input.ghost + multiline" />
                </View>
              </View>
              <View style={[styles.formDivider, { borderColor: currentTheme.theme + '30' }]} />

              {/* Row 5: Email Action & Chips */}
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>Email Action</Text>
                  <GhostInput placeholder="Enter email..." leftIcon={<Mail />} onSubmit={() => {}} />
                  <TokenLabel token="GhostInput" />
                </View>
                <View style={styles.formCol}>
                  <Text style={[styles.formLabel, { color: currentTheme.text }]}>Chips</Text>
                  <View style={styles.chipRow}>
                    <Chip label="Default" variant="ghost" />
                    <Chip label="Selected" variant="ghost" selected onRemove={() => {}} />
                    <Chip label="Emoji" emoji="🔥" variant="ghost" />
                    <Chip label="Disabled" variant="ghost" disabled />
                  </View>
                  <TokenLabel token="Chip.ghost" />
                </View>
              </View>
            </GhostTheme>

            </Section>
          </View>

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
  sidebarHeader: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: color.olive.light },
  sidebarTitle: { ...typography.h3, color: color.blue.dark },
  sidebarNav: { padding: spacing.sm },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radius.md, marginBottom: 4 },
  navItemActive: { backgroundColor: color.blue.dark },
  navText: { ...typography.body, color: color.olive.dark },
  navTextActive: { color: color.blue.light },
  content: { flex: 1 },
  contentInner: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  card: { backgroundColor: colors.olive.mid, borderRadius: radius.lg, padding: spacing['3xl'] },
  sectionTitle: { ...typography.h1, color: color.charcoal, marginBottom: spacing['2xl'] },
  label: { ...typography.button, color: color.charcoal, marginBottom: spacing.xl, marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: color.olive.dark, marginVertical: spacing['2xl'] },
  // Logo
  logoMarkSplit: { flexDirection: 'row', gap: spacing['3xl'] },
  logoMarkGroup: { flex: 1 },
  logoMarkGroupLabel: { ...typography.body, color: color.charcoal, marginBottom: spacing['2xl'] },
  logoMarkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  logoMarkItem: { alignItems: 'flex-start', gap: spacing.md },
  logoMarkLabel: { ...typography.body, color: color.olive.dark },
  tokenLabelContainer: { backgroundColor: color.beige, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.md, marginTop: 2, alignSelf: 'flex-start' },
  tokenLabel: { fontSize: 10, color: color.charcoal, fontFamily: 'monospace' },
  logoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  logoBoxItem: { alignItems: 'flex-start', gap: spacing.sm },
  logoBox: { width: 80, height: 80, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  logoBoxLabel: { ...typography.body, color: color.olive.dark },
  logoTextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2xl'], width: 480 },
  logoTextItem: { alignItems: 'flex-start', gap: spacing.sm, width: 220, marginBottom: spacing.lg },
  logoTextInline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoText: { ...typography.h3 },
  iconRow: { flexDirection: 'row', gap: spacing['2xl'] },
  iconBox: { alignItems: 'flex-start', gap: spacing.sm },
  iconLabel: { ...typography.body, color: color.olive.dark },
  // Colors
  colorBrandGrid: { flexDirection: 'row', gap: spacing['3xl'] },
  colorBrandColumn: { gap: spacing.md },
  colorBrandName: { ...typography.bodyStrong, color: color.charcoal },
  colorPairRow: { flexDirection: 'row', gap: spacing.lg },
  colorSwatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  colorSwatchItem: { alignItems: 'flex-start', gap: 6 },
  colorSwatch: { width: 64, height: 64, borderRadius: radius.md },
  colorSwatchBorder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.md, borderWidth: 1, borderColor: color.olive.light },
  colorSwatchValue: { fontSize: 10, fontFamily: 'monospace', color: color.olive.dark },
  // Typography
  typeScaleContainer: { width: '60%', gap: 24 },
  typeScaleRow: { gap: 8 },
  typeSample: { color: color.charcoal },
  typeSampleHeadline: { color: color.blue.dark },
  typeInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  typeStyleName: { fontSize: 14, fontFamily: fontFamilySecondary.regular, color: color.charcoal, fontWeight: '600' },
  typeSize: { fontSize: 12, color: color.olive.dark, fontFamily: fontFamilySecondary.regular },
  typeDivider: { height: 1, backgroundColor: color.olive.light, marginVertical: spacing.lg },
  // Shimmer text showcase
  shimmerShowcase: { padding: spacing['2xl'], borderRadius: radius.lg, alignItems: 'flex-start', gap: spacing.md },
  shimmerRow: { flexDirection: 'row', alignItems: 'baseline' },
  // Spacing & Radius (matching columns)
  spacingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  spacingItem: { width: 80, alignItems: 'center', gap: 6 },
  spacingBox: { backgroundColor: color.blue.light, borderRadius: radius.md },
  spacingLabel: { fontSize: 14, fontFamily: fontFamily.bold, color: color.charcoal },
  spacingValue: { fontSize: 12, color: color.olive.dark, fontFamily: fontFamilySecondary.regular },
  radiusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  radiusItem: { width: 80, alignItems: 'center', gap: 6 },
  radiusBox: { width: 64, height: 64, backgroundColor: color.blue.light },
  radiusLabel: { fontSize: 14, fontFamily: fontFamily.bold, color: color.charcoal },
  radiusValue: { fontSize: 12, color: color.olive.dark, fontFamily: fontFamilySecondary.regular },
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
  btnLightBg: { backgroundColor: colors.olive.mid, padding: spacing.lg, borderRadius: radius.lg },
  btnOliveBg: { backgroundColor: colors.olive.light, padding: spacing.lg, borderRadius: radius.lg },
  btnDarkBg: { backgroundColor: colors.olive.dark, padding: spacing.lg, borderRadius: radius.lg },
  btnGreenDarkBg: { backgroundColor: color.green.dark, padding: spacing.lg, borderRadius: radius.lg },
  btnGradientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  btnGradientItem: { padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', gap: spacing.sm },
  btnGradientLabel: { fontSize: 11, fontWeight: '600', color: colors.olive.dark },
  btnGradientSubLabel: { fontSize: 12, fontWeight: '600', color: color.olive.dark, marginBottom: spacing.sm, marginTop: spacing.sm },
  // Forms - Theme switcher
  themeSwitcher: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  themeSwitcherOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 2, borderColor: 'transparent' },
  themeSwitcherOptionActive: { borderColor: color.charcoal },
  themeSwitcherText: { ...typography.caption, fontWeight: '600' },
  // Forms - Showcase
  formShowcase: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.lg },
  formRow: { flexDirection: 'row', gap: spacing.xl },
  formCol: { flex: 1, gap: spacing.sm },
  formLabel: { ...typography.caption, fontWeight: '600' },
  formDivider: { borderBottomWidth: 1, marginVertical: spacing.sm },
  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  // Token table
  tokenTable: { borderWidth: 1, borderColor: color.olive.light, borderRadius: radius.md, overflow: 'hidden' },
  tokenTableHeader: { flexDirection: 'row', backgroundColor: color.olive.light, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tokenTableHeaderText: { ...typography.caption, fontWeight: '700', color: color.charcoal },
  tokenTableRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.olive.light, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tokenTableCell: { ...typography.caption, color: color.charcoal },
  tokenCode: { fontFamily: 'monospace', fontSize: 11 },
  // Code block
  codeBlock: { backgroundColor: color.charcoal, padding: spacing.lg, borderRadius: radius.lg },
  codeText: { fontFamily: 'monospace', fontSize: 12, color: color.green.light, lineHeight: 20 },
});
