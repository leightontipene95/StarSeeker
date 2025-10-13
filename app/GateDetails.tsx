import AnimatedBackground from "@/components/AnimatedBackground";
import { borderRadius, colors, spacing } from "@/constants/theme";
import { api } from "@/services/api";
import { cache } from "@/services/cache";
import { Gate } from "@/types/api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/**
 * GateDetails Screen
 *
 * Displays detailed information about a specific hyperspace gate:
 * - Gate name, code, and metadata
 * - Favorite toggle
 * - List of all connected gates with distances
 */
export default function GateDetails() {
  const router = useRouter();
  const { gateCode } = useLocalSearchParams<{ gateCode: string }>();

  const [gate, setGate] = useState<Gate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation values
  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const linksAnim = useRef(new Animated.Value(0)).current;
  const linksSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (gateCode) {
      loadGateDetails();
      checkFavoriteStatus();
    }
  }, [gateCode]);

  useEffect(() => {
    if (gate && !loading) {
      // Reset animations to initial state
      cardAnim.setValue(0);
      cardSlide.setValue(30);
      linksAnim.setValue(0);
      linksSlide.setValue(30);

      // Animate card entrance
      Animated.parallel([
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate links section
      Animated.parallel([
        Animated.timing(linksAnim, {
          toValue: 1,
          duration: 600,
          delay: 250,
          useNativeDriver: true,
        }),
        Animated.timing(linksSlide, {
          toValue: 0,
          duration: 600,
          delay: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gate]);

  const loadGateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGate(gateCode);
      setGate(data);
    } catch (err) {
      setError("Failed to load gate details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    const favorites = await cache.getFavorites();
    setIsFavorite(favorites.includes(gateCode));
  };

  const toggleFavorite = async () => {
    const newStatus = await cache.toggleFavorite(gateCode);
    setIsFavorite(newStatus);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AnimatedBackground />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.accent.lavender} />
        </View>
      </View>
    );
  }

  if (error || !gate) {
    return (
      <View style={styles.container}>
        <AnimatedBackground />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || "Gate not found"}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gate Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gate info card */}
        <Animated.View
          style={[
            styles.card,
            { opacity: cardAnim, transform: [{ translateY: cardSlide }] },
          ]}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="tunnel-outline"
              size={48}
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
                size={32}
                color={isFavorite ? "#FF6B9D" : colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Connected gates section */}
        <Animated.View
          style={[
            styles.linksSection,
            { opacity: linksAnim, transform: [{ translateY: linksSlide }] },
          ]}
        >
          <Text style={styles.sectionTitle}>
            Connected Gates ({gate.links.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Direct hyperspace connections from {gate.name}
          </Text>

          <View style={styles.linksList}>
            {gate.links.map((link, index) => (
              <View key={index} style={styles.linkCard}>
                <View style={styles.linkHeader}>
                  <MaterialCommunityIcons
                    name="gate"
                    size={24}
                    color={colors.accent.lavender}
                  />
                  <Text style={styles.linkCode}>{link.code}</Text>
                </View>
                <View style={styles.linkDistance}>
                  <MaterialCommunityIcons
                    name="map-marker-distance"
                    size={16}
                    color={colors.text.tertiary}
                  />
                  <Text style={styles.linkDistanceText}>{link.hu} AU</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary.dark,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 168, 232, 0.2)",
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  card: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  code: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accent.lavender,
    letterSpacing: 1,
  },

  linksSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  linksList: {
    gap: spacing.md,
  },
  linkCard: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(155, 168, 232, 0.3)",
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  linkCode: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 1,
  },
  linkDistance: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  linkDistanceText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.accent.lavender,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary.dark,
  },
});
