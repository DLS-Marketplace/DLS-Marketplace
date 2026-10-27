import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileForm } from '@/components/market/profile-form';
import { useTheme } from '@/hooks/use-theme';

/** Shown once, right after a new account's first sign-in, to collect a name. */
export default function WelcomeScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome</Text>
        {/* Saving the name creates the profile, and the root layout moves on to the tabs. */}
        <ProfileForm submitLabel="Continue" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 28,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
});
