import AnimatedBackground from '@/components/AnimatedBackground';
import CustomHeader from '@/components/CustomHeader';
import PickUpScreen from '@/components/journey/PickUpScreen';
import RoutesScreen from '@/components/journey/RoutesScreen';
import { colors, spacing } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'routes' | 'pickup';

export default function Journey() {
  const [activeTab, setActiveTab] = useState<TabType>('routes');

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomHeader />
      
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => setActiveTab('routes')}
        >
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText]}>
            Routes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pickup' && styles.activeTab]}
          onPress={() => setActiveTab('pickup')}
        >
          <Text style={[styles.tabText, activeTab === 'pickup' && styles.activeTabText]}>
            PickUp
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'routes' ? <RoutesScreen /> : <PickUpScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.accent.lavender,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.accent.lavender,
  },
  content: {
    flex: 1,
  },
});
