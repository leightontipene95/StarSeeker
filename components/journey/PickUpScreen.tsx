import Button from "@/components/Button";
import { borderRadius, colors, spacing } from "@/constants/theme";
import { api } from "@/services/api";
import { TransportResponse } from "@/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PickUpScreen() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState("");
  const [parkingDays, setParkingDays] = useState("");
  const [transportData, setTransportData] = useState<TransportResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTransport = async () => {
    const dist = parseFloat(distance);
    const pass = parseInt(passengers);
    const park = parseInt(parkingDays);

    if (isNaN(dist) || isNaN(pass) || isNaN(park)) {
      setError("Please enter valid numbers");
      return;
    }

    if (dist <= 0 || pass <= 0 || park < 0) {
      setError(
        "Distance and passengers must be positive, parking cannot be negative"
      );
      return;
    }

    if (pass > 5) {
      setError("Maximum 5 passengers allowed");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getTransport(dist, pass, park);
      setTransportData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate transport"
      );
      console.error("Transport calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = transportData
    ? transportData.journeyCost + transportData.parkingFee
    : 0;

  const canCalculate = distance && passengers && parkingDays && !loading;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>PickUp</Text>
      <Text style={styles.subtitle}>Calculate the cost of pick up</Text>

      {/* Transport Result */}
      {transportData && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <MaterialCommunityIcons
              name="rocket"
              size={24}
              color={colors.accent.lavender}
            />
            <Text style={styles.resultTitle}>Recommended Transport</Text>
          </View>

          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleName}>
              {transportData.recommendedTransport.name}
            </Text>
            <Text style={styles.vehicleCost}>
              {totalCost.toFixed(2)} {transportData.currency}
            </Text>
            <Text style={styles.vehicleCapacity}>
              Capacity: {transportData.recommendedTransport.capacity} passengers
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Journey Cost</Text>
              <Text style={styles.detailValue}>
                {transportData.journeyCost.toFixed(2)} {transportData.currency}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Parking Fee</Text>
              <Text style={styles.detailValue}>
                {transportData.parkingFee.toFixed(2)} {transportData.currency}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rate/AU</Text>
              <Text style={styles.detailValue}>
                {transportData.recommendedTransport.ratePerAu.toFixed(2)}{" "}
                {transportData.currency}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.lavender} />
          <Text style={styles.loadingText}>Calculating transport...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Distance (AU)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 150"
          placeholderTextColor={colors.text.tertiary}
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Number of Passengers (max 5)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 4"
          placeholderTextColor={colors.text.tertiary}
          value={passengers}
          onChangeText={setPassengers}
          keyboardType="number-pad"
          maxLength={1}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Parking Days</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 7"
          placeholderTextColor={colors.text.tertiary}
          value={parkingDays}
          onChangeText={setParkingDays}
          keyboardType="number-pad"
        />
      </View>

      {/* Calculate Button */}
      <Button
        title="Calculate Transport"
        onPress={calculateTransport}
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
  resultContainer: {
    marginBottom: spacing.xl,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  vehicleCard: {
    backgroundColor: "rgba(155, 168, 232, 0.25)",
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.accent.lavender,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  vehicleCost: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.accent.lavender,
  },
  vehicleCapacity: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
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
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  calculateButton: {
    marginTop: spacing.lg,
    alignSelf: "center",
  },
});
