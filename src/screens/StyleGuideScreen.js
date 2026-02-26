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
import { Button, Input, OTPInput, GoogleIcon, AppleIcon, LogoMark, LogoWithText, AppIcon } from '../components';

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

export default function StyleGuideScreen() {
  const [active, setActive] = useState('logo');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

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
                <Text style={styles.colorBrandName}>Brown</Text>
                <View style={styles.colorPairRow}>
                  <ColorSwatch tokenName="color.brown.light" colorValue={color.brown.light} dark />
                  <ColorSwatch tokenName="color.brown.dark" colorValue={color.brown.dark} />
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
                    <Text style={styles.logoMarkLabel}>Brown</Text>
                    <TokenLabel token="color.brown.light" />
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
                    <Text style={styles.logoMarkLabel}>Brown</Text>
                    <TokenLabel token="color.brown.dark" />
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
                    <Text style={styles.logoBoxLabel}>Brown</Text>
                    <TokenLabel token="color.brown.light" />
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
                    <Text style={styles.logoBoxLabel}>Brown</Text>
                    <TokenLabel token="color.brown.dark" />
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
                    <Text style={styles.logoBoxLabel}>Brown</Text>
                    <TokenLabel token="color.brown.light" />
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
                    <Text style={styles.logoBoxLabel}>Brown</Text>
                    <TokenLabel token="color.brown.dark" />
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
                <Text style={styles.btn2x2Label}>Brown</Text>
                <View style={styles.btn2x2Pair}>
                  <View style={styles.btnColorItem}>
                    <Button variant="solid" color="brown">Button</Button>
                    <TokenLabel token="Button.solid.brown" />
                  </View>
                  <View style={styles.btnColorItem}>
                    <Button variant="outline" color="brown">Button</Button>
                    <TokenLabel token="Button.outline.brown" />
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

            <Label>5.2 OUTLINE GRADIENT</Label>
            <View style={styles.btnVariantRow}>
              <View style={[styles.btnVariantGroup, styles.btnLightBg]}>
                <Text style={styles.btnVariantLabel}>Light</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="outline-gradient" color="light">Button</Button>
                  <TokenLabel token="Button.outlineGradient.light" />
                </View>
              </View>
              <View style={[styles.btnVariantGroup, styles.btnDarkBg]}>
                <Text style={[styles.btnVariantLabel, { color: color.beige }]}>Dark</Text>
                <View style={styles.btnColorItem}>
                  <Button variant="outline-gradient" color="dark">Button</Button>
                  <TokenLabel token="Button.outlineGradient.dark" />
                </View>
              </View>
            </View>

            <Divider />

            <Label>5.3 CHECK IN</Label>
            <View style={styles.btnVariantRow}>
              <View style={[styles.btnVariantGroup, styles.btnLightBg]}>
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
            <Label>6.1 WITHOUT LABEL</Label>
            <View style={styles.formGrid}>
              <View style={styles.formColumn}>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>Default</Text>
                  <Input placeholder="Default input" />
                  <TokenLabel token="Input.default" />
                </View>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>With Icon</Text>
                  <Input placeholder="Search..." leftIcon={<Search size={18} color={colors.brown.default} />} />
                  <TokenLabel token="Input.withIcon" />
                </View>
              </View>
              <View style={styles.formColumn}>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>Password</Text>
                  <Input placeholder="Enter password" secureTextEntry leftIcon={<Lock size={18} color={colors.brown.default} />} />
                  <TokenLabel token="Input.password" />
                </View>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>Multiline</Text>
                  <Input placeholder="Write your bio..." multiline numberOfLines={3} />
                  <TokenLabel token="Input.multiline" />
                </View>
              </View>
            </View>

            <Divider />

            <Label>6.2 WITH LABEL</Label>
            <View style={styles.formGrid}>
              <View style={styles.formColumn}>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>Email Field</Text>
                  <Input label="Email Address" placeholder="you@example.com" keyboardType="email-address" />
                  <TokenLabel token="Input.withLabel" />
                </View>
              </View>
              <View style={styles.formColumn}>
                <View style={styles.formItem}>
                  <Text style={styles.formItemLabel}>With Error</Text>
                  <Input label="Email" placeholder="Enter email" error="Please enter a valid email" leftIcon={<Mail size={18} color={colors.orange.default} />} />
                  <TokenLabel token="Input.error" />
                </View>
              </View>
            </View>

            <Divider />

            <Label>6.3 INPUT SPACING</Label>
            <View style={styles.formSpacingInfo}>
              <View style={styles.formSpacingRow}>
                <Text style={styles.formSpacingLabel}>Height</Text>
                <Text style={styles.formSpacingValue}>48px</Text>
                <TokenLabel token="spacing.lg × 3" />
              </View>
              <View style={styles.formSpacingRow}>
                <Text style={styles.formSpacingLabel}>Padding Horizontal</Text>
                <Text style={styles.formSpacingValue}>16px</Text>
                <TokenLabel token="spacing.lg" />
              </View>
              <View style={styles.formSpacingRow}>
                <Text style={styles.formSpacingLabel}>Border Radius</Text>
                <Text style={styles.formSpacingValue}>full</Text>
                <TokenLabel token="radius.full" />
              </View>
              <View style={styles.formSpacingRow}>
                <Text style={styles.formSpacingLabel}>Label Margin Bottom</Text>
                <Text style={styles.formSpacingValue}>8px</Text>
                <TokenLabel token="spacing.sm" />
              </View>
              <View style={styles.formSpacingRow}>
                <Text style={styles.formSpacingLabel}>Error Margin Top</Text>
                <Text style={styles.formSpacingValue}>4px</Text>
                <TokenLabel token="spacing.xs" />
              </View>
            </View>

            <Divider />

            <Label>6.4 OTP INPUT</Label>
            <OTPInput value={otp} onChange={setOtp} />
            <View style={{ marginTop: spacing.md }}>
              <TokenLabel token="OTPInput" />
            </View>
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
  logoTextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, width: 340 },
  logoTextItem: { alignItems: 'flex-start', gap: spacing.sm, width: 160, marginBottom: spacing.md },
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
  btn2x2Grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2xl'] },
  btn2x2Cell: { width: '45%', gap: spacing.md },
  btn2x2Label: { ...typography.bodyStrong, color: color.charcoal },
  btn2x2Pair: { flexDirection: 'row', gap: spacing.lg },
  btnVariantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2xl'] },
  btnVariantGroup: { width: '45%', gap: spacing.md },
  btnVariantLabel: { ...typography.body, color: color.charcoal, marginBottom: spacing.sm },
  btnColorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  btnColorItem: { alignItems: 'flex-start', gap: spacing.sm },
  btnLightBg: { backgroundColor: colors.brown.mid, padding: spacing.lg, borderRadius: radius.lg },
  btnDarkBg: { backgroundColor: colors.brown.dark, padding: spacing.lg, borderRadius: radius.lg },
  btnGlassRow: { flexDirection: 'row', gap: spacing.xl, backgroundColor: color.blue.dark, padding: spacing.xl, borderRadius: radius.lg, alignSelf: 'flex-start' },
  // Forms
  inputBox: { maxWidth: 400 },
  formGrid: { flexDirection: 'row', gap: spacing['2xl'] },
  formColumn: { flex: 1, gap: spacing.xl },
  formItem: { gap: spacing.sm },
  formItemLabel: { ...typography.bodyStrong, color: color.charcoal },
  formSpacingInfo: { gap: spacing.md },
  formSpacingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  formSpacingLabel: { ...typography.body, color: color.charcoal, width: 160 },
  formSpacingValue: { ...typography.bodyStrong, color: color.blue.dark, width: 60 },
});
