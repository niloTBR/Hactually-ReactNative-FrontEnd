/**
 * MatchesScreen - View all matches outside of a venue
 * Dark beige background, same spots list pattern as CheckedIn
 */
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronRight, ChevronDown, ArrowUp, Check, EyeOff, Ban, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { color, spacing, radius, typography } from '../theme';
import { BottomNav, LogoMark, Button } from '../components';
import { useVenueStore } from '../store/venueStore';

// Reuse profile images from CheckedIn
const PROFILE_IMAGES = [
  require('../../assets/images/profiles/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'),
  require('../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-KriecpTIWgY-unsplash.jpg'),
  require('../../assets/images/profiles/natalia-blauth-gw2udfGe_tM-unsplash.jpg'),
];

const MOCK_MATCHES = [
  { id: 1, name: 'Sophia', age: 24, avatar: PROFILE_IMAGES[0], bio: 'chasing sunsets & good conversations', venue: 'White Dubai', time: '2h ago', unread: true, online: true, lastMsg: 'Hey! Are you going out tonight?' },
  { id: 2, name: 'Marcus', age: 28, avatar: PROFILE_IMAGES[2], bio: 'music producer by day, dj by night', venue: 'Coya', time: '5h ago', unread: true, online: true, lastMsg: 'That set was incredible 🔥' },
  { id: 3, name: 'Luna', age: 25, avatar: PROFILE_IMAGES[4], bio: 'somewhere between chaos and calm', venue: 'LIV', time: 'Yesterday', unread: true, online: false, lastMsg: 'We should hang again soon!' },
  { id: 4, name: 'Isabella', age: 23, avatar: PROFILE_IMAGES[3], bio: 'life is short, eat the dessert first', venue: 'Nammos', time: '2 days ago', unread: false, online: false, lastMsg: 'Thanks for a great night' },
  { id: 5, name: 'Emma', age: 26, avatar: PROFILE_IMAGES[1], bio: 'probably at a coffee shop right now', venue: 'Soho Garden', time: '3 days ago', unread: false, online: true, lastMsg: 'Haha definitely!' },
  { id: 6, name: 'Jake', age: 27, avatar: PROFILE_IMAGES[0], bio: 'building things & breaking boundaries', venue: 'White Dubai', time: '4 days ago', unread: false, lastMsg: 'Good vibes last night' },
  { id: 7, name: 'Mia', age: 24, avatar: PROFILE_IMAGES[1], bio: 'finding magic in the mundane', venue: 'Twiggy', time: '5 days ago', unread: false, lastMsg: 'That sunset was everything 🌅' },
  { id: 8, name: 'Alex', age: 29, avatar: PROFILE_IMAGES[2], bio: 'professional overthinker, amateur chef', venue: 'Zuma', time: 'Last week', unread: false, lastMsg: 'The food was insane' },
  { id: 9, name: 'Nina', age: 25, avatar: PROFILE_IMAGES[3], bio: 'dancing through life', venue: 'LIV', time: 'Last week', unread: false, lastMsg: 'Best night out in ages' },
  { id: 10, name: 'Omar', age: 30, avatar: PROFILE_IMAGES[4], bio: 'coffee enthusiast & night owl', venue: 'Coya', time: '2 weeks ago', unread: false, lastMsg: 'Let me know next time!' },
  { id: 11, name: 'Layla', age: 22, avatar: PROFILE_IMAGES[0], bio: 'new to dubai, show me around', venue: 'Soho Garden', time: '2 weeks ago', unread: false, lastMsg: 'Was so nice meeting you' },
  { id: 12, name: 'Rayan', age: 26, avatar: PROFILE_IMAGES[2], bio: 'photographer by day, dj by night', venue: 'Nammos', time: '3 weeks ago', unread: false, lastMsg: 'Check out my latest set!' },
];

const MOCK_SPOTTED_YOU = [
  { id: 101, name: 'Nadia', age: 25, avatar: PROFILE_IMAGES[4], venue: 'Coya', time: '20 min ago' },
  { id: 102, name: 'Karim', age: 27, avatar: PROFILE_IMAGES[2], venue: 'White Dubai', time: '1h ago' },
  { id: 103, name: 'Amara', age: 23, avatar: PROFILE_IMAGES[3], venue: 'Nammos', time: '3h ago' },
  { id: 104, name: 'Leo', age: 29, avatar: PROFILE_IMAGES[1], venue: 'Soho Garden', time: '5h ago' },
];

const MOCK_SENT_REQUESTS = [
  { id: 201, name: 'Yasmin', age: 24, avatar: PROFILE_IMAGES[0], venue: 'White Dubai', time: '10 min ago' },
  { id: 202, name: 'Rami', age: 26, avatar: PROFILE_IMAGES[2], venue: 'Coya', time: '1h ago' },
  { id: 203, name: 'Dina', age: 23, avatar: PROFILE_IMAGES[3], venue: 'Nammos', time: '3h ago' },
];

const MOCK_DM = [
  { id: 0, type: 'timestamp', label: 'Sunday' },
  { id: 1, message: "Hey! I spotted you at White Dubai 👋", time: '11:42 PM', isMe: false },
  { id: 2, message: "Oh hey! Yeah I noticed you too haha", time: '11:43 PM', isMe: true },
  { id: 3, message: "That DJ set was insane right?", time: '11:45 PM', isMe: false },
  { id: 4, message: "Literally the best I've heard in months", time: '11:46 PM', isMe: true },
  { id: 5, type: 'timestamp', label: 'Monday' },
  { id: 6, message: "Are you going out again this weekend?", time: '2:30 PM', isMe: false },
  { id: 7, message: "Thinking about it! Maybe Coya or Nammos", time: '2:35 PM', isMe: true },
  { id: 8, message: "Nammos is so good on Fridays", time: '2:36 PM', isMe: false },
  { id: 9, message: "True! Let me check with my friends", time: '2:40 PM', isMe: true },
  { id: 10, type: 'timestamp', label: 'Wednesday' },
  { id: 11, message: "So are you going Friday?", time: '6:15 PM', isMe: false },
  { id: 12, message: "Yes! We're doing Nammos 🎉", time: '6:20 PM', isMe: true },
  { id: 13, message: "Amazing I'll be there too", time: '6:21 PM', isMe: false },
  { id: 14, message: "See you there!", time: '6:22 PM', isMe: true },
  { id: 15, type: 'timestamp', label: 'Yesterday' },
  { id: 16, message: "Just checked in at Nammos!", time: '9:30 PM', isMe: false },
  { id: 17, message: "Omw! Where are you sitting?", time: '9:45 PM', isMe: true },
  { id: 18, message: "Near the pool area, can't miss us 😄", time: '9:46 PM', isMe: false },
  { id: 19, type: 'timestamp', label: 'Today' },
  { id: 20, message: "Last night was so fun!", time: '10:15 AM', isMe: true },
  { id: 21, message: "Right?? We need to do that more often", time: '10:20 AM', isMe: false },
  { id: 22, message: "Definitely! What are you up to today?", time: '10:25 AM', isMe: true },
];

export default function MatchesScreen({ navigation }) {
  const checkedInVenue = useVenueStore((s) => s.checkedInVenue);
  const [activeTab, setActiveTab] = useState('all');
  const [showSentRequests, setShowSentRequests] = useState(false);
  const [spottedYou, setSpottedYou] = useState(MOCK_SPOTTED_YOU);
  const [sentRequests, setSentRequests] = useState(MOCK_SENT_REQUESTS);
  const [focusedSpot, setFocusedSpot] = useState(null);
  const [focusedMatch, setFocusedMatch] = useState(null);
  const [focusedSent, setFocusedSent] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const undoSlide = useRef(new Animated.Value(-100)).current;
  const undoTimer = useRef(null);
  const [dmPerson, setDmPerson] = useState(null);
  const [dmMessages, setDmMessages] = useState(MOCK_DM);
  const [message, setMessage] = useState('');

  const undoType = useRef(null); // 'spotted' or 'sent'

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
    if (sentRequests.length <= 1) setShowSentRequests(false);
    if (person) showUndoToast(person, 'sent');
  };

  const filteredMatches = activeTab === 'all' ? MOCK_MATCHES
    : activeTab === 'unread' ? MOCK_MATCHES.filter(m => m.unread)
    : MOCK_MATCHES.filter(m => !m.unread);

  const unreadCount = MOCK_MATCHES.filter(m => m.unread).length;

  const handleDmSend = () => {
    if (message.trim() && dmPerson) {
      setDmMessages([...dmMessages, { id: Date.now(), message: message.trim(), time: 'now', isMe: true }]);
      setMessage('');
    }
  };

  // ─── DM VIEW ───
  if (dmPerson) {
    return (
      <View style={ms.container}>
        <View style={ms.dmBg} />
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          {/* Header */}
          <View style={ms.dmHeader}>
            <TouchableOpacity onPress={() => setFocusedMatch(dmPerson)}>
              <Image source={dmPerson.avatar} style={ms.dmAvatar} />
            </TouchableOpacity>
            <View style={{ flex: 1, gap: spacing.sm }}>
              <Text style={ms.dmName}>{dmPerson.name}</Text>
              <TouchableOpacity
                style={ms.dmViewProfileBtn}
                onPress={() => { setFocusedMatch(dmPerson); }}
                activeOpacity={0.7}
              >
                <Text style={ms.dmViewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={ms.dmClose} onPress={() => setDmPerson(null)}>
              <ChevronDown size={20} color={color.charcoal} />
            </TouchableOpacity>
          </View>

          {/* Messages with pattern */}
          <View style={{ flex: 1, position: 'relative' }}>
            <View style={ms.pattern} pointerEvents="none">
              {Array.from({ length: 400 }).map((_, i) => {
                const col = i % 12;
                const row = Math.floor(i / 12);
                const rotateDir = (col + row) % 2 === 0 ? '35deg' : '-35deg';
                return (
                  <View key={i} style={{ transform: [{ rotate: rotateDir }] }}>
                    <Svg width={16} height={16} viewBox="0 0 128 128" fill="none">
                      <Path d="M64 64C64 99.3462 35.3462 128 0 128V0H64V64Z" fill={color.charcoal} />
                      <Path d="M128 128H64V64C64 28.6538 92.6538 0 128 0V128Z" fill={color.charcoal} />
                    </Svg>
                  </View>
                );
              })}
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}>
              {dmMessages.map((msg) => {
                if (msg.type === 'timestamp') {
                  return (
                    <View key={msg.id} style={ms.timestamp}>
                      <Text style={ms.timestampText}>{msg.label}</Text>
                    </View>
                  );
                }
                return (
                  <View key={msg.id} style={[ms.msgRow, msg.isMe && ms.msgRowMe]}>
                    <View style={[ms.bubble, msg.isMe ? ms.bubbleMe : ms.bubbleOther]}>
                      <Text style={[ms.bubbleText, !msg.isMe && { color: color.charcoal }]}>{msg.message}</Text>
                      <Text style={[ms.bubbleTime, !msg.isMe && { color: color.olive.dark + '66' }]}>{msg.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Input */}
          <View style={ms.inputWrap}>
            <View style={ms.inputBar}>
              <TextInput
                style={ms.input}
                value={message}
                onChangeText={setMessage}
                placeholder={`Message ${dmPerson.name}...`}
                placeholderTextColor={color.olive.dark + '66'}
                onSubmitEditing={handleDmSend}
              />
              <TouchableOpacity
                style={[ms.sendBtn, message.trim() && ms.sendBtnActive]}
                onPress={handleDmSend}
                disabled={!message.trim()}
              >
                <ArrowUp size={16} color={message.trim() ? color.white : color.olive.dark + '66'} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ─── MATCHES LIST ───
  return (
    <View style={ms.container}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={ms.header}>
          <Text style={ms.title}>Inbox</Text>
        </View>

        {/* Tabs */}
        <View style={ms.tabs}>
          <View style={ms.tabsLeft}>
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
              { key: 'read', label: 'Read' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[ms.tab, activeTab === tab.key && ms.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[ms.tabText, activeTab === tab.key && ms.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Matches list */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] }}>
          {filteredMatches.length === 0 ? (
            <View style={ms.empty}>
              <Svg width={40} height={40} viewBox="0 0 24 24" fill={color.olive.light}>
                <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </Svg>
              <Text style={ms.emptyTitle}>No matches yet</Text>
              <Text style={ms.emptySubtitle}>Check into a venue and start spotting</Text>
            </View>
          ) : (
            filteredMatches.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={ms.matchRow}
                onPress={() => setDmPerson(person)}
                activeOpacity={0.7}
              >
                {/* Avatar — tap opens full profile */}
                <TouchableOpacity
                  style={ms.matchAvatarRing}
                  onPress={() => setFocusedMatch(person)}
                  activeOpacity={0.8}
                >
                  <Image source={person.avatar} style={ms.matchAvatar} />
                  {person.online && <View style={ms.onlineDot} />}
                </TouchableOpacity>
                {/* Info + time/dot */}
                <View style={ms.matchInfo}>
                  <View style={ms.matchTopRow}>
                    <Text style={ms.matchName}>{person.name}</Text>
                    <Text style={ms.matchTime}>{person.time}</Text>
                  </View>
                  <View style={ms.matchBottomRow}>
                    <Text style={[ms.matchLastMsg, person.unread && ms.matchLastMsgUnread]} numberOfLines={1}>{person.lastMsg}</Text>
                    {person.unread && <View style={ms.unreadDot} />}
                  </View>
                </View>
                <ChevronRight size={16} color={color.green.light + '66'} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Bottom nav with matches selected */}
        <SafeAreaView edges={['bottom']} style={ms.bottomNavWrap}>
          <BottomNav activeTab="likes" checkedInVenue={checkedInVenue} onTabChange={(tab) => { if (tab === 'venue') navigation.navigate('CheckedIn', { venue: checkedInVenue }); else if (tab === 'nearby') navigation.navigate('Home'); else if (tab === 'spots') navigation.navigate('Spots'); else if (tab === 'profile') navigation.navigate('Profile'); }} />
        </SafeAreaView>
      </SafeAreaView>

      {/* ─── FOCUS OVERLAY (Spotted profile) ─── */}
      {focusedSpot && (
        <View style={ms.focusOverlay}>
          <Image source={focusedSpot.avatar} style={ms.focusImage} />
          <LinearGradient
            colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']}
            locations={[0, 0.3, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={ms.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={ms.focusClose} onPress={() => setFocusedSpot(null)}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['bottom']} style={ms.focusBottom}>
            <Text style={ms.focusName}>{focusedSpot.name}</Text>
            <Text style={ms.focusAge}>{focusedSpot.age}, "{focusedSpot.bio || focusedSpot.venue}"</Text>
            <Text style={{ ...typography.body, color: color.white, marginTop: spacing.xs }}>Spotted you at {focusedSpot.venue} · {focusedSpot.time}</Text>

            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.sm }}>
              <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleAcceptSpot(focusedSpot.id); setFocusedSpot(null); }}>
                Spot Back
              </Button>
              <TouchableOpacity
                style={ms.notInterestedBtn}
                onPress={() => { handleDeclineSpot(focusedSpot.id); setFocusedSpot(null); }}
              >
                <Text style={ms.notInterestedText}>Not interested?</Text>
              </TouchableOpacity>
            </View>

            <View style={ms.focusSafetyRow}>
              <Text style={ms.focusSafetyDisclaimer}>
                Your safety matters. If something feels off, let us know.
              </Text>
              <View style={ms.focusSafetyActions}>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => handleIgnore(focusedSpot, () => setFocusedSpot(null))}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => setFocusedSpot(null)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[ms.focusSafetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setFocusedSpot(null)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[ms.focusSafetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* ─── MATCH FOCUS OVERLAY ─── */}
      {focusedMatch && (
        <View style={ms.focusOverlay}>
          <Image source={focusedMatch.avatar} style={ms.focusImage} />
          <LinearGradient
            colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']}
            locations={[0, 0.3, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={ms.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={ms.focusClose} onPress={() => setFocusedMatch(null)}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['bottom']} style={ms.focusBottom}>
            <Text style={ms.focusName}>{focusedMatch.name}</Text>
            <Text style={ms.focusAge}>{focusedMatch.age}, "{focusedMatch.bio}"</Text>
            <Text style={{ ...typography.body, color: color.white, marginTop: spacing.xs }}>Matched at {focusedMatch.venue} · {focusedMatch.time}</Text>

            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.sm }}>
              <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { setDmPerson(focusedMatch); setFocusedMatch(null); }}>
                Message {focusedMatch.name}
              </Button>
            </View>

            <View style={ms.focusSafetyRow}>
              <Text style={ms.focusSafetyDisclaimer}>
                Your safety matters. If something feels off, let us know.
              </Text>
              <View style={ms.focusSafetyActions}>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => handleIgnore(focusedMatch, () => setFocusedMatch(null))}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => setFocusedMatch(null)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[ms.focusSafetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setFocusedMatch(null)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[ms.focusSafetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* ─── SENT/PENDING FOCUS OVERLAY ─── */}
      {focusedSent && (
        <View style={ms.focusOverlay}>
          <Image source={focusedSent.avatar} style={ms.focusImage} />
          <LinearGradient
            colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']}
            locations={[0, 0.3, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={ms.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={ms.focusClose} onPress={() => setFocusedSent(null)}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView edges={['bottom']} style={ms.focusBottom}>
            <Text style={ms.focusName}>{focusedSent.name}</Text>
            <Text style={ms.focusAge}>{focusedSent.age}, "{focusedSent.venue}"</Text>

            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.sm }}>
              <View style={ms.waitingBtn}>
                <ActivityIndicator size="small" color={color.white} />
                <Text style={ms.waitingBtnText}>Waiting for match</Text>
                <TouchableOpacity onPress={() => { handleCancelRequest(focusedSent.id); setFocusedSent(null); }}>
                  <X size={16} color={color.white + '80'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={ms.focusSafetyRow}>
              <Text style={ms.focusSafetyDisclaimer}>
                Your safety matters. If something feels off, let us know.
              </Text>
              <View style={ms.focusSafetyActions}>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => handleIgnore(focusedSent, () => setFocusedSent(null))}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ms.focusSafetyBtn} onPress={() => setFocusedSent(null)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={ms.focusSafetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[ms.focusSafetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setFocusedSent(null)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[ms.focusSafetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* ─── UNDO TOAST ─── */}
      {undoToast && (
        <Animated.View style={[ms.undoToast, { transform: [{ translateY: undoSlide }] }]}>
          <SafeAreaView edges={['top']}>
            <View style={ms.undoInner}>
              <Image source={undoToast.avatar} style={ms.undoAvatar} />
              <Text style={ms.undoText} numberOfLines={2}>
                {undoType.current === 'ignored'
                  ? <Text>You won't see messages from <Text style={{ fontWeight: '700' }}>{undoToast.name}</Text> anymore</Text>
                  : undoType.current === 'sent'
                  ? <Text>Cancelled spot for <Text style={{ fontWeight: '700' }}>{undoToast.name}</Text></Text>
                  : <Text>You passed on <Text style={{ fontWeight: '700' }}>{undoToast.name}</Text></Text>}
              </Text>
              <TouchableOpacity style={ms.undoBtn} onPress={handleUndo} activeOpacity={0.7}>
                <Text style={ms.undoBtnText}>Undo</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
    </View>
  );
}

const ms = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.green.dark },
  bottomNavWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], paddingBottom: spacing['3xl'] },
  title: { ...typography.h4, fontSize: 36, lineHeight: 44, color: color.blue.light },
  closeBtn: { width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2, backgroundColor: color.green.light + '1A', alignItems: 'center', justifyContent: 'center' },

  // Spotted You
  spottedSection: { paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: color.green.light + '1A', marginBottom: spacing.md },
  spottedTitle: { ...typography.body, fontWeight: '700', color: color.green.light, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  spottedScroll: { paddingHorizontal: spacing.xl, gap: spacing.md },
  spottedCard: { width: (Dimensions.get('window').width - spacing.xl * 2 - spacing.md * 2) / 2.5, backgroundColor: color.green.light + '14', borderRadius: radius.xl, padding: spacing.lg, alignItems: 'center', gap: spacing.md },
  spottedProfileTap: { alignItems: 'center', gap: spacing.sm },
  spottedAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: color.orange.dark },
  spottedInfo: { alignItems: 'center', gap: 1 },
  spottedName: { ...typography.body, fontWeight: '600', color: color.blue.light, textAlign: 'center' },
  spottedVenue: { ...typography.caption, fontSize: 12, color: color.white + '4D', textAlign: 'center' },
  spottedActions: { flexDirection: 'row', gap: spacing.sm, alignSelf: 'stretch' },
  spottedAccept: { flex: 1, height: 36, borderRadius: 18, backgroundColor: color.blue.dark, alignItems: 'center', justifyContent: 'center' },
  spottedDecline: { flex: 1, height: 36, borderRadius: 18, backgroundColor: color.orange.dark, alignItems: 'center', justifyContent: 'center' },

  // Tabs
  tabs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  tabsLeft: { flexDirection: 'row', gap: spacing.sm },
  sentRequestsBtn: { ...typography.caption, fontSize: 14, fontWeight: '600', color: color.green.light + '80' },

  // Sent requests
  sentActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sentSpinner: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.green.light + '1A' },
  sentCancel: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.orange.dark },
  tab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: color.green.light + '14' },
  tabActive: { backgroundColor: color.green.light },
  tabText: { ...typography.body, fontSize: 14, fontWeight: '600', color: color.green.light + '80' },
  tabTextActive: { color: color.green.dark },

  // Match row
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: color.green.light + '1A' },
  matchAvatarRing: { padding: 2, borderRadius: spacing['2xl'], borderWidth: 2, borderColor: color.green.light },
  matchAvatar: { width: spacing['3xl'], height: spacing['3xl'], borderRadius: spacing['3xl'] / 2 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: color.green.dark, borderWidth: 2, borderColor: color.charcoal },
  matchInfo: { flex: 1 },
  matchTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  matchName: { ...typography.body, fontWeight: '600', color: color.blue.light },
  matchTime: { ...typography.caption, fontSize: 12, color: color.green.light + '66' },
  matchLastMsg: { ...typography.body, fontSize: 14, color: color.beige + '80', flex: 1 },
  matchLastMsgUnread: { color: color.beige },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.orange.dark, marginLeft: spacing.sm },

  // Empty
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: spacing['3xl'] * 2 },
  emptyTitle: { ...typography.body, color: color.green.light + '80', marginTop: spacing.md },
  emptySubtitle: { ...typography.caption, fontSize: 12, color: color.green.light + '4D', marginTop: spacing.xs },

  // DM
  dmBg: { ...StyleSheet.absoluteFillObject, backgroundColor: color.beige },
  dmHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: color.mid, borderBottomWidth: 1, borderBottomColor: color.olive.light + '33' },
  dmAvatar: { width: 72, height: 72, borderRadius: 36 },
  dmName: { ...typography.body, fontWeight: '700', color: color.charcoal },
  dmViewProfileBtn: { alignSelf: 'flex-start', backgroundColor: color.olive.light + '33', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.lg },
  dmViewProfileText: { ...typography.caption, fontSize: 12, fontWeight: '600', color: color.olive.dark },
  dmClose: { width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2, backgroundColor: color.olive.light + '4D', alignItems: 'center', justifyContent: 'center' },
  pattern: { ...StyleSheet.absoluteFillObject, opacity: 0.04, overflow: 'hidden', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl, padding: spacing.lg },
  timestamp: { alignItems: 'center', paddingVertical: spacing.lg },
  timestampText: { ...typography.caption, fontSize: 12, fontWeight: '600', color: color.olive.dark + '80' },
  msgRow: { flexDirection: 'row' },
  msgRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  bubbleMe: { backgroundColor: color.orange.dark, borderBottomRightRadius: spacing.xs },
  bubbleOther: { backgroundColor: color.white, borderBottomLeftRadius: spacing.xs },
  bubbleText: { ...typography.body, color: color.white },
  bubbleTime: { fontSize: 10, color: color.white + 'B3', marginTop: spacing.xs, alignSelf: 'flex-end' },
  inputWrap: { padding: spacing.lg, paddingBottom: spacing.xl, backgroundColor: color.mid, borderTopWidth: 1, borderTopColor: color.olive.light + '33' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: color.beige, borderRadius: radius.full, paddingLeft: spacing.lg, paddingRight: spacing.xs, paddingVertical: spacing.xs },
  input: { flex: 1, ...typography.body, color: color.charcoal, paddingVertical: spacing.sm },
  sendBtn: { width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2, backgroundColor: color.olive.dark + '33', alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: color.orange.dark },

  // Focus overlay (spotted profile)
  focusOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, backgroundColor: color.charcoal },
  focusImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  focusHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  focusClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.charcoal + '80', alignItems: 'center', justifyContent: 'center' },
  focusBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  focusNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  focusName: { ...typography.h1, color: color.white },
  focusAge: { ...typography.body, color: color.white, marginTop: spacing.xs },
  notInterestedBtn: { alignItems: 'center', paddingVertical: spacing.md, borderWidth: 1, borderColor: color.white + '33', borderRadius: radius.full },
  notInterestedText: { ...typography.body, color: color.white + 'CC', fontWeight: '500' },
  focusSafetyRow: { marginTop: spacing.lg, gap: spacing.sm },
  focusSafetyDisclaimer: { ...typography.body, color: color.white + '4D', textAlign: 'center' },
  focusSafetyActions: { flexDirection: 'row', gap: spacing.sm },
  focusSafetyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: color.white + '26' },
  waitingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: color.white + '1A', borderRadius: radius.full, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  waitingBtnText: { ...typography.body, color: color.white, fontWeight: '600', flex: 1 },
  focusSafetyLabel: { ...typography.body, color: color.white + 'CC' },

  // Undo toast
  undoToast: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200, paddingHorizontal: spacing.lg },
  undoInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: color.charcoal, borderRadius: radius.full, padding: spacing.sm, shadowColor: color.charcoal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  undoAvatar: { width: 32, height: 32, borderRadius: 16 },
  undoText: { flex: 1, ...typography.body, fontSize: 14, color: color.white },
  undoBtn: { backgroundColor: color.blue.dark, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
  undoBtnText: { ...typography.caption, fontSize: 12, fontWeight: '700', color: color.white },
});
