import { borderRadius, colors, spacing } from "@/constants/theme";
import { Gate } from "@/types/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface GateCardProps {
  gate: Gate;
}

export default function GateCard({ gate }: GateCardProps) {
  return (
    <View style={styles.card}>
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
      </View>

      <View style={styles.linksContainer}>
        <Text style={styles.linksTitle}>
          Connected Gates ({gate.links.length})
        </Text>
        <View style={styles.linksList}>
          {gate.links.map((link, index) => (
            <View key={index} style={styles.linkItem}>
              <Text style={styles.linkCode}>{link.code}</Text>
              <Text style={styles.linkDistance}>{link.hu} HU</Text>
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
