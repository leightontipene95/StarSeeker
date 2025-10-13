import Button from "@/components/Button";
import GateSelector from "@/components/GateSelector";
import RouteLeg from "@/components/RouteLeg";
import { colors, spacing } from "@/constants/theme";
import { useGates } from "@/contexts/GatesContext";
import { api } from "@/services/api";
import { Gate, Route } from "@/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RoutesScreen() {
  const { gates } = useGates();
  const [departureGate, setDepartureGate] = useState<Gate | null>(null);
  const [destinationGate, setDestinationGate] = useState<Gate | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async () => {
    if (!departureGate || !destinationGate) return;

    try {
      setLoading(true);
      setError(null);
      const routeData = await api.getRoute(
        departureGate.code,
        destinationGate.code
      );
      setRoute(routeData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate route"
      );
      console.error("Route calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGateName = (code: string) => {
    return gates.find((g) => g.code === code)?.name || code;
  };

  const canCalculate = departureGate && destinationGate && !loading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Routes</Text>
      <Text style={styles.subtitle}>Plan your journey through the stars</Text>

      {/* Route Visualization */}
      {route && (
        <View style={styles.routeContainer}>
          <View style={styles.routeHeader}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={24}
              color={colors.accent.lavender}
            />
            <Text style={styles.routeTitle}>Your Route</Text>
            <Text style={styles.routeCost}>{route.totalCost} AU</Text>
          </View>

          <View style={styles.routePath}>
            {route.route.map((gateCode, index) => (
              <View key={`${gateCode}-${index}`} style={styles.legContainer}>
                <RouteLeg
                  gateCode={gateCode}
                  gateName={getGateName(gateCode)}
                />
                {index < route.route.length - 1 && (
                  <View style={styles.connector}>
                    <MaterialCommunityIcons
                      name="arrow-down"
                      size={20}
                      color={colors.accent.lavender}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.lavender} />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Spacer to push selectors to bottom */}
      <View style={styles.spacer} />

      {/* Gate Selectors */}
      <GateSelector
        label="Departure Gate"
        selectedGate={departureGate}
        onSelectGate={setDepartureGate}
      />

      <GateSelector
        label="Destination Gate"
        selectedGate={destinationGate}
        onSelectGate={setDestinationGate}
        excludeGateCode={departureGate?.code}
      />

      {/* Calculate Button */}
      <Button
        title="Calculate Route"
        onPress={calculateRoute}
        disabled={!canCalculate}
        loading={loading}
        style={styles.calculateButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  routeContainer: {
    marginBottom: spacing.xl,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  routeCost: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent.lavender,
  },
  routePath: {
    alignItems: "center",
  },
  legContainer: {
    alignItems: "center",
    width: "100%",
  },
  connector: {
    paddingVertical: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: spacing.lg,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    textAlign: "center",
  },
  spacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
  calculateButton: {
    marginTop: spacing.lg,
    alignSelf: "center",
  },
});
