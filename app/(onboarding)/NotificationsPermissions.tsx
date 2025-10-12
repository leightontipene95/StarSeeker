import AnimatedBackground from "@/components/AnimatedBackground";
import Button from "@/components/Button";
import { colors, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationsPermissions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const iconScale = useRef(new Animated.Value(0)).current;
  const bellShake = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const button1Anim = useRef(new Animated.Value(0)).current;
  const button1Slide = useRef(new Animated.Value(30)).current;
  const button2Anim = useRef(new Animated.Value(0)).current;
  const button2Slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Icon entrance animation
    Animated.spring(iconScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: 100,
      useNativeDriver: true,
    }).start(() => {
      startBellAnimation();
    });

    // Stagger text and button animations
    Animated.parallel([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(button1Anim, {
        toValue: 1,
        duration: 600,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(button1Slide, {
        toValue: 0,
        duration: 600,
        delay: 700,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(button2Anim, {
        toValue: 1,
        duration: 600,
        delay: 850,
        useNativeDriver: true,
      }),
      Animated.timing(button2Slide, {
        toValue: 0,
        duration: 600,
        delay: 850,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const startBellAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellShake, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bellShake, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bellShake, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bellShake, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ])
    ).start();
  };

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.accent.lavender,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You can enable notifications later in your device settings.",
          [{ text: "OK" }]
        );
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      await registerForPushNotificationsAsync();
       router.push('/(tabs)/Gates');
    } catch (error) {


      console.error("Error requesting notifications:", error);
      Alert.alert("Error", "Failed to enable notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    console.log("User skipped notifications");
       router.push('/(tabs)/Gates');
  };

  const bellRotation = bellShake.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <Animated.View
                style={{
                  transform: [{ rotate: bellRotation }],
                }}
              >
                <Ionicons
                  name="notifications"
                  size={100}
                  color={colors.accent.lavender}
                />
              </Animated.View>
            </View>
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.View style={{ opacity: titleAnim, transform: [{ translateY: titleSlide }] }}>
              <Text style={styles.title}>Stay Updated</Text>
            </Animated.View>
            <Animated.View style={{ opacity: subtitleAnim, transform: [{ translateY: subtitleSlide }] }}>
              <Text style={styles.subtitle}>
                Get notified about deals, delays, cancellations, and more.
              </Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View style={[{ width: '100%' }, { opacity: button1Anim, transform: [{ translateY: button1Slide }] }]}>
            <Button
              title="Enable Notifications"
              onPress={handleEnableNotifications}
              loading={loading}
              disabled={loading}
            />
          </Animated.View>

          <Animated.View style={[{ width: '100%' }, { opacity: button2Anim, transform: [{ translateY: button2Slide }] }]}>
            <Button
              title="Maybe Later"
              onPress={handleSkip}
              variant="secondary"
              disabled={loading}
              style={styles.skipButton}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    marginBottom: spacing.xxl * 2,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(155, 168, 232, 0.12)",
    borderWidth: 4,
    borderColor: colors.accent.lavender,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    maxWidth: 340,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: spacing.xxl * 2,
    gap: spacing.md,
  },
  skipButton: {
    marginTop: spacing.xs,
  },
});
