/**
 * CheckedInScreen - Converted 1:1 from Hactually 2.0 CheckedInScreenV2.jsx
 * Alternating size carousel, focus mode, chat chip, spots panel
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, LogOut, ChevronUp, ChevronRight, ArrowUp, Eye, EyeOff, Ban, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { color, spacing, radius, typography } from '../theme';
import { LogoMark, Button } from '../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Profile images from Hactually 2.0
const PROFILE_IMAGES = [
  require('../../assets/images/profiles/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'),
  require('../../assets/images/profiles/daniel-monteiro-uGVqeh27EHE-unsplash.jpg'),
  require('../../assets/images/profiles/brooke-cagle-KriecpTIWgY-unsplash.jpg'),
  require('../../assets/images/profiles/natalia-blauth-gw2udfGe_tM-unsplash.jpg'),
  require('../../assets/images/profiles/jakob-owens-lkMJcGDZLVs-unsplash.jpg'),
  require('../../assets/images/profiles/rayul-_M6gy9oHgII-unsplash.jpg'),
  require('../../assets/images/profiles/arrul-lin-sYhUhse5uT8-unsplash.jpg'),
];

const PEOPLE = [
  { id: 1, name: 'Sophia', age: 24, avatar: PROFILE_IMAGES[0], bio: 'chasing sunsets & good conversations', interests: ['Travel', 'Wine', 'Art'] },
  { id: 2, name: 'Emma', age: 26, avatar: PROFILE_IMAGES[1], bio: 'probably at a coffee shop right now', interests: ['Coffee', 'Books', 'Yoga'] },
  { id: 3, name: 'Marcus', age: 28, avatar: PROFILE_IMAGES[2], bio: 'music producer by day, dj by night', interests: ['Music', 'Vinyl', 'Tech'] },
  { id: 4, name: 'Isabella', age: 23, avatar: PROFILE_IMAGES[3], bio: 'life is short, eat the dessert first', interests: ['Food', 'Dance', 'Fashion'] },
  { id: 5, name: 'Luna', age: 25, avatar: PROFILE_IMAGES[4], bio: 'somewhere between chaos and calm', interests: ['Meditation', 'Surf', 'Photography'] },
  { id: 6, name: 'Jake', age: 27, avatar: PROFILE_IMAGES[5], bio: 'building things & breaking boundaries', interests: ['Startups', 'Fitness', 'Cars'] },
  { id: 7, name: 'Mia', age: 24, avatar: PROFILE_IMAGES[6], bio: 'finding magic in the mundane', interests: ['Film', 'Cooking', 'Plants'] },
  { id: 8, name: 'Alex', age: 29, avatar: PROFILE_IMAGES[7], bio: 'professional overthinker, amateur chef', interests: ['Gaming', 'Crypto', 'Sneakers'] },
];

const MOCK_MESSAGES = [
  { id: 1, user: 'Sophia', avatar: PROFILE_IMAGES[0], message: 'Just got here, vibes are amazing tonight! 🔥', time: '2m ago' },
  { id: 2, user: 'Marcus', avatar: PROFILE_IMAGES[2], message: 'Anyone at the rooftop bar?', time: '5m ago' },
  { id: 3, user: 'Emma', avatar: PROFILE_IMAGES[1], message: 'DJ is killing it rn', time: '8m ago' },
  { id: 4, user: 'Jake', avatar: PROFILE_IMAGES[5], message: 'Table 12 if anyone wants to join', time: '12m ago' },
];

// ─── CAROUSEL ───
const SMALL_SIZE = 120;
const FOCUSED_SIZE = 200;
const GAP = -8;
const ROW_GAP = -55;
const NUM_ROWS = 5;
const COL_WIDTH = FOCUSED_SIZE + GAP;
const SMALL_SCALE = SMALL_SIZE / FOCUSED_SIZE;
const POSITIONS = [-2, -1, 0, 1, 2];

function AlternatingSizeCarousel({ people, onPersonClick, activeIndex, onActiveChange, spotted = [], requests = [], matched = [] }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const isDragging = useRef(false);
  const isAnimatingRef = useRef(false);
  const startX = useRef(0);

  isAnimatingRef.current = isAnimating;

  // Auto-scroll every 3s
  useEffect(() => {
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastTime >= 3000 && !isDragging.current && !isAnimatingRef.current) {
        lastTime = now;
        setIsAnimating(true);
        setIsAutoScrolling(true);
        setFlipCount(c => c + 1);
        setSwipeOffset(-COL_WIDTH);

        setTimeout(() => {
          onActiveChange((prev) => (prev + 1) % people.length);
          setSwipeOffset(0);
          setIsAnimating(false);
          setIsAutoScrolling(false);
        }, 500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getRowPeople = (rowIndex) => {
    const off = (rowIndex * 3) % people.length;
    return [...people.slice(off), ...people.slice(0, off)];
  };

  // Drag handlers — works with touch AND mouse/trackpad
  const handleDragStart = (clientX) => {
    if (isAnimating) return;
    isDragging.current = true;
    startX.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (isAnimating || !isDragging.current) return;
    const diff = clientX - startX.current;
    const clamped = Math.max(-COL_WIDTH * 1.2, Math.min(COL_WIDTH * 1.2, diff));
    setSwipeOffset(clamped);
  };

  const handleDragEnd = () => {
    if (isAnimating || !isDragging.current) return;
    isDragging.current = false;

    if (Math.abs(swipeOffset) > COL_WIDTH * 0.25) {
      const direction = swipeOffset < 0 ? -1 : 1;
      setIsAnimating(true);
      setFlipCount(c => c + 1);
      setSwipeOffset(direction * COL_WIDTH);

      setTimeout(() => {
        if (direction < 0) {
          onActiveChange((activeIndex + 1) % people.length);
        } else {
          onActiveChange((activeIndex - 1 + people.length) % people.length);
        }
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 150);
    } else {
      setSwipeOffset(0);
    }
  };

  // Touch events
  const handleTouchStart = (e) => handleDragStart(e.nativeEvent.pageX);
  const handleTouchMove = (e) => handleDragMove(e.nativeEvent.pageX);
  const handleTouchEnd = () => handleDragEnd();

  // Mouse events for web/trackpad
  const handleMouseDown = (e) => { e.preventDefault?.(); handleDragStart(e.nativeEvent?.pageX || e.pageX); };
  const handleMouseMove = (e) => handleDragMove(e.nativeEvent?.pageX || e.pageX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => { if (isDragging.current) handleDragEnd(); };

  const avgRowHeight = (SMALL_SIZE + FOCUSED_SIZE) / 2;
  const totalHeight = NUM_ROWS * avgRowHeight + (NUM_ROWS - 1) * ROW_GAP;

  return (
    <View
      style={[s.carouselContainer, { cursor: 'grab', userSelect: 'none' }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <View style={[s.carouselInner, { height: totalHeight }]}>
        {POSITIONS.map((position) => {
          const colIndex = ((activeIndex + position) % people.length + people.length) % people.length;
          const xPos = position * COL_WIDTH + swipeOffset;

          return (
            <View
              key={`col-${colIndex}`}
              style={[
                s.carouselColumn,
                {
                  gap: ROW_GAP,
                  transform: [{ translateX: xPos }],
                  transition: isAnimating
                    ? `transform ${isAutoScrolling ? '0.5s' : '0.15s'} cubic-bezier(0.4, 0, 0.2, 1)`
                    : 'none',
                },
              ]}
            >
              {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
                const rowPeople = getRowPeople(rowIndex);
                const rowPerson = rowPeople[colIndex];
                const isLarge = (colIndex + rowIndex + flipCount) % 2 === 0;
                const scale = isLarge ? 1 : SMALL_SCALE;
                const isSpotted = spotted.includes(rowPerson.id);
                const pid = rowPerson.id;
                const isMatch = matched.includes(pid);
                const isIncoming = requests.includes(pid) && !isMatch;
                const isOutgoing = spotted.includes(pid) && !isMatch;

                return (
                  <View key={`row-${rowIndex}`} style={{ width: FOCUSED_SIZE, height: FOCUSED_SIZE, transform: [{ scale }], transition: 'transform 0.35s ease-out' }}>

                    <TouchableOpacity
                      activeOpacity={position === 0 ? 0.8 : 1}
                      onPress={() => position === 0 && onPersonClick(rowPerson, colIndex)}
                      style={s.carouselCell}
                    >
                      {/* Photo — desaturated for pending states */}
                      <Image
                        source={rowPerson.avatar}
                        style={[
                          s.carouselImage,
                          (isOutgoing || isIncoming) && { filter: 'grayscale(1)' },
                        ]}
                      />

                      {/* Outgoing: blue gradient dark→light */}
                      {isOutgoing && (
                        <LinearGradient
                          colors={[color.blue.dark + 'CC', color.blue.dark + '40']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={[s.colorShade, { borderRadius: FOCUSED_SIZE / 2 }]}
                        />
                      )}

                      {/* Incoming: green gradient dark→light */}
                      {isIncoming && (
                        <LinearGradient
                          colors={[color.green.light + 'CC', color.green.light + '40']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={[s.colorShade, { borderRadius: FOCUSED_SIZE / 2 }]}
                        />
                      )}

                      {/* Outgoing/Incoming: spinner in center */}
                      {(isOutgoing || isIncoming) && (
                        <View style={s.pendingCenter}>
                          <View style={s.pendingCircle}>
                            <ActivityIndicator
                              size="small"
                              color={color.white}
                            />
                          </View>
                        </View>
                      )}

                      {/* Matched: shimmer overlay on photo */}
                      {isMatch && (
                        <View style={s.matchShimmer} />
                      )}
                    </TouchableOpacity>

                    {/* Matched: orange glow ring — OUTSIDE clipped cell */}
                    {isMatch && (
                      <View style={s.matchGlow} pointerEvents="none" />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── CHAT CHIP (collapsed) ───
function ChatChip({ onToggle, currentMessage }) {
  return (
    <TouchableOpacity
      style={s.chatChip}
      activeOpacity={0.98}
      onPress={onToggle}
    >
      <View style={s.chatChipInner}>
        <View style={s.chatChipContent}>
          <View style={s.chatChipHeader}>
            <Text style={s.chatChipTitle}>Group Chat</Text>
          </View>
          <Text style={s.chatChipMessage} numberOfLines={1}>
            <Text style={s.chatChipUser}>{currentMessage.user}:</Text> {currentMessage.message}
          </Text>
        </View>
        <ChevronUp size={20} color={color.olive.dark} />
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ───
export default function CheckedInScreen({ route, navigation }) {
  const venue = route?.params?.venue || { id: 1, name: 'White Dubai', area: 'Meydan' };
  const [activeIndex, setActiveIndex] = useState(0);
  const [spotted, setSpotted] = useState([]);             // outgoing (you spotted them)
  const [requests, setRequests] = useState([1, 3, 5, 7]); // 4 incoming (they spotted you)
  const [matched, setMatched] = useState([]);             // mutual matches
  const [openPanel, setOpenPanel] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedPerson, setFocusedPerson] = useState(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [dmPerson, setDmPerson] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [reportReason, setReportReason] = useState(null);
  const [matchPopup, setMatchPopup] = useState(null); // person object when match happens
  const [reportMessage, setReportMessage] = useState('');

  const pendingRequests = requests.filter(id => !matched.includes(id)).length;

  // Inject CSS keyframes for match shimmer
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const id = 'match-shimmer-css';
      if (!document.getElementById(id)) {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `@keyframes matchShimmerAnim { 0% { background-position: 150% 0; } 100% { background-position: -50% 0; } }`;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Blinking notification dot
  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (pendingRequests > 0) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0.2, duration: 600, useNativeDriver: false }),
          Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      blinkAnim.setValue(1);
    }
  }, [pendingRequests]);

  // Cycle chat messages
  useEffect(() => {
    if (openPanel) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % MOCK_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [openPanel]);

  const activePerson = focusedPerson || PEOPLE[activeIndex % PEOPLE.length];
  const isActiveSpotted = spotted.includes(activePerson?.id);
  const isActiveIncoming = requests.includes(activePerson?.id) && !matched.includes(activePerson?.id);
  const isActiveMatched = matched.includes(activePerson?.id);

  const handleProfileClick = (person) => {
    setFocusedPerson(person);
    setIsFocusMode(true);
  };

  const handleCloseFocus = () => {
    setIsFocusMode(false);
    setFocusedPerson(null);
  };

  const handleSpot = () => {
    if (activePerson && !spotted.includes(activePerson.id)) {
      setSpotted([...spotted, activePerson.id]);
    }
  };

  const handleAcceptMatch = (personId) => {
    const person = PEOPLE.find(p => p.id === personId);
    setMatched([...matched, personId]);
    setRequests(requests.filter(r => r !== personId));
    if (person) setMatchPopup(person);
  };

  const openDm = (person) => {
    setDmPerson(person);
    setDmMessages([
      { id: 0, type: 'timestamp', label: 'Yesterday' },
      { id: 1, message: "Hey! I saw you at the venue 👋", time: '8:42 PM', isMe: false },
      { id: 2, message: "Oh hey! Yeah I spotted you too haha", time: '8:43 PM', isMe: true },
      { id: 3, type: 'timestamp', label: 'Today' },
      { id: 4, message: "This DJ is incredible tonight", time: '8:45 PM', isMe: false },
      { id: 5, message: "Right?? Best set I've heard in a while", time: '8:46 PM', isMe: true },
      { id: 6, message: "Are you here with friends?", time: '8:48 PM', isMe: false },
      { id: 7, message: "Yeah a few of us! Near the bar area", time: '8:49 PM', isMe: true },
    ]);
  };

  const handleDmSend = () => {
    if (message.trim() && dmPerson) {
      setDmMessages([...dmMessages, { id: Date.now(), message: message.trim(), time: 'now', isMe: true }]);
      setMessage('');
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        { id: Date.now(), user: 'You', avatar: PROFILE_IMAGES[6], message: message.trim(), time: 'now', isMe: true },
        ...messages,
      ]);
      setMessage('');
    }
  };

  return (
    <View style={s.container}>
      {/* ─── Focus Mode (full screen profile) ─── */}
      {isFocusMode && focusedPerson && (
        <View style={s.focusOverlay}>
          <Image source={focusedPerson.avatar} style={s.focusImage} />
          {/* Gradient overlay */}
          <LinearGradient
            colors={[color.charcoal + '4D', 'transparent', 'transparent', color.charcoal + 'B3']}
            locations={[0, 0.3, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Header */}
          <SafeAreaView edges={['top']} style={s.focusHeader}>
            <LogoMark size={48} color={color.blue.light} />
            <TouchableOpacity style={s.focusClose} onPress={handleCloseFocus}>
              <X size={20} color={color.white} />
            </TouchableOpacity>
          </SafeAreaView>
          {/* Profile info + actions at bottom */}
          <SafeAreaView edges={['bottom']} style={s.focusBottom}>
            {/* Name row — with "spotted you" badge if incoming */}
            <View style={s.focusNameRow}>
              <Text style={s.focusName}>{focusedPerson.name}</Text>
              {isActiveIncoming && (
                <Text style={s.spottedYouLabel}>spotted you</Text>
              )}
            </View>
            {/* Age + bio on second line */}
            <Text style={s.focusAge}>{focusedPerson.age}, "{focusedPerson.bio}"</Text>

            {/* Interests */}
            {focusedPerson.interests && (
              <View style={s.focusInterests}>
                {focusedPerson.interests.map((i) => (
                  <View key={i} style={s.focusInterestTag}>
                    <Text style={s.focusInterestText}>{i}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.md }}>
              {/* STATE: Matched — message button */}
              {isActiveMatched && (
                <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleCloseFocus(); setOpenPanel('spots'); openDm(focusedPerson); }}>
                  Message {focusedPerson.name}
                </Button>
              )}

              {/* STATE: Incoming request — spot back + not interested */}
              {isActiveIncoming && (
                <View style={{ gap: spacing.sm }}>
                  <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleAcceptMatch(focusedPerson.id); handleCloseFocus(); }}>
                    Spot Back
                  </Button>
                  <TouchableOpacity
                    style={s.notInterestedBtn}
                    onPress={() => { setRequests(requests.filter(r => r !== focusedPerson.id)); handleCloseFocus(); }}
                  >
                    <Text style={s.notInterestedText}>Not interested?</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STATE: Outgoing spot — waiting + cancel */}
              {isActiveSpotted && !isActiveMatched && (
                <View style={s.waitingButton}>
                  <View style={s.waitingContent}>
                    <View style={s.waitingSpinnerCircle}>
                      <ActivityIndicator size="small" color={color.white} />
                    </View>
                    <Text style={s.waitingText}>Waiting for match</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSpotted(spotted.filter(id => id !== focusedPerson.id))}>
                    <X size={16} color={color.white + '80'} />
                  </TouchableOpacity>
                </View>
              )}

              {/* STATE: Default — spot button */}
              {!isActiveSpotted && !isActiveIncoming && !isActiveMatched && (
                <Button variant="solid" color="orange" size="lg" fullWidth onPress={handleSpot}>
                  Spot {focusedPerson.name}
                </Button>
              )}

              {/* Safety actions */}
              <View style={s.focusSafetyRow}>
                <Text style={s.focusSafetyDisclaimer}>
                  Your safety matters. If something feels off, let us know — all reports are confidential and reviewed within 24 hours.
                </Text>
                <View style={s.focusSafetyActions}>
                  <TouchableOpacity style={s.focusSafetyBtn} onPress={handleCloseFocus}>
                    <EyeOff size={13} color={color.white + '80'} />
                    <Text style={s.focusSafetyLabel}>Ignore</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.focusSafetyBtn} onPress={() => setShowBlock(true)}>
                    <Ban size={13} color={color.white + '80'} />
                    <Text style={s.focusSafetyLabel}>Block</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.focusSafetyBtn, { backgroundColor: color.error.light + '26' }]} onPress={() => setShowReport(true)}>
                    <AlertTriangle size={13} color={color.error.light} />
                    <Text style={[s.focusSafetyLabel, { color: color.error.light }]}>Report</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* ─── Header bar ─── */}
      <SafeAreaView edges={['top']} style={s.header}>
        <View style={s.headerBar}>
          <View style={s.venueBar}>
            <Text style={s.venueName}>{venue.name || 'White Dubai'}</Text>
            <TouchableOpacity style={s.leaveButton} onPress={() => navigation.goBack()}>
              <Text style={s.leaveText}>Leave</Text>
              <LogOut size={12} color={color.olive.dark} />
            </TouchableOpacity>
          </View>
          {/* Heart button */}
          <TouchableOpacity
            style={s.heartButton}
            onPress={() => setOpenPanel(openPanel === 'spots' ? null : 'spots')}
            activeOpacity={0.9}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill={color.orange.dark}>
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </Svg>
            {pendingRequests > 0 && (
              <Animated.View style={[s.notificationDot, { opacity: blinkAnim }]} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ─── Carousel ─── */}
      {!isFocusMode && (
        <View style={s.carouselWrapper}>
          <AlternatingSizeCarousel
            people={PEOPLE}
            onPersonClick={(person) => handleProfileClick(person)}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            spotted={spotted}
            requests={requests}
            matched={matched}
          />
        </View>
      )}

      {/* ─── Chat Chip (collapsed) ─── */}
      {!isFocusMode && openPanel === null && (
        <ChatChip
          onToggle={() => setOpenPanel('chat')}
          currentMessage={MOCK_MESSAGES[currentMessageIndex]}
        />
      )}

      {/* ─── Expanded Panel (Chat or Spots) ─── */}
      {openPanel !== null && (
        <View style={[s.expandedPanel, { transform: [{ translateY: 0 }] }]}>
          {/* Dark blurred background */}
          <View style={s.panelBg} />
          <Image
            source={require('../../assets/venues/1.jpg')}
            style={s.panelBgImage}
            blurRadius={6}
          />

          <SafeAreaView edges={['top', 'bottom']} style={s.panelContent}>
            {/* Panel header */}
            <View style={s.panelHeader}>
              {!dmPerson && (
                <>
                  <Text style={s.panelTitle}>
                    {openPanel === 'chat' ? 'Group Chat' : 'Spots'}
                  </Text>
                  <TouchableOpacity style={s.panelClose} onPress={() => setOpenPanel(null)}>
                    <X size={20} color={color.white + 'CC'} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* ─── GROUP CHAT ─── */}
            {openPanel === 'chat' && (
              <View style={{ flex: 1 }}>
                <Text style={s.chatDisclaimer}>
                  Messages here are visible to everyone checked in at this venue.{'\n'}Be respectful and have fun.
                </Text>
                <ScrollView style={s.chatMessages} contentContainerStyle={{ paddingBottom: spacing['3xl'] }}>
                  {[...messages].reverse().map((msg) => (
                    <View key={msg.id} style={[s.chatRow, msg.isMe && s.chatRowMe]}>
                      <Image source={msg.avatar} style={s.chatAvatar} />
                      <View style={[s.chatBubble, msg.isMe ? s.chatBubbleMe : s.chatBubbleOther]}>
                        {!msg.isMe && <Text style={s.chatBubbleUser}>{msg.user}</Text>}
                        <View style={s.chatBubbleBody}>
                          <Text style={s.chatBubbleText}>{msg.message}</Text>
                          <Text style={s.chatBubbleTime}>{msg.time}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                {/* Input */}
                <View style={s.chatInputWrap}>
                  <View style={s.chatInputBar}>
                    <TextInput
                      style={s.chatInput}
                      value={message}
                      onChangeText={setMessage}
                      placeholder="Message the venue..."
                      placeholderTextColor={color.white + '66'}
                      onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                      style={[s.chatSendButton, message.trim() && s.chatSendButtonActive]}
                      onPress={handleSend}
                      disabled={!message.trim()}
                    >
                      <ArrowUp size={16} color={message.trim() ? color.white : color.white + '4D'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* ─── SPOTS ─── */}
            {openPanel === 'spots' && !dmPerson && (
              <ScrollView style={s.spotsList} contentContainerStyle={{ paddingBottom: spacing['3xl'] }}>
                {(() => {
                  const allSpots = [];
                  PEOPLE.filter(p => requests.includes(p.id) && !matched.includes(p.id)).forEach(p => allSpots.push({ ...p, type: 'incoming' }));
                  PEOPLE.filter(p => matched.includes(p.id)).forEach(p => allSpots.push({ ...p, type: 'match' }));
                  PEOPLE.filter(p => spotted.includes(p.id) && !matched.includes(p.id)).forEach(p => allSpots.push({ ...p, type: 'outgoing' }));

                  if (allSpots.length === 0) {
                    return (
                      <View style={s.spotsEmpty}>
                        <Eye size={40} color={color.white + '33'} />
                        <Text style={s.spotsEmptyTitle}>No spots yet</Text>
                        <Text style={s.spotsEmptySubtitle}>Spot someone to start a connection</Text>
                      </View>
                    );
                  }

                  return allSpots.map((person) => (
                    <TouchableOpacity
                      key={`${person.type}-${person.id}`}
                      style={s.spotRow}
                      activeOpacity={person.type === 'match' ? 0.7 : 1}
                      onPress={() => person.type === 'match' && openDm(person)}
                    >
                      {/* Direction arrow */}
                      <View style={s.spotArrow}>
                        {person.type === 'outgoing' && (
                          <Svg width={10} height={10} viewBox="0 0 16 16" fill="none">
                            <Path d="M4 12L12 4" stroke={color.blue.dark} strokeWidth={3} strokeLinecap="round" />
                            <Path d="M6 4H12V10" stroke={color.blue.dark} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                          </Svg>
                        )}
                        {person.type === 'incoming' && (
                          <Svg width={10} height={10} viewBox="0 0 16 16" fill="none">
                            <Path d="M12 4L4 12" stroke={color.green.light} strokeWidth={3} strokeLinecap="round" />
                            <Path d="M4 6V12H10" stroke={color.green.light} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                          </Svg>
                        )}
                        {person.type === 'match' && (
                          <Svg width={12} height={12} viewBox="0 0 24 24" fill={color.orange.dark}>
                            <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </Svg>
                        )}
                      </View>
                      {/* Avatar with ring matching carousel */}
                      <View style={[
                        s.spotAvatarRing,
                        person.type === 'match' && { borderColor: color.orange.dark },
                        person.type === 'incoming' && { borderColor: color.green.light },
                        person.type === 'outgoing' && { borderColor: color.blue.dark },
                      ]}>
                        <Image source={person.avatar} style={s.spotAvatar} />
                      </View>
                      {/* Info */}
                      <View style={s.spotInfo}>
                        <View style={s.spotNameRow}>
                          <Text style={s.spotName}>{person.name}</Text>
                          {person.type === 'incoming' && (
                            <Text style={s.spottedYouBadge}>SPOTTED YOU</Text>
                          )}
                        </View>
                        <Text style={s.spotSubtext}>
                          {person.type === 'match' ? 'Matched — tap to message' :
                           person.type === 'incoming' ? 'Tap to view profile' :
                           'Waiting for match'}
                        </Text>
                      </View>
                      {/* Action — outgoing: spinner + cancel */}
                      {person.type === 'outgoing' && (
                        <View style={s.spotActions}>
                          <View style={s.spotSpinnerCircle}>
                            <ActivityIndicator size="small" color={color.white} />
                          </View>
                          <TouchableOpacity
                            style={s.spotActionBtnWhite}
                            onPress={() => setSpotted(spotted.filter(sid => sid !== person.id))}
                          >
                            <X size={14} color={color.orange.dark} />
                          </TouchableOpacity>
                        </View>
                      )}
                      {/* Action — incoming: accept + decline */}
                      {person.type === 'incoming' && (
                        <View style={s.spotActions}>
                          <TouchableOpacity
                            style={s.spotActionBtnWhite}
                            onPress={() => handleAcceptMatch(person.id)}
                          >
                            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                              <Path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={color.green.light} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={s.spotActionBtnWhite}
                            onPress={() => setRequests(requests.filter(r => r !== person.id))}
                          >
                            <X size={14} color={color.orange.dark} />
                          </TouchableOpacity>
                        </View>
                      )}
                      {/* Matched: chevron to DM */}
                      {person.type === 'match' && (
                        <ChevronRight size={16} color={color.white + '66'} />
                      )}
                    </TouchableOpacity>
                  ));
                })()}
              </ScrollView>
            )}

            {/* ─── DM VIEW ─── */}
            {dmPerson && (
              <View style={s.dmView}>
                {/* Beige background */}
                <View style={s.dmBg} />

                {/* DM Header */}
                <View style={s.dmHeader}>
                  <TouchableOpacity onPress={() => { setDmPerson(null); setOpenPanel(null); setFocusedPerson(dmPerson); setIsFocusMode(true); }}>
                    <Image source={dmPerson.avatar} style={s.dmHeaderAvatar} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { setDmPerson(null); setOpenPanel(null); setFocusedPerson(dmPerson); setIsFocusMode(true); }}>
                    <Text style={s.dmHeaderName}>{dmPerson.name}</Text>
                    <View style={s.dmViewProfileRow}>
                      <Text style={s.dmViewProfile}>View Profile</Text>
                      <ChevronRight size={12} color={color.olive.dark} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.dmCloseBtn} onPress={() => { setDmPerson(null); setOpenPanel(null); }}>
                    <X size={18} color={color.charcoal} />
                  </TouchableOpacity>
                </View>

                {/* Messages area — pattern fills entire view, chat scrolls on top */}
                <View style={{ flex: 1, position: 'relative' }}>
                  {/* H logo pattern filling the whole area */}
                  <View style={s.dmPatternContainer} pointerEvents="none">
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
                          <View key={msg.id} style={s.dmTimestamp}>
                            <Text style={s.dmTimestampText}>{msg.label}</Text>
                          </View>
                        );
                      }
                      return (
                        <View key={msg.id} style={[s.dmRow, msg.isMe && s.dmRowMe]}>
                          <View style={[s.dmBubble, msg.isMe ? s.dmBubbleMe : s.dmBubbleOther]}>
                            <Text style={[s.dmBubbleText, !msg.isMe && { color: color.charcoal }]}>{msg.message}</Text>
                            <Text style={[s.dmBubbleTime, !msg.isMe && { color: color.olive.dark + '66' }]}>{msg.time}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Input */}
                <View style={s.dmInputWrap}>
                  <View style={s.dmInputBar}>
                    <TextInput
                      style={s.dmInput}
                      value={message}
                      onChangeText={setMessage}
                      placeholder={`Message ${dmPerson.name}...`}
                      placeholderTextColor={color.olive.dark + '66'}
                      onSubmitEditing={handleDmSend}
                    />
                    <TouchableOpacity
                      style={[s.dmSendButton, message.trim() && s.dmSendButtonActive]}
                      onPress={handleDmSend}
                      disabled={!message.trim()}
                    >
                      <ArrowUp size={16} color={message.trim() ? color.white : color.olive.dark + '66'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
      )}

      {/* ─── REPORT MODAL ─── */}
      {showReport && focusedPerson && (
        <View style={s.reportOverlay}>
          <View style={s.reportCard}>
            {/* Close */}
            <TouchableOpacity style={s.reportClose} onPress={() => { setShowReport(false); setReportReason(null); setReportMessage(''); }}>
              <X size={18} color={color.olive.dark} />
            </TouchableOpacity>

            {/* Person info */}
            <View style={s.reportPersonRow}>
              <Image source={focusedPerson.avatar} style={s.reportAvatar} />
              <View>
                <Text style={s.reportPersonName}>Report {focusedPerson.name}</Text>
                <Text style={s.reportPersonAge}>{focusedPerson.age} years old</Text>
              </View>
            </View>

            <Text style={s.reportSubtitle}>What's the issue?</Text>

            {/* Reasons */}
            {['Inappropriate behaviour', 'Fake profile or spam', 'Made me uncomfortable'].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[s.reportOption, reportReason === reason && s.reportOptionActive]}
                onPress={() => setReportReason(reason)}
                activeOpacity={0.7}
              >
                <View style={[s.reportRadio, reportReason === reason && s.reportRadioActive]}>
                  {reportReason === reason && <View style={s.reportRadioDot} />}
                </View>
                <Text style={[s.reportOptionText, reportReason === reason && { color: color.charcoal }]}>{reason}</Text>
              </TouchableOpacity>
            ))}

            {/* Message */}
            <TextInput
              style={s.reportInput}
              placeholder="Add more details (optional)"
              placeholderTextColor={color.olive.dark + '66'}
              value={reportMessage}
              onChangeText={setReportMessage}
              multiline
              numberOfLines={3}
            />

            {/* Submit */}
            <TouchableOpacity
              style={[s.reportSubmit, !reportReason && { opacity: 0.4 }]}
              disabled={!reportReason}
              onPress={() => { setShowReport(false); setReportReason(null); setReportMessage(''); handleCloseFocus(); }}
              activeOpacity={0.8}
            >
              <Text style={s.reportSubmitText}>Submit Report</Text>
            </TouchableOpacity>

            <Text style={s.reportDisclaimer}>All reports are confidential and reviewed by our team.</Text>
            <TouchableOpacity style={s.blockCancel} onPress={() => { setShowReport(false); setReportReason(null); setReportMessage(''); }}>
              <Text style={s.blockCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─── BLOCK MODAL ─── */}
      {showBlock && focusedPerson && (
        <View style={s.reportOverlay}>
          <View style={s.reportCard}>
            <TouchableOpacity style={s.reportClose} onPress={() => setShowBlock(false)}>
              <X size={18} color={color.olive.dark} />
            </TouchableOpacity>
            <View style={s.reportPersonRow}>
              <Image source={focusedPerson.avatar} style={s.reportAvatar} />
              <View>
                <Text style={s.reportPersonName}>Block {focusedPerson.name}</Text>
                <Text style={s.reportPersonAge}>{focusedPerson.age} years old</Text>
              </View>
            </View>
            <Text style={s.reportSubtitle}>Are you sure?</Text>
            <Text style={{ ...typography.caption, color: color.olive.dark + '80', marginBottom: spacing.lg, lineHeight: 20 }}>
              {focusedPerson.name} won't be able to see your profile, spot you, or send you messages. They won't be notified.
            </Text>
            <TouchableOpacity
              style={s.reportSubmit}
              onPress={() => { setShowBlock(false); handleCloseFocus(); }}
              activeOpacity={0.8}
            >
              <Text style={s.reportSubmitText}>Block {focusedPerson.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.blockCancel}
              onPress={() => setShowBlock(false)}
              activeOpacity={0.7}
            >
              <Text style={s.blockCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─── MATCH POPUP ─── */}
      {matchPopup && (
        <View style={s.matchOverlay}>
          <View style={s.matchCard}>
            {/* Two profile photos */}
            <View style={s.matchPhotos}>
              <Image source={PROFILE_IMAGES[6]} style={s.matchPhoto} />
              <View style={s.matchHeartBadge}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill={color.white}>
                  <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </Svg>
              </View>
              <Image source={matchPopup.avatar} style={s.matchPhoto} />
            </View>

            <Text style={s.matchTitle}>It's a match!</Text>
            <Text style={s.matchSubtext}>
              You and {matchPopup.name} spotted each other and made a connection. Say hello!
            </Text>

            <Button
              variant="solid"
              color="blue"
              size="lg"
              fullWidth
              onPress={() => { setMatchPopup(null); setOpenPanel('spots'); openDm(matchPopup); }}
            >
              Send a Message
            </Button>

            <TouchableOpacity
              style={s.matchLater}
              onPress={() => { setMatchPopup(null); handleCloseFocus(); setOpenPanel(null); }}
            >
              <Text style={s.matchLaterText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── STYLES ───
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.beige,
    overflow: 'hidden',
  },

  // Header
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 },
  headerBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  venueBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: color.white + 'CC',
    borderWidth: 1, borderColor: color.olive.light + '4D',
    shadowColor: color.charcoal, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  venueName: { ...typography.body, fontWeight: '700', color: color.charcoal, flex: 1 },
  leaveButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: color.beige },
  leaveText: { ...typography.caption, fontSize: 11, color: color.olive.dark },
  heartButton: {
    width: spacing['3xl'], height: spacing['3xl'], borderRadius: spacing['3xl'] / 2,
    backgroundColor: color.white + 'CC', borderWidth: 1, borderColor: color.olive.light + '4D',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: color.charcoal, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  notificationDot: {
    position: 'absolute', top: -1, right: -1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: color.error.dark, borderWidth: 2, borderColor: color.white,
  },

  // Carousel
  carouselWrapper: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 0 },
  carouselContainer: { width: '100%' },
  carouselInner: { alignItems: 'center', justifyContent: 'center' },
  carouselColumn: { position: 'absolute', alignItems: 'center' },
  carouselCell: { width: FOCUSED_SIZE, height: FOCUSED_SIZE, borderRadius: FOCUSED_SIZE / 2, overflow: 'hidden' },
  carouselImage: { width: '100%', height: '100%' },
  colorShade: { ...StyleSheet.absoluteFillObject, borderRadius: FOCUSED_SIZE / 2 },
  matchGlow: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: (FOCUSED_SIZE + 8) / 2,
    borderWidth: 2,
    borderColor: color.orange.dark,
    boxShadow: `0 0 16px ${color.orange.dark}AA, 0 0 32px ${color.orange.dark}66, inset 0 0 8px ${color.orange.dark}33`,
  },
  matchShimmer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: FOCUSED_SIZE / 2,
    background: `linear-gradient(105deg, transparent 40%, ${color.orange.light}66 50%, transparent 60%)`,
    backgroundSize: '250% 100%',
    animation: 'matchShimmerAnim 2.5s ease-in-out infinite',
  },
  // Gradient border ring — 1px visible line + beige padding before photo
  // Faded beige circle in center of pending photos
  pendingCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.charcoal + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Focus mode
  focusOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 40 },
  focusImage: { width: '100%', height: '100%' },
  focusHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  focusClose: {
    width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2,
    backgroundColor: color.charcoal + '4D', alignItems: 'center', justifyContent: 'center',
  },
  focusBottom: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: spacing.xl, paddingBottom: spacing['2xl'],
  },
  focusNameRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  spottedYouLabel: { ...typography.caption, fontSize: 11, fontWeight: '700', color: color.green.light, letterSpacing: 1, textTransform: 'uppercase', textShadowColor: color.charcoal + '60', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  focusName: { ...typography.h2, color: color.white, textShadowColor: color.charcoal + '80', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  focusAge: { ...typography.body, color: color.white + 'CC', marginTop: spacing.xs, textShadowColor: color.charcoal + '60', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  focusInterests: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  focusInterestTag: { backgroundColor: color.white + '26', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  focusInterestText: { ...typography.caption, fontSize: 12, color: color.white + 'CC' },
  focusSafetyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingTop: spacing.lg },
  focusSafetyDisclaimer: { ...typography.caption, fontSize: 10, color: color.white + '4D', flex: 1, lineHeight: 14 },
  focusSafetyActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  focusSafetyBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: color.white + '14' },
  focusSafetyLabel: { ...typography.caption, fontSize: 11, fontWeight: '600', color: color.white + '80' },
  notInterestedBtn: {
    width: '100%', height: spacing['3xl'], borderRadius: radius.full,
    backgroundColor: color.white + '26', alignItems: 'center', justifyContent: 'center',
  },
  notInterestedText: { ...typography.caption, fontSize: 13, fontWeight: '500', color: color.white + 'CC' },
  waitingButton: {
    width: '100%', height: spacing['3xl'], borderRadius: radius.full,
    backgroundColor: color.white + '33', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  waitingContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  waitingSpinnerCircle: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, backgroundColor: color.white + '26', alignItems: 'center', justifyContent: 'center' },
  waitingText: { ...typography.caption, fontSize: 12, fontWeight: '500', color: color.white + 'CC' },

  // Chat chip (collapsed)
  chatChip: { position: 'absolute', bottom: spacing.xl, left: spacing.lg, right: spacing.lg, zIndex: 50 },
  chatChipInner: {
    borderRadius: radius.lg, backgroundColor: color.white + 'E6',
    borderWidth: 1, borderColor: color.white + '80',
    shadowColor: color.charcoal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  chatChipContent: { flex: 1 },
  chatChipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chatChipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.green.dark },
  chatChipTitle: { ...typography.body, fontWeight: '700', color: color.charcoal },
  chatChipMessage: { ...typography.caption, color: color.olive.dark + 'B3', marginTop: 2 },
  chatChipUser: { fontWeight: '600', color: color.olive.dark },

  // Expanded panel
  expandedPanel: { ...StyleSheet.absoluteFillObject, zIndex: 50, overflow: 'hidden' },
  panelBg: { ...StyleSheet.absoluteFillObject, backgroundColor: color.charcoal },
  panelBgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.3, transform: [{ scale: 1.05 }] },
  panelContent: { flex: 1, zIndex: 10 },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  panelTitle: { ...typography.h4, color: color.white },
  panelClose: {
    width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2,
    backgroundColor: color.white + '1A', alignItems: 'center', justifyContent: 'center',
  },

  // Chat messages
  chatDisclaimer: { ...typography.caption, fontSize: 10, color: color.white + 'CC', textAlign: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, lineHeight: 16 },
  chatMessages: { flex: 1, paddingHorizontal: spacing.lg },
  chatRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.lg },
  chatRowMe: { flexDirection: 'row-reverse' },
  chatAvatar: { width: 28, height: 28, borderRadius: 14 },
  chatBubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: spacing.sm },
  chatBubbleOther: { backgroundColor: color.white + '1A', borderBottomLeftRadius: 0 },
  chatBubbleMe: { backgroundColor: color.orange.dark + 'CC', borderBottomRightRadius: 0 },
  chatBubbleUser: { fontSize: 11, fontWeight: '600', color: color.orange.dark, marginBottom: 2 },
  chatBubbleBody: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  chatBubbleText: { ...typography.body, color: color.white, flex: 1 },
  chatBubbleTime: { fontSize: 10, color: color.white + '66' },
  chatInputWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, paddingTop: spacing.sm },
  chatInputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: color.white + '1A', borderRadius: radius.full,
    paddingLeft: spacing.lg, paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderWidth: 1, borderColor: color.white + '1A',
  },
  chatInput: { flex: 1, ...typography.body, color: color.white, paddingVertical: spacing.sm },
  chatSendButton: {
    width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm,
    borderRadius: (spacing['2xl'] + spacing.sm) / 2,
    backgroundColor: color.white + '1A', alignItems: 'center', justifyContent: 'center',
  },
  chatSendButtonActive: { backgroundColor: color.orange.dark },

  // Spots list
  spotsList: { flex: 1, paddingHorizontal: spacing.xl },
  spotRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: color.white + '1A',
  },
  spotArrow: { width: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  spotAvatarRing: { padding: 2, borderRadius: spacing['2xl'], borderWidth: 2 },
  spotAvatar: { width: spacing['3xl'], height: spacing['3xl'], borderRadius: spacing['3xl'] / 2, borderWidth: 2, borderColor: color.charcoal + '4D' },
  spotInfo: { flex: 1 },
  spotNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  spotName: { ...typography.body, fontWeight: '600', color: color.white },
  spottedYouBadge: { fontSize: 9, fontWeight: '700', color: color.green.light, letterSpacing: 1, textTransform: 'uppercase' },
  spotSubtext: { fontSize: 11, color: color.white + '66', marginTop: 2 },
  spotActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  spotActionBtnWhite: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.white + '26' },
  spotSpinnerCircle: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: color.white + '1A' },
  // DM view
  dmView: { ...StyleSheet.absoluteFillObject, zIndex: 20 },
  dmBg: { ...StyleSheet.absoluteFillObject, backgroundColor: color.beige },
  dmHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: color.mid, borderBottomWidth: 1, borderBottomColor: color.olive.light + '33',
    zIndex: 10,
  },
  dmCloseBtn: { width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2, backgroundColor: color.mid, alignItems: 'center', justifyContent: 'center' },
  dmHeaderAvatar: { width: 80, height: 80, borderRadius: 40 },
  dmHeaderName: { ...typography.body, fontWeight: '700', color: color.charcoal, marginBottom: 0 },
  dmViewProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  dmViewProfile: { ...typography.body, fontSize: 13, fontWeight: '500', color: color.olive.dark },
  dmPatternContainer: {
    ...StyleSheet.absoluteFillObject, opacity: 0.04, overflow: 'hidden',
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl, padding: spacing.lg,
  },
  dmInputWrap: { padding: spacing.lg, paddingBottom: spacing.xl, backgroundColor: color.white, borderTopWidth: 1, borderTopColor: color.olive.light + '33' },
  dmInputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: color.olive.light + '1A', borderRadius: radius.full, paddingLeft: spacing.lg, paddingRight: spacing.xs, paddingVertical: spacing.xs },
  dmInput: { flex: 1, ...typography.body, color: color.charcoal, paddingVertical: spacing.sm },
  dmSendButton: { width: spacing['2xl'] + spacing.sm, height: spacing['2xl'] + spacing.sm, borderRadius: (spacing['2xl'] + spacing.sm) / 2, backgroundColor: color.olive.dark + '33', alignItems: 'center', justifyContent: 'center' },
  dmSendButtonActive: { backgroundColor: color.orange.dark },
  dmHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dmHeaderAvatar: { width: 32, height: 32, borderRadius: 16 },
  dmRow: { flexDirection: 'row' },
  dmRowMe: { justifyContent: 'flex-end' },
  dmBubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  dmBubbleMe: { backgroundColor: color.orange.dark, borderBottomRightRadius: spacing.xs },
  dmBubbleOther: { backgroundColor: color.white, borderBottomLeftRadius: spacing.xs },
  dmBubbleText: { ...typography.body, color: color.white },
  dmBubbleTime: { fontSize: 10, color: color.white + 'B3', marginTop: spacing.xs, alignSelf: 'flex-end' },

  // DM timestamps
  dmTimestamp: { alignItems: 'center', paddingVertical: spacing.lg },
  dmTimestampText: { ...typography.caption, fontSize: 12, fontWeight: '600', color: color.olive.dark + '80' },

  // Report modal
  reportOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 60, backgroundColor: color.charcoal + 'B3', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  reportCard: { width: '100%', maxWidth: 340, backgroundColor: color.beige, borderRadius: radius.xl, padding: spacing.xl, paddingTop: spacing['2xl'] },
  reportClose: { position: 'absolute', top: spacing.md, right: spacing.md, width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  reportPersonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  reportAvatar: { width: spacing['3xl'], height: spacing['3xl'], borderRadius: spacing['3xl'] / 2 },
  reportPersonName: { ...typography.bodyStrong, color: color.charcoal },
  reportPersonAge: { ...typography.caption, color: color.olive.dark + '80', marginTop: 1 },
  reportSubtitle: { ...typography.bodyStrong, color: color.charcoal, marginBottom: spacing.md },
  reportOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: color.olive.light + '33' },
  reportOptionActive: {},
  reportRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: color.olive.light, alignItems: 'center', justifyContent: 'center' },
  reportRadioActive: { borderColor: color.orange.dark },
  reportRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.orange.dark },
  reportOptionText: { ...typography.body, color: color.olive.dark },
  reportInput: { ...typography.body, color: color.charcoal, backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.olive.light + '4D', padding: spacing.md, marginTop: spacing.lg, minHeight: 80, textAlignVertical: 'top' },
  reportSubmit: { backgroundColor: color.orange.dark, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  reportSubmitText: { ...typography.button, color: color.white },
  reportDisclaimer: { ...typography.caption, fontSize: 10, color: color.olive.dark + '66', textAlign: 'center', marginTop: spacing.md },

  // Block modal extras
  blockCancel: { alignItems: 'center', paddingTop: spacing.md },
  blockCancelText: { ...typography.caption, fontWeight: '500', color: color.olive.dark + '80', textDecorationLine: 'underline' },

  // Match popup — card style like location modal
  matchOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 70, backgroundColor: color.charcoal + 'B3', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  matchCard: { width: '100%', maxWidth: 340, backgroundColor: color.orange.dark, borderRadius: radius.xl, padding: spacing.xl, paddingTop: spacing['2xl'], alignItems: 'center' },
  matchPhotos: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  matchPhoto: { width: 72, height: 72, borderRadius: 36 },
  matchHeartBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: color.orange.dark, alignItems: 'center', justifyContent: 'center', marginHorizontal: -spacing.sm, zIndex: 1 },
  matchTitle: { ...typography.h2, color: color.white, textAlign: 'center', marginBottom: spacing.sm },
  matchSubtext: { ...typography.body, color: color.white + 'CC', textAlign: 'center', marginBottom: spacing.xl, lineHeight: 22, fontSize: 14 },
  matchLater: { alignItems: 'center', paddingTop: spacing.md },
  matchLaterText: { ...typography.caption, fontWeight: '500', color: color.white + '80', textDecorationLine: 'underline' },

  spotsEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing['3xl'] * 2 },
  spotsEmptyTitle: { ...typography.body, color: color.white + '80', marginTop: spacing.md },
  spotsEmptySubtitle: { ...typography.caption, fontSize: 11, color: color.white + '4D', marginTop: spacing.xs },
});
