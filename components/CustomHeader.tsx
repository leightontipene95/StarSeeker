import { colors, spacing, typography } from "@/constants/theme";
import { cache } from "@/services/cache";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * CustomHeader Component
 *
 * Displays the app title with network connectivity monitoring.
 * Shows an offline banner when internet is unavailable, indicating
 * the app is using cached gate data with a timestamp.
 */
export default function CustomHeader() {
  // Track network connectivity status
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  // Human-readable timestamp for when cached data was last updated
  const [cacheTimestamp, setCacheTimestamp] = useState<string>("");

  useEffect(() => {
    // Subscribe to network state changes to detect online/offline status
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Load and format the cache timestamp on mount
    loadCacheTimestamp();

    // Cleanup: unsubscribe from network listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Load cache timestamp and format it as a human-readable string
   * Converts milliseconds to relative time (e.g., "5m ago", "2h ago")
   */
  const loadCacheTimestamp = async () => {
    try {
      const gates = await cache.getGates();
      if (gates) {
        // Get the timestamp from AsyncStorage
        const timestamp = await cache.getCacheTimestamp();
        if (timestamp) {
          const date = new Date(timestamp);
          const now = new Date();
          // Calculate difference in minutes
          const diffMinutes = Math.floor(
            (now.getTime() - date.getTime()) / 60000
          );

          // Format timestamp based on age
          if (diffMinutes < 1) {
            setCacheTimestamp("just now");
          } else if (diffMinutes < 60) {
            setCacheTimestamp(`${diffMinutes}m ago`);
          } else {
            const hours = Math.floor(diffMinutes / 60);
            setCacheTimestamp(`${hours}h ago`);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load cache timestamp:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StarSeeker</Text>

      {/* Show offline banner only when disconnected from internet */}
      {isConnected === false && (
        <View style={styles.offlineBanner}>
          <MaterialCommunityIcons
            name="wifi-off"
            size={14}
            color={colors.text.secondary}
          />
          <Text style={styles.offlineText}>
            Using gate data from {cacheTimestamp || "cache"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    alignItems: "center",
    backgroundColor: colors.primary.dark,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.medium,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.title.fontFamily,
    fontSize: typography.title.fontSize,
    textAlign: "center",
    textShadowColor: colors.accent.lavender,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(155, 168, 232, 0.1)",
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
