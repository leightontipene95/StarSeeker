import AnimatedBackground from '@/components/AnimatedBackground';
import CustomHeader from '@/components/CustomHeader';
import { colors, spacing } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
