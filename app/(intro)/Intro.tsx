import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Intro() {
  const whooshPlayer = useAudioPlayer(
    require("../../assets/audio/simple-whoosh-382724.mp3")
  );
  const doorLockPlayer = useAudioPlayer(
    require("../../assets/audio/door-lock-82542.mp3")
  );

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
    router.replace("/(onboarding)/Landing");
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/intro-animation.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
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
