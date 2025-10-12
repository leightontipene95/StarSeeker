import AnimatedBackground from "@/components/AnimatedBackground";
import Button from "@/components/Button";
import { borderRadius, colors, spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function FirstName() {
  const router = useRouter();
  const [name, setName] = useState("");
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;
  const inputSlide = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Stagger animations for a polished entrance
    Animated.parallel([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(inputSlide, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlide, {
        toValue: 0,
        duration: 600,
        delay: 550,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      console.log("User name:", name.trim());
      Keyboard.dismiss();
      router.push("/(onboarding)/NotificationsPermissions");
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Animated.View
              style={{
                opacity: titleAnim,
                transform: [{ translateY: titleSlide }],
              }}
            >
              <Text style={styles.title}>What's your name?</Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: subtitleAnim,
                transform: [{ translateY: subtitleSlide }],
              }}
            >
              <Text style={styles.subtitle}>Let's get to know you better</Text>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.inputContainer,
              { opacity: inputAnim, transform: [{ translateY: inputSlide }] },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor={colors.text.tertiary}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonContainer,
              { opacity: buttonAnim, transform: [{ translateY: buttonSlide }] },
            ]}
          >
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!isValid}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 2,
    borderColor: colors.accent.lavender,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 20,
    color: colors.text.primary,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});
