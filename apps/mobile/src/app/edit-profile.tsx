import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ProfileForm } from '@/components/market/profile-form';
import { useTheme } from '@/hooks/use-theme';
import { withHaptic } from '@/lib/haptics';

export default function EditProfileScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={withHaptic(() => router.back())} />
      </Stack.Toolbar>
      <ProfileForm submitLabel="Save" onSaved={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingTop: 32,
  },
});
