/**
 * ProfileScreen - Converted 1:1 from Hactually 2.0 ProfileScreen.jsx
 * Main profile/settings hub with sub-views for edit, visibility, notifications, etc.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight, LogOut, User, Bell, Shield, HelpCircle,
  Camera, MapPin, Pencil, Eye, Globe, Smartphone, Plus, X,
  RefreshCw, Trash2, AlertTriangle,
} from 'lucide-react-native';
import { color, spacing, radius, typography } from '../theme';
import { useAuthStore } from '../store/authStore';
import { BottomNav, Input, Chip, Button } from '../components';
import { useVenueStore } from '../store/venueStore';
import { GhostTheme } from '../theme';

// ─── DATA ───
const PROFILE_IMAGES = [
  require('../../assets/images/profiles/rayul-_M6gy9oHgII-unsplash.jpg'),
  require('../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../assets/images/profiles/jakob-owens-lkMJcGDZLVs-unsplash.jpg'),
];

const DEMO_USER = {
  name: 'Jane',
  age: 27,
  bio: 'building the future of nightlife',
  avatar: PROFILE_IMAGES[0],
  location: 'Dubai, UAE',
  interests: ['Tech', 'Music', 'Travel', 'Fitness'],
  photos: [...PROFILE_IMAGES, null, null, null],
};

const ALL_INTERESTS = ['Tech', 'Music', 'Travel', 'Fitness', 'Art', 'Food', 'Film', 'Coffee', 'Yoga', 'Dance', 'Fashion', 'Gaming', 'Photography', 'Surf', 'Cars', 'Cooking', 'Books', 'Wine', 'Crypto', 'Plants', 'Sneakers', 'Meditation', 'Vinyl', 'Startups'];

// ─── REUSABLE COMPONENTS ───
function Toggle({ value, onChange }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        backgroundColor: value ? color.green.dark : color.olive.dark + '33',
        justifyContent: 'center',
        paddingHorizontal: 2,
      }}
      activeOpacity={0.8}
    >
      <View style={{
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: value ? color.green.light : color.olive.dark + '4D',
        alignSelf: value ? 'flex-end' : 'flex-start',
      }} />
    </TouchableOpacity>
  );
}

function SectionLabel({ children }) {
  return <Text style={p.sectionLabel}>{children}</Text>;
}

function SettingsCard({ children }) {
  return <View style={p.settingsCard}>{children}</View>;
}

function SettingsRow({ icon: Icon, label, desc, onPress, showChevron = true, children }) {
  return (
    <TouchableOpacity style={p.settingsRow} onPress={onPress} activeOpacity={0.6}>
      {Icon && (
        <View style={p.settingsIcon}>
          <Icon size={16} color={color.olive.dark} />
        </View>
      )}
      <View style={p.settingsRowContent}>
        <Text style={p.settingsRowLabel}>{label}</Text>
        {desc && <Text style={p.settingsRowDesc}>{desc}</Text>}
      </View>
      {children}
      {showChevron && !children && <ChevronRight size={16} color={color.charcoal + '4D'} />}
    </TouchableOpacity>
  );
}

function SubViewHeader({ title, onBack, rightAction }) {
  return (
    <View style={p.subViewHeader}>
      <Text style={p.subViewTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {rightAction}
        <TouchableOpacity style={p.subViewClose} onPress={onBack}>
          <X size={18} color={color.charcoal} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── EDIT PROFILE — matches ProfileSetupScreen layout ───
function EditProfileView({ profile, onBack, onSave }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [interests, setInterests] = useState(profile.interests);
  const [searchInterest, setSearchInterest] = useState('');

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) setInterests(interests.filter(i => i !== interest));
    else if (interests.length < 5) setInterests([...interests, interest]);
  };

  const filteredInterests = searchInterest
    ? ALL_INTERESTS.filter(i => i.toLowerCase().includes(searchInterest.toLowerCase()) && !interests.includes(i))
    : ALL_INTERESTS.filter(i => !interests.includes(i)).slice(0, 8);

  return (
    <View style={p.editView}>
      <SafeAreaView edges={['top']}>
        <View style={p.editHeader}>
          <Text style={p.editTitle}>Edit Profile</Text>
          <TouchableOpacity style={p.subViewClose} onPress={onBack}>
            <X size={18} color={color.charcoal} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <GhostTheme themeColor={color.charcoal} isDark={false} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] * 2 }} showsVerticalScrollIndicator={false}>
          {/* Photo — same as ProfileSetupScreen */}
          <View style={p.editPhotoRow}>
            <View style={p.editPhotoWrap}>
              <Image source={profile.avatar} style={p.editPhoto} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={p.editPhotoLabel}>Add a photo, show your best self</Text>
              <View style={p.editPhotoActions}>
                <TouchableOpacity style={p.editPhotoActionBtn}>
                  <RefreshCw size={16} color={color.charcoal} />
                </TouchableOpacity>
                <TouchableOpacity style={p.editPhotoActionBtn}>
                  <Trash2 size={16} color={color.charcoal} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Name */}
          <View style={p.editFieldGap}>
            <Input
              variant="ghost"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />
          </View>

          {/* Bio */}
          <View style={p.editFieldGap}>
            <Text style={p.editSectionLabel}>Tell us about yourself</Text>
            <Input
              variant="ghost"
              placeholder="A little something about you..."
              value={bio}
              onChangeText={setBio}
              maxLength={250}
              multiline
              numberOfLines={3}
              showCharacterCount
            />
          </View>

          {/* Interests */}
          <View style={p.editFieldGap}>
            <Text style={p.editSectionLabel}>Pick your interests</Text>
            <Text style={p.editSubLabel}>Choose up to 5</Text>

            {/* Selected */}
            {interests.length > 0 && (
              <View style={p.editChipsWrap}>
                {interests.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    selected
                    variant="ghost"
                    onRemove={() => toggleInterest(interest)}
                  />
                ))}
              </View>
            )}

            {/* Search */}
            <View style={p.editFieldGap}>
              <Input
                variant="ghost"
                placeholder="Search interests..."
                value={searchInterest}
                onChangeText={setSearchInterest}
              />
            </View>

            {/* Suggestions */}
            <View style={p.editChipsWrap}>
              {filteredInterests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  variant="ghost"
                  onPress={() => toggleInterest(interest)}
                  disabled={interests.length >= 5}
                />
              ))}
            </View>
          </View>

          {/* Save button inline */}
          <View style={{ marginTop: spacing['2xl'] }}>
            <Button
              variant="solid"
              color="green"
              size="lg"
              fullWidth
              onPress={() => onSave({ name, bio, interests })}
            >
              Save Changes
            </Button>
          </View>
        </ScrollView>
      </GhostTheme>
    </View>
  );
}

// ─── TOGGLE SETTINGS VIEWS ───
function VisibilityView({ onBack }) {
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showVenue, setShowVenue] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);

  return (
    <View style={p.subView}>
      <SafeAreaView edges={['top']}><SubViewHeader title="Visibility" onBack={onBack} /></SafeAreaView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['3xl'] }}>
        <SettingsCard>
          <SettingsRow label="Show Online Status" desc="Others can see when you're active" showChevron={false}>
            <Toggle value={showOnline} onChange={setShowOnline} />
          </SettingsRow>
          <SettingsRow label="Show Distance" desc="Display how far you are" showChevron={false}>
            <Toggle value={showDistance} onChange={setShowDistance} />
          </SettingsRow>
          <SettingsRow label="Show Venue Check-in" desc="Let others see where you are" showChevron={false}>
            <Toggle value={showVenue} onChange={setShowVenue} />
          </SettingsRow>
        </SettingsCard>
        <View style={{ marginTop: spacing.xl }}>
          <SettingsCard>
            <SettingsRow label="Shy Mode" desc="Hide from everyone temporarily" showChevron={false}>
              <Toggle value={ghostMode} onChange={setGhostMode} />
            </SettingsRow>
          </SettingsCard>
          {ghostMode && <Text style={p.warningText}>You're in shy mode — no one can see or spot you</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

function NotificationsView({ onBack }) {
  const [push, setPush] = useState(true);
  const [spots, setSpots] = useState(true);
  const [matches, setMatches] = useState(true);
  const [msgs, setMsgs] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(false);

  return (
    <View style={p.subView}>
      <SafeAreaView edges={['top']}><SubViewHeader title="Notifications" onBack={onBack} /></SafeAreaView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['3xl'] }}>
        <SettingsCard>
          <SettingsRow label="Push Notifications" desc="Master toggle for all alerts" showChevron={false}>
            <Toggle value={push} onChange={setPush} />
          </SettingsRow>
        </SettingsCard>
        <View style={[{ marginTop: spacing.xl }, !push && { opacity: 0.4 }]}>
          <SectionLabel>Alerts</SectionLabel>
          <SettingsCard>
            <SettingsRow label="New Spots" desc="When someone spots you" showChevron={false}><Toggle value={spots} onChange={setSpots} /></SettingsRow>
            <SettingsRow label="Matches" desc="Mutual spot connections" showChevron={false}><Toggle value={matches} onChange={setMatches} /></SettingsRow>
            <SettingsRow label="Messages" desc="New DM notifications" showChevron={false}><Toggle value={msgs} onChange={setMsgs} /></SettingsRow>
          </SettingsCard>
        </View>
        <View style={[{ marginTop: spacing.xl }, !push && { opacity: 0.4 }]}>
          <SectionLabel>Feedback</SectionLabel>
          <SettingsCard>
            <SettingsRow label="Sounds" showChevron={false}><Toggle value={sounds} onChange={setSounds} /></SettingsRow>
            <SettingsRow label="Vibration" showChevron={false}><Toggle value={vibration} onChange={setVibration} /></SettingsRow>
          </SettingsCard>
        </View>
      </ScrollView>
    </View>
  );
}

function HelpView({ onBack }) {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: 'How does spotting work?', a: 'Spot someone at a venue to show interest. If they spot you back, it\'s a match!' },
    { q: 'Can I undo a spot?', a: 'Yes, go to the Spots tab and tap the 3-dot menu to cancel a sent spot.' },
    { q: 'How do I check into a venue?', a: 'Tap on a venue from the map and hit "Check In" to see who\'s there.' },
    { q: 'Is my location shared?', a: 'Only when you\'re checked into a venue. You can disable this in Visibility settings.' },
  ];

  return (
    <View style={p.subView}>
      <SafeAreaView edges={['top']}><SubViewHeader title="Help & Support" onBack={onBack} /></SafeAreaView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['3xl'] }}>
        <SectionLabel>FAQ</SectionLabel>
        <SettingsCard>
          {faqs.map((faq, i) => (
            <TouchableOpacity key={i} style={[p.settingsRow, i > 0 && p.fieldRowBorder]} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
              <View style={{ flex: 1 }}>
                <Text style={p.settingsRowLabel}>{faq.q}</Text>
                {openFaq === i && <Text style={p.faqAnswer}>{faq.a}</Text>}
              </View>
              <ChevronRight size={16} color={color.olive.dark + '4D'} style={openFaq === i && { transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          ))}
        </SettingsCard>
        <View style={{ marginTop: spacing.xl }}>
          <SectionLabel>Contact</SectionLabel>
          <SettingsCard>
            <SettingsRow label="Email Support" desc="support@hactually.com" />
            <SettingsRow label="Report a Problem" desc="Let us know what went wrong" />
          </SettingsCard>
        </View>
      </ScrollView>
    </View>
  );
}

function PrivacyView({ onBack }) {
  const [readReceipts, setReadReceipts] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  return (
    <View style={p.subView}>
      <SafeAreaView edges={['top']}><SubViewHeader title="Privacy" onBack={onBack} /></SafeAreaView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing['3xl'] }}>
        <SettingsCard>
          <SettingsRow label="Read Receipts" desc="Show when you've read messages" showChevron={false}>
            <Toggle value={readReceipts} onChange={setReadReceipts} />
          </SettingsRow>
        </SettingsCard>

        {/* Delete Account */}
        <View style={{ marginTop: spacing['2xl'] }}>
          <TouchableOpacity
            style={p.deleteAccountBtn}
            onPress={() => setShowDeletePopup(true)}
            activeOpacity={0.7}
          >
            <AlertTriangle size={16} color={color.orange.dark} />
            <View style={{ flex: 1 }}>
              <Text style={p.deleteAccountLabel}>Delete Account</Text>
              <Text style={p.deleteAccountDesc}>This action is permanent and cannot be undone. All your data, matches, and messages will be removed.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Account Popup */}
      {showDeletePopup && (
        <View style={p.deleteOverlay}>
          <View style={p.deleteCard}>
            <AlertTriangle size={32} color={color.orange.dark} />
            <Text style={p.deleteTitle}>Delete your account?</Text>
            <Text style={p.deleteBody}>
              This will permanently delete your profile, all your matches, messages, and spots. This action cannot be reversed.
            </Text>
            <TouchableOpacity style={p.deleteConfirmBtn} onPress={() => setShowDeletePopup(false)} activeOpacity={0.8}>
              <Text style={p.deleteConfirmText}>Delete My Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={p.deleteCancelBtn} onPress={() => setShowDeletePopup(false)}>
              <Text style={p.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── MAIN PROFILE SCREEN ───
export default function ProfileScreen({ navigation }) {
  const checkedInVenue = useVenueStore((s) => s.checkedInVenue);
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState(null);
  const [profileData, setProfileData] = useState(DEMO_USER);

  const profile = { ...profileData, name: user?.name || profileData.name };

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  const settingsGroups = [
    {
      title: 'Account & Preferences',
      items: [
        { icon: User, label: 'Edit Profile', desc: 'Photos, bio, interests', view: 'edit' },
        { icon: Eye, label: 'Visibility', desc: 'Who can see you', view: 'visibility' },
        { icon: Bell, label: 'Notifications', desc: 'Push, sounds, vibration', view: 'notifications' },
        { icon: Globe, label: 'Language', desc: 'English', view: 'language' },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Privacy', desc: 'Block list, data', view: 'privacy' },
        { icon: Smartphone, label: 'Linked Devices', desc: '1 device', view: 'devices' },
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ, contact us', view: 'help' },
      ],
    },
  ];

  return (
    <View style={p.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing['3xl'] * 2 }}>
        <SafeAreaView edges={['top']}>
          {/* Profile hero — left aligned, scrolls with content */}
          <View style={p.profileHero}>
            <View style={p.heroTopRow}>
              <Image source={profile.avatar} style={p.heroAvatar} />
            </View>
            <Text style={p.heroName}>{profile.name}, {profile.age}</Text>
            <Text style={p.heroBio}>"{profile.bio}"</Text>
            <View style={p.heroInterests}>
              {profile.interests.map((interest) => (
                <View key={interest} style={p.heroInterestTag}>
                  <Text style={p.heroInterestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>

        {/* Settings groups */}
        <View style={p.settingsSection}>
        <View style={p.settingsWrap}>
          {settingsGroups.map((group) => (
            <View key={group.title} style={{ marginBottom: spacing.xl }}>
              <SectionLabel>{group.title}</SectionLabel>
              <SettingsCard>
                {group.items.map((item, i) => (
                  <View key={item.label} style={i > 0 && p.fieldRowBorder}>
                    <SettingsRow icon={item.icon} label={item.label} desc={item.desc} onPress={() => setActiveView(item.view)} />
                  </View>
                ))}
              </SettingsCard>
            </View>
          ))}

          {/* Logout */}
          <TouchableOpacity style={p.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut size={18} color={color.orange.dark} />
            <Text style={p.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={p.version}>hactually v1.0.0</Text>
        </View>
        </View>
      </ScrollView>

      {/* Bottom nav with profile selected */}
      {!activeView && (
        <View style={p.bottomNavWrap}>
          <SafeAreaView edges={['bottom']}>
            <BottomNav activeTab="profile" checkedInVenue={checkedInVenue} onTabChange={(tab) => { if (tab === 'venue') navigation.navigate('CheckedIn', { venue: checkedInVenue }); else if (tab === 'nearby') navigation.navigate('Home'); else if (tab === 'spots') navigation.navigate('Spots'); else if (tab === 'likes') navigation.navigate('Matches'); }} />
          </SafeAreaView>
        </View>
      )}

      {/* Sub-views */}
      {activeView === 'edit' && (
        <EditProfileView profile={profile} onBack={() => setActiveView(null)} onSave={(updated) => { setProfileData(prev => ({ ...prev, ...updated })); setActiveView(null); }} />
      )}
      {activeView === 'visibility' && <VisibilityView onBack={() => setActiveView(null)} />}
      {activeView === 'notifications' && <NotificationsView onBack={() => setActiveView(null)} />}
      {activeView === 'privacy' && <PrivacyView onBack={() => setActiveView(null)} />}
      {activeView === 'help' && <HelpView onBack={() => setActiveView(null)} />}
      {activeView === 'language' && (
        <View style={p.subView}>
          <SafeAreaView edges={['top']}><SubViewHeader title="Language" onBack={() => setActiveView(null)} /></SafeAreaView>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl }}>
            <SettingsCard>
              {[{ code: 'en', label: 'English' }, { code: 'ar', label: 'العربية' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' }].map((lang, i) => (
                <TouchableOpacity key={lang.code} style={[p.settingsRow, i > 0 && p.fieldRowBorder]} activeOpacity={0.6}>
                  <View style={p.settingsRowContent}><Text style={p.settingsRowLabel}>{lang.label}</Text></View>
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: lang.code === 'en' ? color.orange.dark : color.olive.dark + '33', alignItems: 'center', justifyContent: 'center' }}>
                    {lang.code === 'en' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.orange.dark }} />}
                  </View>
                </TouchableOpacity>
              ))}
            </SettingsCard>
          </ScrollView>
        </View>
      )}
      {activeView === 'devices' && (
        <View style={p.subView}>
          <SafeAreaView edges={['top']}><SubViewHeader title="Linked Devices" onBack={() => setActiveView(null)} /></SafeAreaView>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.xl }}>
            <SettingsCard>
              <View style={p.settingsRow}>
                <View style={[p.settingsIcon, { backgroundColor: color.green.dark + '14' }]}>
                  <Smartphone size={16} color={color.green.dark} />
                </View>
                <View style={p.settingsRowContent}>
                  <Text style={p.settingsRowLabel}>iPhone 15 Pro</Text>
                  <Text style={p.settingsRowDesc}>This device · Active now</Text>
                </View>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.green.dark }} />
              </View>
            </SettingsCard>
            <TouchableOpacity style={p.deleteAccountBtn} activeOpacity={0.7}>
              <LogOut size={16} color={color.orange.dark} />
              <View style={{ flex: 1 }}>
                <Text style={p.deleteAccountLabel}>Log out of all devices</Text>
                <Text style={p.deleteAccountDesc}>You will need to sign in again on each device</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── STYLES ───
const p = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.olive.light },
  bottomNavWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },

  // Profile hero
  profileHero: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  heroTopRow: { marginBottom: spacing.lg },
  heroAvatar: { width: 110, height: 110, borderRadius: 55 },
  heroName: { ...typography.h2, color: color.orange.dark },
  heroBio: { ...typography.body, color: color.olive.dark, marginTop: spacing.sm },
  heroInterests: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  heroInterestTag: { backgroundColor: color.olive.dark + '14', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  heroInterestText: { ...typography.caption, fontSize: 12, color: color.olive.dark },
  subView: { ...StyleSheet.absoluteFillObject, zIndex: 20, backgroundColor: color.olive.light },

  // Headers
  subViewHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
  },
  subViewClose: {
    width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2,
    backgroundColor: color.olive.dark + '14', alignItems: 'center', justifyContent: 'center',
  },
  subViewTitle: { ...typography.h4, color: color.orange.dark },
  saveText: { ...typography.body, fontWeight: '700', color: color.orange.dark },

  // Section labels
  // Settings section — light olive bg with dark text
  settingsSection: { paddingTop: spacing.sm },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: color.green.dark, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.md, paddingLeft: spacing.xs },

  // Settings card
  settingsCard: { backgroundColor: color.beige + '40', borderRadius: radius.lg, overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2 },
  settingsIcon: { width: 36, height: 36, borderRadius: radius.md + 4, backgroundColor: color.beige, alignItems: 'center', justifyContent: 'center' },
  settingsRowContent: { flex: 1 },
  settingsRowLabel: { ...typography.body, fontWeight: '500', color: color.charcoal },
  settingsRowDesc: { ...typography.caption, fontSize: 12, color: color.olive.dark + '80', marginTop: 1 },
  fieldRowBorder: { borderTopWidth: 1, borderTopColor: color.olive.light + '80' },
  warningText: { ...typography.caption, fontSize: 12, color: color.orange.dark, marginTop: spacing.sm, paddingLeft: spacing.xs },
  faqAnswer: { ...typography.caption, color: color.olive.dark + '99', marginTop: spacing.sm, lineHeight: 20 },

  // Profile card
  profileCardWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  profileCard: { backgroundColor: color.white + '99', borderRadius: radius.lg, borderWidth: 1, borderColor: color.olive.light + '33', padding: spacing.xl, alignItems: 'center' },
  avatarWrap: { marginTop: spacing['3xl'], marginBottom: spacing.md },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: color.white },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, backgroundColor: color.orange.dark, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.white },
  profileName: { ...typography.h3, color: color.charcoal },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  locationText: { ...typography.caption, fontSize: 12, color: color.olive.dark + '80' },
  bioCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: color.beige + '99', borderRadius: radius.md + 4, width: '100%' },
  bioText: { flex: 1, ...typography.caption, color: color.olive.dark + 'B3', textAlign: 'center' },
  interestTags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xs + 2, marginTop: spacing.md },
  interestTag: { backgroundColor: color.orange.dark + '1A', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  interestTagText: { fontSize: 12, fontWeight: '500', color: color.orange.dark },

  // Settings wrap
  settingsWrap: { paddingHorizontal: spacing.xl },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg, borderRadius: radius.lg, backgroundColor: color.orange.dark + '14' },
  logoutText: { ...typography.body, fontWeight: '700', color: color.orange.dark },
  version: { ...typography.caption, fontSize: 10, color: color.olive.dark + '4D', textAlign: 'center', marginTop: spacing.md, paddingBottom: spacing.lg },

  // Edit profile — dark green like ProfileSetup
  editView: { ...StyleSheet.absoluteFillObject, zIndex: 20, backgroundColor: color.olive.light },
  editHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  editTitle: { ...typography.h4, color: color.orange.dark, flex: 1 },
  editPhotoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl, marginTop: spacing.md },
  editPhotoWrap: { width: 96, height: 96, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: color.charcoal + '30' },
  editPhoto: { width: '100%', height: '100%' },
  editPhotoLabel: { ...typography.caption, fontWeight: '700', color: color.charcoal },
  editPhotoActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  editPhotoActionBtn: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: color.charcoal + '14', alignItems: 'center', justifyContent: 'center' },
  editFieldGap: { marginTop: spacing.md },
  editSectionLabel: { ...typography.caption, fontWeight: '700', color: color.olive.dark, marginBottom: spacing.sm },
  editSubLabel: { ...typography.caption, color: color.olive.dark + '80', marginBottom: spacing.md },
  editChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  editBottomWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },

  // Delete account
  deleteAccountBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: color.orange.dark + '0D' },
  deleteAccountLabel: { ...typography.body, fontWeight: '600', color: color.orange.dark },
  deleteAccountDesc: { ...typography.caption, fontSize: 12, color: color.olive.dark + '80', marginTop: spacing.xs, lineHeight: 16 },
  deleteOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 30, backgroundColor: color.charcoal + 'B3', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  deleteCard: { width: '100%', maxWidth: 340, backgroundColor: color.beige, borderRadius: radius.xl, padding: spacing.xl, paddingTop: spacing['2xl'], alignItems: 'center' },
  deleteTitle: { ...typography.h4, color: color.orange.dark, marginTop: spacing.lg, textAlign: 'center' },
  deleteBody: { ...typography.body, fontSize: 14, color: color.olive.dark, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  deleteConfirmBtn: { backgroundColor: color.orange.dark, borderRadius: radius.full, paddingVertical: spacing.md, width: '100%', alignItems: 'center', marginTop: spacing.xl },
  deleteConfirmText: { ...typography.button, color: color.white },
  deleteCancelBtn: { alignItems: 'center', paddingTop: spacing.md },
  deleteCancelText: { ...typography.caption, fontWeight: '500', color: color.olive.dark + '80', textDecorationLine: 'underline' },

  photosSection: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xl },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  photoSlot: { width: '31%', aspectRatio: 3 / 4, borderRadius: radius.md + 4, overflow: 'hidden' },
  photoSlotEmpty: { backgroundColor: color.white + '99', borderWidth: 2, borderStyle: 'dashed', borderColor: color.olive.dark + '26' },
  photoImage: { width: '100%', height: '100%' },
  mainBadge: { position: 'absolute', top: spacing.xs + 2, left: spacing.xs + 2, backgroundColor: color.orange.dark, borderRadius: spacing.xs + 2, paddingHorizontal: spacing.xs + 2, paddingVertical: 2 },
  mainBadgeText: { fontSize: 10, fontWeight: '700', color: color.white, textTransform: 'uppercase' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  addPhotoCircle: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, backgroundColor: color.orange.dark + '1A', alignItems: 'center', justifyContent: 'center' },
  addPhotoText: { fontSize: 10, color: color.olive.dark + '4D' },

  // Fields
  fieldSection: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2 },
  fieldLabel: { ...typography.caption, color: color.olive.dark + '80', minWidth: 72 },
  fieldInput: { flex: 1, ...typography.body, fontWeight: '500', color: color.charcoal, textAlign: 'right', padding: 0 },
  bioInput: { ...typography.body, color: color.charcoal, paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2, minHeight: 80, textAlignVertical: 'top' },
  bioCount: { fontSize: 10, color: color.olive.dark + '4D', textAlign: 'right', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  interestsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: spacing.xs },
  interestsCount: { fontSize: 12, color: color.olive.dark + '4D' },
  interestsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestChip: { paddingHorizontal: spacing.md + 2, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: color.white + '99', borderWidth: 1, borderColor: color.olive.light + '33' },
  interestChipActive: { backgroundColor: color.orange.dark, borderColor: color.orange.dark },
  interestChipText: { fontSize: 12, fontWeight: '500', color: color.olive.dark + '99' },
  interestChipTextActive: { color: color.white },
});
