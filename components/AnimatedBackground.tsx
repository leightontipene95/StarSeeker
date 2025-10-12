import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

export default function AnimatedBackground() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animations/background.json')}
        autoPlay
        loop
        style={styles.lottie}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
