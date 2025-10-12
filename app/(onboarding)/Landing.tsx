import AnimatedBackground from "@/components/AnimatedBackground";
import Button from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function Landing() {
  const router = useRouter();
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const titlePulse = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in title after 1 second
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 1500,
      useNativeDriver: true,
    }).start(() => {
      // Start pulsing after fade in completes
      Animated.loop(
        Animated.sequence([
          Animated.timing(titlePulse, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(titlePulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Fade in button 1 second after title starts
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 800,
      delay: 4500,
      useNativeDriver: true,
    }).start(() => {
      // Start pulsing after fade in completes
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, {
            toValue: 1.03,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulse, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleGetStarted = () => {
    router.push("/(onboarding)/FirstName");
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <Animated.View style={[styles.content, { opacity: titleOpacity, transform: [{ scale: titlePulse }] }]}>
        <Text style={styles.title}>StarSeeker</Text>
      </Animated.View>

      <Animated.View
        style={[styles.buttonContainer, { opacity: buttonOpacity, transform: [{ scale: buttonPulse }] }]}
      >
        <Button title="Get Started" onPress={handleGetStarted} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xxl,
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
  buttonContainer: {
    paddingBottom: spacing.xxl * 2,
  },
});
