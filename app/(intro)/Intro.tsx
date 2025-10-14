import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Intro() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  
  const whooshPlayer = useAudioPlayer(
    require("../../assets/audio/simple-whoosh-382724.mp3")
  );
  const doorLockPlayer = useAudioPlayer(
    require("../../assets/audio/door-lock-82542.mp3")
  );

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@has_onboarded");
        setHasOnboarded(value === "true");
      } catch (error) {
        console.error("Error reading onboarding status:", error);
        setHasOnboarded(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    let mounted = true;

    const playAudio = async () => {
      try {
        setTimeout(() => {
          if (mounted) {
            whooshPlayer.play();
          }
        }, 3050);
        // Play door lock sound after 500ms
        setTimeout(() => {
          if (mounted) {
            doorLockPlayer.play();
          }
        }, 3300);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    playAudio();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAnimationFinish = () => {
    // Route based on onboarding status:
    // - If user has completed onboarding, go directly to main app
    // - Otherwise, show landing/onboarding flow
    if (hasOnboarded) {
      router.replace("/(tabs)/Gates");
    } else {
      router.replace("/(onboarding)/Landing");
    }
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="StarSeeker intro screen"
      accessibilityHint="Loading the app with hyperspace animation, please wait"
      accessibilityRole="none"
    >
      <LottieView
        source={require("../../assets/animations/intro-animation.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});
