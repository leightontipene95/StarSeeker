import { borderRadius, colors, spacing } from "@/constants/theme";
import { cache } from "@/services/cache";
import { Gate } from "@/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GateCardProps {
  gate: Gate;
}

/**
 * GateCard Component
 * 
 * Displays a single hyperspace gate with its details:
 * - Gate name and code
 * - Favorite toggle button
 * - List of connected gates with distances
 */
export default function GateCard({ gate }: GateCardProps) {
  // Track whether this gate is favorited
  const [isFavorite, setIsFavorite] = useState(false);

  // Check favorite status when gate changes
  useEffect(() => {
    checkFavoriteStatus();
  }, [gate.code]);

  /**
   * Check if this gate is in the user's favorites
   */
  const checkFavoriteStatus = async () => {
    const favorites = await cache.getFavorites();
    setIsFavorite(favorites.includes(gate.code));
  };

  /**
   * Toggle favorite status for this gate
   */
  const toggleFavorite = async () => {
    const newStatus = await cache.toggleFavorite(gate.code);
    setIsFavorite(newStatus);
  };

  return (
    <View style={styles.card}>
      {/* Gate header with icon, name, code, and favorite button */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="tunnel-outline"
          size={32}
          color={colors.accent.lavender}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{gate.name}</Text>
          <Text style={styles.code}>{gate.code}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <MaterialCommunityIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? "#FF6B9D" : colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Connected gates section */}
      <View style={styles.linksContainer}>
        <Text style={styles.linksTitle}>
          Connected Gates ({gate.links.length})
        </Text>
        <View style={styles.linksList}>
          {gate.links.map((link, index) => (
            <View key={index} style={styles.linkItem}>
              <Text style={styles.linkCode}>{link.code}</Text>
              <Text style={styles.linkDistance}>{link.hu} AU</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  favoriteButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  code: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent.lavender,
    letterSpacing: 1,
  },
  linksContainer: {
    marginTop: spacing.sm,
  },
  linksTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  linksList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  linkItem: {
    backgroundColor: "rgba(155, 168, 232, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(155, 168, 232, 0.3)",
  },
  linkCode: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  linkDistance: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
});
