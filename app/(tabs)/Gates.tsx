import AnimatedBackground from "@/components/AnimatedBackground";
import CustomHeader from "@/components/CustomHeader";
import GateCard from "@/components/GateCard";
import { borderRadius, colors, spacing } from "@/constants/theme";
import { useGates } from "@/contexts/GatesContext";
import { cache } from "@/services/cache";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Gates Screen
 * 
 * Displays a searchable, filterable list of hyperspace gates.
 * Features include:
 * - Search by gate name or code
 * - Filter to show only favorited gates
 * - Real-time updates when favorites change
 */
export default function Gates() {
  const { gates, loading, error } = useGates();
  // Filtered list of gates based on search and favorites
  const [filteredGates, setFilteredGates] = useState(gates);
  // Current search query
  const [searchQuery, setSearchQuery] = useState("");
  // Whether to show only favorited gates
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // List of favorite gate codes
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Reapply filters whenever search, gates, or favorites change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, gates, showFavoritesOnly, favorites]);

  /**
   * Load favorite gate codes from cache
   */
  const loadFavorites = async () => {
    const favs = await cache.getFavorites();
    setFavorites(favs);
  };

  /**
   * Apply search and favorites filters to the gates list
   * Filters are applied in order: favorites first, then search
   */
  const applyFilters = () => {
    let filtered = gates;

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter((gate) => favorites.includes(gate.code));
    }

    // Apply search filter (matches gate name or code)
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (gate) =>
          gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gate.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGates(filtered);
  };

  /**
   * Toggle the favorites-only filter and reload favorites
   */
  const toggleFavoritesFilter = async () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    // Reload favorites to ensure we have the latest
    await loadFavorites();
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomHeader />

      {/* Search and filter controls */}
      <View style={styles.searchRow}>
        {/* Search input with clear button */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search gates..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.text.tertiary}
              style={styles.clearIcon}
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>

        {/* Favorites filter toggle button */}
        <TouchableOpacity
          style={[
            styles.favoriteFilterButton,
            showFavoritesOnly && styles.favoriteFilterButtonActive,
          ]}
          onPress={toggleFavoritesFilter}
        >
          <MaterialCommunityIcons
            name={showFavoritesOnly ? "heart" : "heart-outline"}
            size={28}
            color={showFavoritesOnly ? "#FF6B9D" : colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Content area: loading, error, or gates list */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.accent.lavender} />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGates}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <GateCard gate={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  clearIcon: {
    marginLeft: spacing.sm,
  },
  favoriteFilterButton: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    borderRadius: borderRadius.md,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteFilterButtonActive: {
    backgroundColor: "rgba(255, 107, 157, 0.15)",
    borderColor: "#FF6B9D",
    borderWidth: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
  },
});
