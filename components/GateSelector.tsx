import { borderRadius, colors, spacing } from "@/constants/theme";
import { useGates } from "@/contexts/GatesContext";
import { Gate } from "@/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface GateSelectorProps {
  label: string;
  selectedGate: Gate | null;
  onSelectGate: (gate: Gate) => void;
  excludeGateCode?: string;
}

/**
 * GateSelector Component
 * 
 * Horizontal scrollable list of gates for selection.
 * Used in journey planning to select departure/arrival gates.
 * 
 * Features:
 * - Horizontal scroll for easy browsing
 * - Visual indication of selected gate
 * - Optional exclusion of specific gate (e.g., exclude departure when selecting arrival)
 */
export default function GateSelector({
  label,
  selectedGate,
  onSelectGate,
  excludeGateCode,
}: GateSelectorProps) {
  const { gates, loading, error } = useGates();

  // Filter out excluded gate if specified (useful for preventing same departure/arrival)
  const filteredGates = excludeGateCode
    ? gates.filter((gate) => gate.code !== excludeGateCode)
    : gates;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Loading state */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent.lavender} />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        // Horizontal scrollable list of gates
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredGates.map((gate) => (
            <TouchableOpacity
              key={gate.code}
              onPress={() => onSelectGate(gate)}
              style={styles.gateWrapper}
            >
              <View
                style={[
                  styles.gateItem,
                  selectedGate?.code === gate.code && styles.selectedGateItem,
                ]}
              >
                <MaterialCommunityIcons
                  name="tunnel-outline"
                  size={24}
                  color={
                    selectedGate?.code === gate.code
                      ? colors.accent.lavender
                      : colors.text.secondary
                  }
                />
                <View style={styles.gateInfo}>
                  <Text style={styles.gateName}>{gate.name}</Text>
                  <Text style={styles.gateCode}>{gate.code}</Text>
                </View>
                {/* Show checkmark on selected gate */}
                {selectedGate?.code === gate.code && (
                  <View style={styles.checkmark}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color={colors.accent.lavender}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  scrollContent: {
    paddingRight: spacing.md,
    gap: spacing.sm,
  },
  gateWrapper: {
    marginRight: spacing.sm,
  },
  gateItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.md,
    width: 160,
    position: "relative",
  },
  selectedGateItem: {
    backgroundColor: "rgba(155, 168, 232, 0.25)",
    borderColor: colors.accent.lavender,
    borderWidth: 2,
  },
  gateInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  gateName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  gateCode: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent.lavender,
    letterSpacing: 0.5,
  },
  checkmark: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  error: {
    fontSize: 14,
    color: "#FF6B6B",
    padding: spacing.md,
  },
});
