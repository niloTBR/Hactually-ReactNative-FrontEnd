/**
 * SpotsScreen - View received and sent spots
 */
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, ChevronDown, Eye, EyeOff, Ban, AlertTriangle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { color, spacing, radius, typography } from '../theme';
import { BottomNav, LogoMark, Button, ShimmerText } from '../components';
import { useVenueStore } from '../store/venueStore';

const PROFILE_IMAGES = [
  require('../../assets/images/profiles/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'),
  require('../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-KriecpTIWgY-unsplash.jpg'),
  require('../../assets/images/profiles/natalia-blauth-gw2udfGe_tM-unsplash.jpg'),
];

const MOCK_SPOTTED_YOU = [
  { id: 101, name: 'Nadia', age: 25, bio: 'Coffee addict & sunset chaser', avatar: PROFILE_IMAGES[4], venue: 'Coya', time: '20 min ago' },
  { id: 102, name: 'Karim', age: 27, bio: 'Architect by day, DJ by night', avatar: PROFILE_IMAGES[2], venue: 'White Dubai', time: '1h ago' },
  { id: 103, name: 'Amara', age: 23, bio: 'Beach lover & foodie', avatar: PROFILE_IMAGES[3], venue: 'Nammos', time: '3h ago' },
  { id: 104, name: 'Leo', age: 29, bio: 'Travel, tennis, tacos', avatar: PROFILE_IMAGES[1], venue: 'Soho Garden', time: '5h ago' },
];

const MOCK_SENT = [
  { id: 201, name: 'Yasmin', age: 24, bio: 'Yoga & vinyl collector', avatar: PROFILE_IMAGES[0], venue: 'White Dubai', time: '10 min ago' },
  { id: 202, name: 'Rami', age: 26, bio: 'Film nerd & home cook', avatar: PROFILE_IMAGES[2], venue: 'Coya', time: '1h ago' },
  { id: 203, name: 'Dina', age: 23, bio: 'Art, adventures & aperol', avatar: PROFILE_IMAGES[3], venue: 'Nammos', time: '3h ago' },
];

export default function SpotsScreen({ navigation }) {
  const checkedInVenue = useVenueStore((s) => s.checkedInVenue);
  const [spottedYou, setSpottedYou] = useState(MOCK_SPOTTED_YOU);
  const [sentRequests, setSentRequests] = useState(MOCK_SENT);

  // Combine and interleave received + sent
  const allSpots = [
    ...spottedYou.map(p => ({ ...p, type: 'received' })),
    ...sentRequests.map(p => ({ ...p, type: 'sent' })),
  ].sort((a, b) => a.id - b.id);
  const [focusedSpot, setFocusedSpot] = useState(null);
  const [focusedSent, setFocusedSent] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const undoSlide = useRef(new Animated.Value(-100)).current;
  const undoTimer = useRef(null);
  const undoType = useRef(null);

  const showUndoToast = useCallback((person, type) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoType.current = type;
    setUndoToast(person);
    undoSlide.setValue(-100);
    Animated.spring(undoSlide, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
    undoTimer.current = setTimeout(() => {
      Animated.timing(undoSlide, { toValue: -100, duration: 250, useNativeDriver: true }).start(() => setUndoToast(null));
    }, 4000);
  }, []);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    if (undoType.current === 'sent') {
      setSentRequests(prev => [undoToast, ...prev]);
    } else {
      setSpottedYou(prev => [undoToast, ...prev]);
    }
    Animated.timing(undoSlide, { toValue: -100, duration: 200, useNativeDriver: true }).start(() => setUndoToast(null));
  }, [undoToast]);

  const handleIgnore = useCallback((person, closeFn) => {
    closeFn();
    showUndoToast(person, 'ignored');
  }, [showUndoToast]);

  const handleAcceptSpot = (id) => {
    const person = spottedYou.find(p => p.id === id);
    setSpottedYou(spottedYou.filter(p => p.id !== id));
  };

  const handleDeclineSpot = (id) => {
    const person = spottedYou.find(p => p.id === id);
    setSpottedYou(spottedYou.filter(p => p.id !== id));
    if (person) showUndoToast(person, 'spotted');
  };

  const handleCancelRequest = (id) => {
    const person = sentRequests.find(p => p.id === id);
    setSentRequests(sentRequests.filter(p => p.id !== id));
    if (person) showUndoToast(person, 'sent');
  };

  return (
    <View style={s.container}>
      {/* Inject wave keyframes once */}
      <style>{`
        @keyframes waveLetter {
          0%, 40%, 100% { transform: translateY(0); opacity: 0.5; }
          20% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.title}>Spots</Text>
        </View>

        {/* All spots in one grid */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.cardsScroll}>
          {allSpots.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>No spots yet</Text>
              <Text style={s.emptySubtitle}>Check into a venue and start spotting</Text>
            </View>
          ) : (
            <View style={s.cardsGrid}>
              {allSpots.map((person) => {
                const isReceived = person.type === 'received';
                return (
                  <View key={person.id} style={s.card}>
                    {/* Animated arrow badge — same style as venue grid */}
                    <View style={[s.cardBadge, { backgroundColor: isReceived ? color.green.dark : color.blue.dark, overflow: 'hidden' }]}>
                      <style>{`
                        @keyframes spotArrowIn { 0% { transform: translate(10px, -10px); opacity: 0; } 30% { opacity: 1; } 70% { opacity: 1; } 100% { transform: translate(-10px, 10px); opacity: 0; } }
                        @keyframes spotArrowOut { 0% { transform: translate(-10px, 10px); opacity: 0; } 30% { opacity: 1; } 70% { opacity: 1; } 100% { transform: translate(10px, -10px); opacity: 0; } }
                      `}</style>
                      <div style={{ animation: `${isReceived ? 'spotArrowIn' : 'spotArrowOut'} 1.5s ease-in-out infinite` }}>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d={isReceived ? "M17 7L7 17M7 17H17M7 17V7" : "M7 17L17 7M17 7H7M17 7V17"}
                            stroke={color.beige}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </div>
                    </View>
                    <TouchableOpacity
                      style={s.cardProfile}
                      onPress={() => isReceived ? setFocusedSpot(person) : setFocusedSent(person)}
                      activeOpacity={0.8}
                    >
                      <Image source={person.avatar} style={s.cardAvatar} />
                      <Text style={s.cardName}>{person.name}, {person.age}</Text>
                      <Text style={s.cardVenue}>{person.venue} · {person.time}</Text>
                    </TouchableOpacity>
                    <View style={s.cardActions}>
                      {isReceived ? (
                        <>
                          <TouchableOpacity style={s.cardAccept} onPress={() => handleAcceptSpot(person.id)} activeOpacity={0.7}>
                            <Eye size={18} color={color.green.dark} strokeWidth={2.5} />
                          </TouchableOpacity>
                          <TouchableOpacity style={s.cardDecline} onPress={() => handleDeclineSpot(person.id)} activeOpacity={0.7}>
                            <X size={18} color={color.white} strokeWidth={2.5} />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={s.cardWaiting}>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {'Waiting'.split('').map((char, i) => (
                              <div key={i} style={{
                                color: color.green.light,
                                fontSize: 14,
                                fontFamily: 'system-ui, sans-serif',
                                fontWeight: '600',
                                animation: `waveLetter 2s ease-in-out ${i * 0.07}s infinite`,
                              }}>
                                {char}
                              </div>
                            ))}
                          </div>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={s.bottomNavWrap}>
          <BottomNav
            activeTab="spots"
            checkedInVenue={checkedInVenue}
            onTabChange={(tab) => {
              if (tab === 'venue') navigation.navigate('CheckedIn', { venue: checkedInVenue });
              else if (tab === 'nearby') navigation.navigate('Home');
              else if (tab === 'likes') navigation.navigate('Matches');
              else if (tab === 'profile') navigation.navigate('Profile');
            }}
          />
        </SafeAreaView>
      </SafeAreaView>

      {/* Focus overlay — received */}
      {focusedSpot && (
        <View style={s.focusOverlay}>
          <Image source={focusedSpot.avatar} style={s.focusImage} />
          <LinearGradient colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']} locations={[0, 0.3, 0.5, 1]} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['top']} style={s.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={s.focusClose} onPress={() => setFocusedSpot(null)}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['bottom']} style={s.focusBottom}>
            <Text style={s.focusName}>{focusedSpot.name}</Text>
            <Text style={s.focusAge}>{focusedSpot.age}, "{focusedSpot.bio}"</Text>
            <Text style={s.focusContext}>Spotted you at {focusedSpot.venue} · {focusedSpot.time}</Text>
            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.sm }}>
              <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleAcceptSpot(focusedSpot.id); setFocusedSpot(null); }}>
                Spot Back
              </Button>
              <TouchableOpacity style={s.notInterestedBtn} onPress={() => { handleDeclineSpot(focusedSpot.id); setFocusedSpot(null); }}>
                <Text style={s.notInterestedText}>Not interested?</Text>
              </TouchableOpacity>
            </View>
            <View style={s.safetyRow}>
              <Text style={s.safetyDisclaimer}>Your safety matters. If something feels off, let us know.</Text>
              <View style={s.safetyActions}>
                <TouchableOpacity style={s.safetyBtn} onPress={() => handleIgnore(focusedSpot, () => setFocusedSpot(null))}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={s.safetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.safetyBtn} onPress={() => setFocusedSpot(null)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={s.safetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.safetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setFocusedSpot(null)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[s.safetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* Focus overlay — sent */}
      {focusedSent && (
        <View style={s.focusOverlay}>
          <Image source={focusedSent.avatar} style={s.focusImage} />
          <LinearGradient colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']} locations={[0, 0.3, 0.5, 1]} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['top']} style={s.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={s.focusClose} onPress={() => setFocusedSent(null)}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['bottom']} style={s.focusBottom}>
            <Text style={s.focusName}>{focusedSent.name}</Text>
            <Text style={s.focusAge}>{focusedSent.age}, "{focusedSent.bio}"</Text>
            <Text style={s.focusContext}>You spotted at {focusedSent.venue} · {focusedSent.time}</Text>
            <View style={{ marginTop: spacing.lg, width: '100%' }}>
              <View style={s.waitingRow}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {'Waiting for match'.split('').map((char, i) => (
                    <div key={i} style={{
                      color: color.white,
                      fontSize: 16,
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: '500',
                      animation: `waveLetter 2s ease-in-out ${i * 0.07}s infinite`,
                      minWidth: char === ' ' ? 5 : undefined,
                    }}>
                      {char}
                    </div>
                  ))}
                </div>
                <TouchableOpacity style={s.cancelCircle} onPress={() => { handleCancelRequest(focusedSent.id); setFocusedSent(null); }}>
                  <X size={16} color={color.white} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.safetyRow}>
              <Text style={s.safetyDisclaimer}>Your safety matters. If something feels off, let us know.</Text>
              <View style={s.safetyActions}>
                <TouchableOpacity style={s.safetyBtn} onPress={() => handleIgnore(focusedSent, () => setFocusedSent(null))}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={s.safetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.safetyBtn} onPress={() => setFocusedSent(null)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={s.safetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.safetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setFocusedSent(null)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[s.safetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* Undo toast */}
      {undoToast && (
        <Animated.View style={[s.undoToast, { transform: [{ translateY: undoSlide }] }]}>
          <Text style={s.undoText}>{undoToast.name} removed</Text>
          <TouchableOpacity onPress={handleUndo}><Text style={s.undoBtn}>Undo</Text></TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.green.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h4, fontSize: 36, lineHeight: 44, color: color.blue.light },


  cardsScroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: '47%', backgroundColor: color.green.light + '14', borderRadius: radius.xl, padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  cardProfile: { alignItems: 'center', gap: spacing.xs },
  cardAvatar: { width: 72, height: 72, borderRadius: 36 },
  cardName: { ...typography.body, fontWeight: '600', color: color.blue.light, textAlign: 'center' },
  cardVenue: { ...typography.caption, color: color.beige + '80', textAlign: 'center' },
  cardActions: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch' },
  cardAccept: { flex: 1, height: 36, borderRadius: 18, backgroundColor: color.green.light, alignItems: 'center', justifyContent: 'center' },
  cardDecline: { flex: 1, height: 36, borderRadius: 18, backgroundColor: color.orange.dark, alignItems: 'center', justifyContent: 'center' },
  cardSpinner: { flex: 1, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardWaiting: { flex: 1, height: 36, borderRadius: 18, borderWidth: 1, borderColor: color.green.light + '60', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  cardWaitingText: { ...typography.caption, color: color.green.light, fontWeight: '600' },
  cardBadge: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.green.dark, zIndex: 1 },

  empty: { alignItems: 'center', paddingTop: spacing['3xl'] },
  emptyTitle: { ...typography.body, fontWeight: '600', color: color.green.light, marginTop: spacing.md },
  emptySubtitle: { ...typography.caption, color: color.green.light + '80', marginTop: spacing.xs },

  bottomNavWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },

  // Focus overlay
  focusOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, backgroundColor: color.charcoal },
  focusImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  focusHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  focusClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.charcoal + '80', alignItems: 'center', justifyContent: 'center' },
  focusBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  focusName: { ...typography.h1, color: color.white },
  focusAge: { ...typography.h3, color: color.white, marginTop: spacing.xs },
  focusContext: { ...typography.body, color: color.white, marginTop: spacing.xs },
  notInterestedBtn: { alignItems: 'center', paddingVertical: spacing.md, borderWidth: 1, borderColor: color.white + '33', borderRadius: radius.full },
  notInterestedText: { ...typography.body, color: color.white + 'CC', fontWeight: '500' },
  waitingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, paddingLeft: spacing.lg, paddingRight: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: color.white + '33' },
  cancelCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: color.orange.dark, alignItems: 'center', justifyContent: 'center' },

  safetyRow: { marginTop: spacing.lg, gap: spacing.sm },
  safetyDisclaimer: { ...typography.body, color: color.white + '4D', textAlign: 'center' },
  safetyActions: { flexDirection: 'row', gap: spacing.sm },
  safetyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: color.white + '26' },
  safetyLabel: { ...typography.body, color: color.white + 'CC' },

  undoToast: { position: 'absolute', top: 60, left: spacing.xl, right: spacing.xl, backgroundColor: color.charcoal, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  undoText: { ...typography.body, color: color.white },
  undoBtn: { ...typography.body, color: color.orange.dark, fontWeight: '700' },
});
