/**
 * StyleGuide Screen
 * Hactually 2.0 Design System
 * Showcases Logo, Typography, and Components
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import {
  Eye,
  Type,
  MousePointer,
  FormInput,
  ChevronLeft,
  Mail,
  Lock,
  Search,
  MapPin,
  Star,
  Heart,
  User,
} from 'lucide-react-native';
import {
  colors,
  gradients,
  fontSize,
  fontFamily,
  spacing,
  borderRadius,
  shadows,
} from '../theme';
import { Button, Input, Badge, Tabs, OTPInput, Logo, DatePicker, ProfileMarquee, GoogleIcon, AppleIcon } from '../components';
import { LogoIcon, LogoWithText } from '../components/Logo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Navigation sections
const sections = [
  { id: 'logo', label: 'Logo', icon: Eye },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: MousePointer },
  { id: 'inputs', label: 'Forms', icon: FormInput },
];

// HactuallyLogo with gradient option
const HactuallyLogoSVG = ({ size = 80, useGradient = false, color = '#E05A3D' }) => {
  const width = size * 1.5;
  const height = size;

  return (
    <Svg width={width} height={height} viewBox="0 0 192 128" fill="none">
      {useGradient ? (
        <>
          <Defs>
            <SvgGradient id="logoGrad" x1="128" y1="64" x2="128" y2="0" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#E0593D"/>
              <Stop offset="1" stopColor="#D9081E"/>
            </SvgGradient>
          </Defs>
          <Path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" fill="url(#logoGrad)" />
        </>
      ) : (
        <Path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64ZM192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" fill={color} />
      )}
    </Svg>
  );
};

// Sidebar component
const Sidebar = ({ activeSection, onNavigate }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarHeader}>
      <Text style={styles.sidebarTitle}>hactually</Text>
    </View>
    <View style={styles.sidebarNav}>
      {sections.map(({ id, label, icon: Icon }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onNavigate(id)}
          style={[
            styles.sidebarItem,
            activeSection === id && styles.sidebarItemActive,
          ]}
        >
          <Icon size={16} color={activeSection === id ? colors.white : colors.brown.default} />
          <Text style={[
            styles.sidebarItemText,
            activeSection === id && styles.sidebarItemTextActive,
          ]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Section wrapper
const Section = ({ id, title, children }) => (
  <View id={id} style={styles.section}>
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  </View>
);

// Sub-section label
const SubLabel = ({ children }) => (
  <Text style={styles.subLabel}>{children}</Text>
);

// Divider
const Divider = () => <View style={styles.divider} />;

// Color swatch
const ColorSwatch = ({ name, color, textColor = colors.white }) => (
  <View style={[styles.swatch, { backgroundColor: color }]}>
    <Text style={[styles.swatchName, { color: textColor }]}>{name}</Text>
    <Text style={[styles.swatchValue, { color: textColor }]}>{color}</Text>
  </View>
);

export default function StyleGuideScreen({ navigation }) {
  const [activeSection, setActiveSection] = useState('logo');
  const scrollViewRef = useRef(null);
  const sectionRefs = useRef({});
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to section (basic implementation)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

        {/* Main Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* ================================================================
              LOGO SECTION
              ================================================================ */}
          <Section id="logo" title="Logo">
            <SubLabel>APP ICONS</SubLabel>
            <View style={styles.logoGrid}>
              <View style={[styles.logoBox, { backgroundColor: colors.orange.light }]}>
                <HactuallyLogoSVG size={60} useGradient />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.blue.light }]}>
                <HactuallyLogoSVG size={60} color={colors.blue.default} />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.brown.light }]}>
                <HactuallyLogoSVG size={60} color={colors.brown.dark} />
              </View>
              <View style={[styles.logoBox, { backgroundColor: colors.green.light }]}>
                <HactuallyLogoSVG size={60} color={colors.green.dark} />
              </View>
            </View>

            <Divider />

            <SubLabel>LOGO WITH TEXT</SubLabel>
            <View style={styles.logoTextRow}>
              <View style={[styles.logoTextBox, { backgroundColor: colors.blue.default }]}>
                <LogoIcon size={32} />
                <Text style={[styles.logoText, { color: colors.blue.light }]}>hactually</Text>
              </View>
              <View style={[styles.logoTextBox, { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.brown.light }]}>
                <LogoIcon size={32} />
                <Text style={[styles.logoText, { color: colors.blue.default }]}>hactually</Text>
              </View>
            </View>

            <Divider />

            <SubLabel>SOCIAL ICONS</SubLabel>
            <View style={styles.iconRow}>
              <View style={styles.iconBox}>
                <GoogleIcon size={24} color={colors.blue.default} />
                <Text style={styles.iconLabel}>Google</Text>
              </View>
              <View style={styles.iconBox}>
                <AppleIcon size={24} color={colors.blue.default} />
                <Text style={styles.iconLabel}>Apple</Text>
              </View>
            </View>
          </Section>

          {/* ================================================================
              TYPOGRAPHY SECTION
              ================================================================ */}
          <Section id="typography" title="Typography">
            <SubLabel>FONT FAMILY</SubLabel>
            <Text style={styles.fontShowcase}>hactually</Text>
            <Text style={styles.fontMono}>font-family: 'Ezra', sans-serif</Text>

            <Divider />

            <SubLabel>FONT WEIGHTS</SubLabel>
            <View style={styles.weightRow}>
              <View style={styles.weightItem}>
                <Text style={[styles.weightText, { fontFamily: fontFamily.regular, fontWeight: '400' }]}>Regular</Text>
                <Text style={styles.weightNumber}>400</Text>
              </View>
              <View style={styles.weightItem}>
                <Text style={[styles.weightText, { fontFamily: fontFamily.medium, fontWeight: '500' }]}>Medium</Text>
                <Text style={styles.weightNumber}>500</Text>
              </View>
              <View style={styles.weightItem}>
                <Text style={[styles.weightText, { fontFamily: fontFamily.bold, fontWeight: '700' }]}>Bold</Text>
                <Text style={styles.weightNumber}>700</Text>
              </View>
              <View style={styles.weightItem}>
                <Text style={[styles.weightText, { fontFamily: fontFamily.black, fontWeight: '900' }]}>Black</Text>
                <Text style={styles.weightNumber}>900</Text>
              </View>
            </View>

            <Divider />

            <SubLabel>TYPE SCALE</SubLabel>
            <View style={styles.typeScale}>
              <View style={styles.typeRow}>
                <Text style={styles.typeDisplay}>Display</Text>
                <Text style={styles.typeSize}>40px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeHeading}>Heading</Text>
                <Text style={styles.typeSize}>32px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeTitle}>Title</Text>
                <Text style={styles.typeSize}>24px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeSubtitle}>Subtitle</Text>
                <Text style={styles.typeSize}>20px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeBody}>Body</Text>
                <Text style={styles.typeSize}>16px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeSmall}>Small</Text>
                <Text style={styles.typeSize}>14px</Text>
              </View>
              <View style={styles.typeRow}>
                <Text style={styles.typeCaption}>Caption</Text>
                <Text style={styles.typeSize}>12px</Text>
              </View>
            </View>
          </Section>

          {/* ================================================================
              BUTTONS SECTION
              ================================================================ */}
          <Section id="buttons" title="Buttons">
            <SubLabel>GLASS STYLE</SubLabel>
            <Text style={styles.componentDesc}>Semi-transparent with blur (e.g., Social auth buttons)</Text>
            <View style={styles.buttonShowcase}>
              <Button variant="glass" leftIcon={<GoogleIcon size={20} />}>
                Continue with Google
              </Button>
              <Button variant="glass" leftIcon={<AppleIcon size={24} />}>
                Continue with Apple
              </Button>
            </View>

            <Divider />

            <SubLabel>SOLID STYLE</SubLabel>
            <Text style={styles.componentDesc}>Solid color with shimmer animation (e.g., Primary CTAs)</Text>
            <View style={styles.buttonShowcase}>
              <Button variant="solid" color="blue">Start Spotting</Button>
              <Button variant="solid" color="orange">Get Started</Button>
              <Button variant="solid" color="green">Confirm</Button>
            </View>

            <Divider />

            <SubLabel>OUTLINE STYLE</SubLabel>
            <Text style={styles.componentDesc}>Simple border outline (e.g., Secondary actions)</Text>
            <View style={styles.buttonShowcase}>
              <Button variant="outline" color="orange" uppercase>Continue</Button>
              <Button variant="outline" color="blue" uppercase>Submit</Button>
            </View>

            <Divider />

            <SubLabel>BUTTON SIZES</SubLabel>
            <View style={styles.buttonSizes}>
              <Button size="sm" variant="solid" color="blue">Small</Button>
              <Button size="md" variant="solid" color="blue">Medium</Button>
              <Button size="lg" variant="solid" color="blue">Large</Button>
            </View>

            <Divider />

            <SubLabel>BUTTON STATES</SubLabel>
            <View style={styles.buttonShowcase}>
              <Button loading variant="solid" color="blue">Loading</Button>
              <Button disabled variant="solid" color="blue">Disabled</Button>
            </View>
          </Section>

          {/* ================================================================
              FORMS SECTION
              ================================================================ */}
          <Section id="inputs" title="Form Components">
            <SubLabel>TEXT INPUT</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                placeholder="Enter your email"
                value={inputValue}
                onChangeText={setInputValue}
              />
            </View>

            <Divider />

            <SubLabel>INPUT WITH LABEL</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
              />
            </View>

            <Divider />

            <SubLabel>INPUT WITH ICON</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                placeholder="Search..."
                leftIcon={<Search size={18} color={colors.brown.default} />}
              />
            </View>

            <Divider />

            <SubLabel>PASSWORD INPUT</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                placeholder="Enter password"
                secureTextEntry
                leftIcon={<Lock size={18} color={colors.brown.default} />}
              />
            </View>

            <Divider />

            <SubLabel>INPUT WITH ERROR</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                placeholder="Email"
                error="Please enter a valid email"
                leftIcon={<Mail size={18} color={colors.orange.default} />}
              />
            </View>

            <Divider />

            <SubLabel>MULTILINE INPUT</SubLabel>
            <View style={styles.inputShowcase}>
              <Input
                placeholder="Write your bio..."
                multiline
                numberOfLines={3}
              />
            </View>

            <Divider />

            <SubLabel>OTP INPUT</SubLabel>
            <View style={styles.otpShowcase}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                onComplete={(code) => console.log('OTP:', code)}
              />
            </View>
          </Section>

          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brown.lighter,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  // Sidebar
  sidebar: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    margin: spacing[3],
    ...shadows.md,
  },
  sidebarHeader: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light + '33',
  },
  sidebarTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.black,
    fontWeight: '900',
    color: colors.blue.default,
  },
  sidebarNav: {
    padding: spacing[2],
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[1],
  },
  sidebarItemActive: {
    backgroundColor: colors.blue.default,
  },
  sidebarItemText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    color: colors.brown.default,
  },
  sidebarItemTextActive: {
    color: colors.white,
  },
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
  },
  // Section
  section: {
    marginBottom: spacing[6],
  },
  sectionCard: {
    backgroundColor: colors.brown.mid,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
  },
  sectionTitle: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brown.dark,
    marginBottom: spacing[5],
  },
  subLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brown.dark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  divider: {
    height: 1,
    backgroundColor: colors.brown.default + '33',
    marginVertical: spacing[5],
  },
  // Logo section
  logoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  logoTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
  },
  logoText: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  iconBox: {
    alignItems: 'center',
    gap: spacing[2],
  },
  iconLabel: {
    fontSize: fontSize.xs,
    color: colors.brown.default,
  },
  // Typography section
  fontShowcase: {
    fontSize: 32,
    fontFamily: fontFamily.black,
    fontWeight: '900',
    color: colors.blue.default,
    marginBottom: spacing[1],
  },
  fontMono: {
    fontSize: fontSize.xs,
    fontFamily: 'monospace',
    color: colors.brown.default,
  },
  weightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  weightItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  weightText: {
    fontSize: fontSize.lg,
    color: colors.brown.dark,
  },
  weightNumber: {
    fontSize: fontSize.xs,
    color: colors.brown.default,
  },
  typeScale: {
    gap: spacing[2],
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
  },
  typeDisplay: {
    fontSize: fontSize['3xl'],
    fontFamily: fontFamily.black,
    fontWeight: '900',
    color: colors.brown.dark,
  },
  typeHeading: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brown.dark,
  },
  typeTitle: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.brown.dark,
  },
  typeSubtitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    color: colors.brown.dark,
  },
  typeBody: {
    fontSize: fontSize.base,
    color: colors.brown.dark,
  },
  typeSmall: {
    fontSize: fontSize.sm,
    color: colors.brown.dark,
  },
  typeCaption: {
    fontSize: fontSize.xs,
    color: colors.brown.dark,
  },
  typeSize: {
    fontSize: fontSize.xs,
    color: colors.brown.default,
  },
  // Buttons section
  componentDesc: {
    fontSize: fontSize.sm,
    color: colors.brown.default,
    marginBottom: spacing[3],
  },
  buttonShowcase: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  buttonSizes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  // Forms section
  inputShowcase: {
    maxWidth: 400,
  },
  otpShowcase: {
    alignItems: 'flex-start',
  },
  // Color swatches
  swatch: {
    flex: 1,
    height: 80,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    justifyContent: 'flex-end',
    ...shadows.sm,
  },
  swatchName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  swatchValue: {
    fontSize: 10,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
});
