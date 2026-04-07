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
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { color, spacing, radius, typography } from '../theme';
import { LogoMark, Button, BottomNav, GroupChatIcon, ShimmerText } from '../components';
import { useVenueStore } from '../store/venueStore';

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

// ─── PEOPLE GRID (single swipe controls all rows, alternating directions, infinite) ───
const CELL_SIZE = 140;
const CELL_GAP = 16;
const NUM_ROWS = 3;
const ROW_OFFSET = CELL_SIZE / 2 + CELL_GAP / 2;
const ITEM_WIDTH = CELL_SIZE + CELL_GAP;

// Circular progress ring for "just joined" people
function JoinRing({ progress }) {
  const size = CELL_SIZE + 8;
  const strokeWidth = 3;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  return (
    <View style={{ position: 'absolute', top: -4, left: -4, width: size, height: size }} pointerEvents="none">
      <Svg width={size} height={size}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color.blue.light + '40'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color.blue.light}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

// Orange ring border for spotted people
function SpotRing() {
  const size = CELL_SIZE + 6;
  const strokeWidth = 3;
  const r = (size - strokeWidth) / 2;

  return (
    <View style={{ position: 'absolute', top: -3, left: -3, width: size, height: size }} pointerEvents="none">
      <Svg width={size} height={size}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color.orange.dark}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const JOIN_DURATION = 15000; // 15 seconds visible in full color

function PeopleGrid({ people, onPersonClick, spotted = [], requests = [], matched = [], joining = {}, leaving = {} }) {
  const [scrollX, setScrollX] = useState(0);
  const LEAVE_DURATION = 2000;

  // Update join progress for animation
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const tick = setInterval(() => forceUpdate(n => n + 1), 100);
    return () => clearInterval(tick);
  }, []);
  // Center offset so content starts in the middle of the repeated strip
  const centerOffset = -(people.length * 4 * ITEM_WIDTH);
  const dragRef = useRef({ isDragging: false, startX: 0, startScroll: 0 });
  const velocityRef = useRef(0);
  const lastMoveRef = useRef({ x: 0, time: 0 });
  const animRef = useRef(null);

  // Repeat people enough for seamless looping
  const repeatCount = 10;
  const getRowPeople = (rowIndex) => {
    const off = rowIndex * Math.ceil(people.length / NUM_ROWS);
    const rowPeople = people.slice(off).concat(people.slice(0, off));
    const repeated = [];
    for (let i = 0; i < repeatCount; i++) repeated.push(...rowPeople);
    return repeated;
  };

  // Wrap scroll to keep it in a reasonable range
  const segment = people.length * ITEM_WIDTH;
  const wrapScroll = (val) => {
    while (val > segment * 2) val -= segment;
    while (val < -segment * 2) val += segment;
    return val;
  };

  // Momentum animation
  const AUTO_SPEED = 0.3; // slow constant drift
  const isInteracting = useRef(false);
  const autoDirection = useRef(1); // 1 = right, -1 = left
  const wheelTimeout = useRef(null);

  // Momentum — decays then hands off to auto-scroll in same direction
  const startMomentum = (vel) => {
    cancelAnimationFrame(animRef.current);
    // Remember swipe direction for auto-scroll
    if (Math.abs(vel) > 0.5) autoDirection.current = vel > 0 ? 1 : -1;
    let v = vel;
    const tick = () => {
      v *= 0.96;
      if (Math.abs(v) < AUTO_SPEED) {
        isInteracting.current = false;
        return;
      }
      setScrollX(prev => wrapScroll(prev + v));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  // Slow constant auto-scroll in last swipe direction
  useEffect(() => {
    const autoTick = () => {
      if (!isInteracting.current) {
        setScrollX(prev => wrapScroll(prev + AUTO_SPEED * autoDirection.current));
      }
      autoAnimRef.current = requestAnimationFrame(autoTick);
    };
    const autoAnimRef = { current: requestAnimationFrame(autoTick) };
    return () => cancelAnimationFrame(autoAnimRef.current);
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.isDragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const diff = x - dragRef.current.startX;
      const now = Date.now();
      velocityRef.current = (x - lastMoveRef.current.x) / Math.max(1, now - lastMoveRef.current.time) * 16;
      lastMoveRef.current = { x, time: now };
      setScrollX(wrapScroll(dragRef.current.startScroll + diff));
    };
    const onUp = () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;
      startMomentum(velocityRef.current);
    };
    // Trackpad swipe — accumulate into velocity then momentum on stop
    const onWheel = (e) => {
      e.preventDefault();
      isInteracting.current = true;
      cancelAnimationFrame(animRef.current);
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setScrollX(prev => wrapScroll(prev - delta));
      velocityRef.current = -delta;
      // After trackpad stops firing, kick off momentum
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        startMomentum(velocityRef.current);
      }, 100);
    };
    const el = containerRef.current;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    if (el) el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      if (el) el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimeout.current);
    };
  }, []);

  const handleDown = (e) => {
    isInteracting.current = true;
    cancelAnimationFrame(animRef.current);
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current = { isDragging: true, startX: x, startScroll: scrollX };
    lastMoveRef.current = { x, time: Date.now() };
    velocityRef.current = 0;
  };

  const renderCell = (person, index, rowIndex) => {
    const pid = person.id;
    const isMatch = matched.includes(pid);
    const isIncoming = requests.includes(pid) && !isMatch;
    const isOutgoing = spotted.includes(pid) && !isMatch;
    const joinState = joining[pid];
    const leaveState = leaving[pid];
    const isFirstInstance = index < people.length;
    const isJoining = !!joinState && isFirstInstance && rowIndex === 1;
    const isLeaving = !!leaveState && isFirstInstance && rowIndex === 1;
    const isHighlighted = isOutgoing || isIncoming || isMatch || isJoining;

    // Join: progress ring fills over JOIN_DURATION, photo goes full color
    const joinProgress = isJoining ? Math.min(1, (Date.now() - joinState.startTime) / JOIN_DURATION) : 0;

    // Leave: fade from 0.5 → 0 over LEAVE_DURATION
    const leaveElapsed = isLeaving ? (Date.now() - leaveState.startTime) / LEAVE_DURATION : 0;
    const leaveOpacity = isLeaving ? Math.max(0, 0.5 * (1 - leaveElapsed)) : null;

    // Default 0.5, joining = 1, leaving = fading to 0
    const imgOpacity = isLeaving ? leaveOpacity : (isHighlighted ? 1 : 0.5);

    return (
      <View key={`${rowIndex}-${index}`} style={s.gridCellWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => !dragRef.current.isDragging && onPersonClick(person, index % people.length)}
          style={s.gridCell}
        >
          <Image source={person.avatar} style={[s.gridImage, { opacity: imgOpacity }]} />
        </TouchableOpacity>
        {isJoining && <JoinRing progress={joinProgress} />}
        {isOutgoing && (
          <View style={[s.statusBadge, { backgroundColor: color.blue.dark, overflow: 'hidden' }]}>
            <style>{`
              @keyframes arrowUpRight {
                0% { transform: translate(-10px, 10px); opacity: 0; }
                30% { opacity: 1; }
                70% { opacity: 1; }
                100% { transform: translate(10px, -10px); opacity: 0; }
              }
            `}</style>
            <div style={{ animation: 'arrowUpRight 1.5s ease-in-out infinite' }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M7 17L17 7M17 7H7M17 7V17" stroke={color.beige} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </div>
          </View>
        )}
        {isIncoming && (
          <View style={[s.statusBadge, { backgroundColor: color.green.dark, overflow: 'hidden' }]}>
            <style>{`
              @keyframes arrowDownLeft {
                0% { transform: translate(10px, -10px); opacity: 0; }
                30% { opacity: 1; }
                70% { opacity: 1; }
                100% { transform: translate(-10px, 10px); opacity: 0; }
              }
            `}</style>
            <div style={{ animation: 'arrowDownLeft 1.5s ease-in-out infinite' }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M17 7L7 17M7 17H17M7 17V7" stroke={color.beige} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </div>
          </View>
        )}
        {isMatch && (
          <View style={[s.statusBadge, { backgroundColor: color.orange.dark }]}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color.beige} />
            </Svg>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      ref={containerRef}
      style={[s.gridOuter, { cursor: 'grab', userSelect: 'none' }]}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      {Array.from({ length: NUM_ROWS }).map((_, rowIndex) => {
        const direction = rowIndex % 2 === 0 ? 1 : -1;
        const rowScroll = centerOffset + scrollX * direction;
        const offset = rowIndex % 2 === 1 ? ROW_OFFSET : 0;
        return (
          <View key={rowIndex} style={[s.gridRowClip]}>
            <View style={[s.gridRow, { transform: [{ translateX: rowScroll + offset }] }]}>
              {getRowPeople(rowIndex).map((person, i) => renderCell(person, i, rowIndex))}
            </View>
          </View>
        );
      })}
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
  const venue = route?.params?.venue || { id: '1', name: 'White Dubai', area: 'Meydan', image: require('../../assets/venues/1.jpg') };
  const { checkIn, checkOut } = useVenueStore();

  useEffect(() => {
    checkIn(venue);
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [spotted, setSpotted] = useState([]);             // outgoing (you spotted them)
  const [requests, setRequests] = useState([1, 5]); // incoming (they spotted you)
  const [matched, setMatched] = useState([]);             // mutual matches
  const [openPanel, setOpenPanel] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
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

  // Join/leave animations — managed here, passed to PeopleGrid
  const [gridJoining, setGridJoining] = useState({});
  const [gridLeaving, setGridLeaving] = useState({});
  const joinEventCount = useRef(0);
  const nextJoinEventAt = useRef(Date.now() + 3000);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now < nextJoinEventAt.current) return;

      const isJoin = joinEventCount.current % 2 === 0;
      joinEventCount.current++;
      const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];

      if (isJoin) {
        setGridJoining({ [person.id]: { startTime: now } });
        setTimeout(() => setGridJoining({}), JOIN_DURATION);
        nextJoinEventAt.current = now + JOIN_DURATION + 5000 + Math.random() * 10000;
      } else {
        setGridLeaving({ [person.id]: { startTime: now } });
        setTimeout(() => setGridLeaving({}), 2000);
        nextJoinEventAt.current = now + 2000 + 5000 + Math.random() * 10000;
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

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

  // Blinking notification dot (chat activity)
  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 600, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
      ])
    );
    anim.start();
    return () => anim.stop();
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

  const [expandProgress, setExpandProgress] = useState(0);
  const expandTimerRef = useRef(null);

  const handleProfileClick = (person) => {
    setFocusedPerson(person);
    setIsFocusMode(true);
    setExpandProgress(0);
    // Animate from 0 to 1 over 400ms
    requestAnimationFrame(() => setExpandProgress(1));
  };

  const handleCloseFocus = () => {
    setExpandProgress(0);
    setTimeout(() => {
      setIsFocusMode(false);
      setFocusedPerson(null);
    }, 300);
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
        <View style={[
          s.focusOverlay,
          {
            clipPath: expandProgress === 1
              ? 'circle(150% at 50% 50%)'
              : `circle(${CELL_SIZE / 2}px at 50% 50%)`,
            WebkitClipPath: expandProgress === 1
              ? 'circle(150% at 50% 50%)'
              : `circle(${CELL_SIZE / 2}px at 50% 50%)`,
            transition: 'clip-path 0.4s ease-out, -webkit-clip-path 0.4s ease-out',
          },
        ]}>
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
            <Text style={s.focusName}>{focusedPerson.name}</Text>
            <Text style={s.focusAge}>{focusedPerson.age}, "{focusedPerson.bio}"</Text>
            {isActiveIncoming && (
              <Text style={s.focusContext}>Spotted you at {focusedPerson.venue || 'this venue'}</Text>
            )}
            {isActiveMatched && (
              <Text style={s.focusContext}>Matched at {focusedPerson.venue || 'this venue'}</Text>
            )}

            <View style={{ marginTop: spacing.lg, width: '100%', gap: spacing.sm }}>
              {/* STATE: Matched — message button */}
              {isActiveMatched && (
                <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleCloseFocus(); setOpenPanel('spots'); openDm(focusedPerson); }}>
                  Message {focusedPerson.name}
                </Button>
              )}

              {/* STATE: Incoming request — spot back + not interested */}
              {isActiveIncoming && (
                <>
                  <Button variant="solid" color="orange" size="lg" fullWidth onPress={() => { handleAcceptMatch(focusedPerson.id); handleCloseFocus(); }}>
                    Spot Back
                  </Button>
                  <TouchableOpacity
                    style={s.notInterestedBtn}
                    onPress={() => { setRequests(requests.filter(r => r !== focusedPerson.id)); handleCloseFocus(); }}
                  >
                    <Text style={s.notInterestedText}>Not interested?</Text>
                  </TouchableOpacity>
                </>
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
            </View>

            <View style={s.focusSafetyRow}>
              <Text style={s.focusSafetyDisclaimer}>
                Your safety matters. If something feels off, let us know.
              </Text>
              <View style={s.focusSafetyActions}>
                <TouchableOpacity style={s.focusSafetyBtn} onPress={handleCloseFocus}>
                  <EyeOff size={16} color={color.white + 'CC'} />
                  <Text style={s.focusSafetyLabel}>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.focusSafetyBtn} onPress={() => setShowBlock(true)}>
                  <Ban size={16} color={color.white + 'CC'} />
                  <Text style={s.focusSafetyLabel}>Block</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.focusSafetyBtn, { borderColor: color.error.light + '66' }]} onPress={() => setShowReport(true)}>
                  <AlertTriangle size={16} color={color.error.light} />
                  <Text style={[s.focusSafetyLabel, { color: color.error.light }]}>Report</Text>
                </TouchableOpacity>
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
            <TouchableOpacity style={s.leaveButton} onPress={() => setShowLeaveModal(true)}>
              <Text style={s.leaveText}>Leave</Text>
              <LogOut size={12} color={color.olive.dark} />
            </TouchableOpacity>
          </View>
          {/* Chat button */}
          <TouchableOpacity
            style={s.heartButton}
            onPress={() => setOpenPanel(openPanel === 'chat' ? null : 'chat')}
            activeOpacity={0.9}
          >
            <GroupChatIcon size={22} color={color.olive.dark} />
            <Animated.View style={[s.notificationDot, { opacity: blinkAnim }]} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ─── People Grid ─── */}
      {!isFocusMode && (
        <View style={s.gridWrapper}>
          <PeopleGrid
            people={PEOPLE}
            onPersonClick={(person) => handleProfileClick(person)}
            spotted={spotted}
            requests={requests}
            matched={matched}
            joining={gridJoining}
            leaving={gridLeaving}
          />
        </View>
      )}

      {/* ─── Bottom Nav ─── */}
      {!isFocusMode && openPanel === null && (
        <View style={s.bottomNavWrapper}>
          <SafeAreaView edges={['bottom']}>
            <BottomNav
              activeTab="venue"
              checkedInVenue={venue}
              onTabChange={(tab) => {
                if (tab === 'nearby') navigation.navigate('Home');
                else if (tab === 'spots') navigation.navigate('Spots');
                else if (tab === 'likes') navigation.navigate('Matches');
                else if (tab === 'profile') navigation.navigate('Profile');
              }}
            />
          </SafeAreaView>
        </View>
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

            <Text style={s.matchTitle}>It's hactually happening!</Text>
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

      {/* ─── LEAVE MODAL ─── */}
      {showLeaveModal && (
        <View style={s.leaveOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowLeaveModal(false)} />
          <View style={s.leaveModal}>
            <View style={s.leaveModalHandle} />
            <Text style={s.leaveModalTitle}>Are you sure you want to leave?</Text>
            <Text style={s.leaveModalBody}>
              You can check back in anytime, but you'll lose your active credit for this session.
            </Text>
            <View style={{ marginTop: spacing.xl }}>
              <Button
                variant="checkin"
                color="orange"
                size="lg"
                fullWidth
                onPress={() => { setShowLeaveModal(false); checkOut(); navigation.goBack(); }}
              >
                Slide to Leave
              </Button>
            </View>
            <TouchableOpacity style={s.leaveModalCancel} onPress={() => setShowLeaveModal(false)} activeOpacity={0.7}>
              <Text style={s.leaveModalCancelText}>Stay checked in</Text>
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

  // Bottom nav
  bottomNavWrapper: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.xl, paddingBottom: spacing.sm, zIndex: 20,
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
  leaveText: { ...typography.caption, fontSize: 12, fontWeight: '700', color: color.olive.dark },
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
  gridWrapper: { flex: 1, zIndex: 0, justifyContent: 'center' },
  gridOuter: { gap: CELL_GAP, overflow: 'hidden' },
  gridRowClip: { overflow: 'hidden' },
  gridRow: { flexDirection: 'row', gap: CELL_GAP },
  gridCellWrapper: { width: CELL_SIZE, height: CELL_SIZE },
  gridCell: { width: CELL_SIZE, height: CELL_SIZE, borderRadius: CELL_SIZE / 2, overflow: 'hidden', borderWidth: 0 },
  gridImage: { width: '100%', height: '100%' },
  statusBadge: { position: 'absolute', top: 4, right: 4, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.beige },
  colorShade: { ...StyleSheet.absoluteFillObject, borderRadius: CELL_SIZE / 2 },
  matchGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 3,
    borderColor: color.green.light,
  },
  matchShimmer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CELL_SIZE / 2,
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
  pendingText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: color.white,
    textAlign: 'center',
  },
  pendingLabel: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontWeight: '600',
    color: color.white,
    textAlign: 'center',
    lineHeight: 18,
  },
  outgoingGlow: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: (CELL_SIZE + 8) / 2,
    borderWidth: 2,
    borderColor: color.blue.dark,
    boxShadow: `0 0 16px ${color.blue.dark}AA, 0 0 32px ${color.blue.dark}66`,
  },
  incomingGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: CELL_SIZE / 2,
    borderWidth: 3,
    borderColor: color.orange.dark,
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
  focusContext: { ...typography.body, color: color.white, marginTop: spacing.xs },
  spottedYouLabel: { ...typography.caption, fontSize: 12, fontWeight: '700', color: color.green.light, letterSpacing: 1, textTransform: 'uppercase', textShadowColor: color.charcoal + '60', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  focusName: { ...typography.h1, color: color.white },
  focusAge: { ...typography.body, color: color.beige, marginTop: spacing.xs },
  focusInterests: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  focusInterestTag: { backgroundColor: color.white + '26', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  focusInterestText: { ...typography.caption, fontSize: 12, color: color.white + 'CC' },
  focusSafetyRow: { marginTop: spacing.lg, gap: spacing.sm },
  focusSafetyDisclaimer: { ...typography.caption, fontSize: 10, color: color.white + '4D', textAlign: 'center', lineHeight: 14 },
  focusSafetyActions: { flexDirection: 'row', gap: spacing.sm },
  focusSafetyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: color.white + '26' },
  focusSafetyLabel: { ...typography.body, color: color.white + 'CC' },
  notInterestedBtn: {
    width: '100%', height: spacing['3xl'], borderRadius: radius.full,
    backgroundColor: color.white + '26', alignItems: 'center', justifyContent: 'center',
  },
  notInterestedText: { ...typography.caption, fontSize: 14, fontWeight: '500', color: color.white + 'CC' },
  waitingButton: {
    width: '100%', height: spacing['3xl'], borderRadius: radius.full,
    backgroundColor: color.white + '33', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  waitingContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  waitingSpinnerCircle: { width: spacing['2xl'], height: spacing['2xl'], borderRadius: spacing.lg, backgroundColor: color.white + '26', alignItems: 'center', justifyContent: 'center' },
  waitingText: { ...typography.caption, fontSize: 12, fontWeight: '500', color: color.white + 'CC' },

  // Chat chip (collapsed)
  chatChip: { position: 'absolute', bottom: 80, left: spacing.lg, right: spacing.lg, zIndex: 50 },
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
  chatBubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  chatBubbleOther: { backgroundColor: color.white + '1A', borderBottomLeftRadius: 0 },
  chatBubbleMe: { backgroundColor: color.orange.dark + 'CC', borderBottomRightRadius: 0 },
  chatBubbleUser: { fontSize: 12, fontWeight: '600', color: color.orange.dark, marginBottom: 2 },
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
  spotAvatarRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  spotAvatar: { width: 48, height: 48, borderRadius: 24 },
  spotInfo: { flex: 1 },
  spotNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  spotName: { ...typography.body, fontWeight: '600', color: color.white },
  spottedYouBadge: { fontSize: 10, fontWeight: '700', color: color.green.light, letterSpacing: 1, textTransform: 'uppercase' },
  spotSubtext: { fontSize: 12, color: color.white + '66', marginTop: 2 },
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
  dmViewProfile: { ...typography.body, fontSize: 14, fontWeight: '500', color: color.olive.dark },
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
  spotsEmptySubtitle: { ...typography.caption, fontSize: 12, color: color.white + '4D', marginTop: spacing.xs },

  // Leave modal
  leaveOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 80, backgroundColor: color.charcoal + 'B3', justifyContent: 'flex-end', padding: spacing.xl },
  leaveModal: { backgroundColor: color.beige, borderRadius: radius.xl, padding: spacing.xl, paddingTop: spacing.lg },
  leaveModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: color.olive.light, alignSelf: 'center', marginBottom: spacing.lg },
  leaveModalTitle: { ...typography.h3, color: color.charcoal, textAlign: 'center', marginBottom: spacing.sm },
  leaveModalBody: { ...typography.body, color: color.olive.dark, textAlign: 'center', lineHeight: 22, fontSize: 14 },
  leaveModalCancel: { alignItems: 'center', paddingTop: spacing.lg },
  leaveModalCancelText: { ...typography.caption, color: color.olive.dark + '80', textDecorationLine: 'underline' },
});
