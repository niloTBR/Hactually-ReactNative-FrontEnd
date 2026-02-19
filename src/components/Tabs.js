/**
 * Hactually Tabs Component
 * Tab navigation with 3 style variants
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, borderRadius, fontSize, spacing } from '../theme';

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default', // 'default' | 'pills' | 'underline'
  color = 'blue',
  fullWidth = false,
  style,
}) => {
  const colorScheme = colors[color] || colors.blue;

  const renderTab = (tab, index) => {
    const isActive = activeTab === tab.key;

    const getTabStyle = () => {
      if (variant === 'pills') {
        return {
          backgroundColor: isActive ? colorScheme.default : 'transparent',
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
        };
      }
      if (variant === 'underline') {
        return {
          borderBottomWidth: 2,
          borderBottomColor: isActive ? colorScheme.default : 'transparent',
          paddingBottom: spacing[2],
          paddingHorizontal: spacing[4],
        };
      }
      // default
      return {
        backgroundColor: isActive ? colorScheme.light : 'transparent',
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2.5],
      };
    };

    const getTextColor = () => {
      if (variant === 'pills' && isActive) return colors.white;
      if (isActive) return colorScheme.default;
      return colors.brown.default;
    };

    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        activeOpacity={0.7}
        style={[
          styles.tab,
          getTabStyle(),
          fullWidth && styles.fullWidthTab,
        ]}
      >
        {tab.icon && (
          <View style={styles.tabIcon}>
            {React.cloneElement(tab.icon, {
              color: getTextColor(),
              size: 16,
            })}
          </View>
        )}
        <Text
          style={[
            styles.tabText,
            { color: getTextColor() },
            isActive && styles.activeTabText,
          ]}
        >
          {tab.label}
        </Text>
        {tab.badge !== undefined && (
          <View
            style={[
              styles.badge,
              { backgroundColor: isActive ? colorScheme.default : colors.brown.light },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isActive ? colors.white : colors.brown.default },
              ]}
            >
              {tab.badge}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const Container = fullWidth ? View : ScrollView;
  const containerProps = fullWidth
    ? {}
    : { horizontal: true, showsHorizontalScrollIndicator: false };

  return (
    <Container
      {...containerProps}
      style={[
        styles.container,
        variant === 'underline' && styles.underlineContainer,
        fullWidth && styles.fullWidthContainer,
        style,
      ]}
    >
      {tabs.map(renderTab)}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  fullWidthContainer: {
    justifyContent: 'space-between',
  },
  underlineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.brown.light,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  fullWidthTab: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 0,
  },
  tabIcon: {
    marginRight: spacing[2],
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  badge: {
    marginLeft: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Tabs;
