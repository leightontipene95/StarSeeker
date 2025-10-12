import { colors, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function CustomHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StarSeeker</Text>
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
});
