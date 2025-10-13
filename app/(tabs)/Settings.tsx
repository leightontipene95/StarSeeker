import AnimatedBackground from "@/components/AnimatedBackground";
import CustomHeader from "@/components/CustomHeader";
import { borderRadius, colors, spacing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      // Route back to landing page
      router.replace("/(onboarding)/Landing");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={colors.accent.lavender}
            />
            <Text style={styles.settingText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  settingsList: {
    gap: spacing.md,
  },
  settingItem: {
    backgroundColor: "rgba(49, 61, 110, 0.4)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },
});
