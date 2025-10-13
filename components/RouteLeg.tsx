import { borderRadius, colors, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface RouteLegProps {
  gateCode: string;
  gateName: string;
}

export default function RouteLeg({ gateCode, gateName }: RouteLegProps) {
  return (
    <View style={styles.leg}>
      <MaterialCommunityIcons
        name="tunnel-outline"
        size={24}
        color={colors.accent.lavender}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{gateName}</Text>
        <Text style={styles.code}>{gateCode}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leg: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.md,
    width: 160,
  },
  info: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  code: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent.lavender,
    letterSpacing: 0.5,
  },
});
