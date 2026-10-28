import { useClerk, useUser } from '@clerk/expo';
import { router, Stack } from 'expo-router';
import { Alert, StyleSheet, Text } from 'react-native';

import { ProfileView } from '@/components/market/profile-view';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { withHaptic } from '@/lib/haptics';
import { useCurrentUser, useMyProducts } from '@/lib/queries';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useCurrentUser();
  const { signOut } = useClerk();
  const email = useUser().user?.primaryEmailAddress?.emailAddress;
  const myProducts = useMyProducts();
  if (!user) return null;

  const confirmSignOut = () =>
    Alert.alert('Sign out?', email, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: withHaptic(() => signOut()),
      },
    ]);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button onPress={withHaptic(() => router.push('/edit-profile'))}>Edit</Stack.Toolbar.Button>
      </Stack.Toolbar>

      <ProfileView
        name={user.name}
        image={user.image}
        createdAt={user.createdAt}
        listings={myProducts}
        loading={myProducts === undefined}
        footer={
          <Pressable
            onPress={confirmSignOut}
            style={({ pressed }) => [
              styles.signOut,
              { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement },
            ]}>
            <Text style={[styles.signOutText, { color: theme.danger }]}>Sign Out</Text>
          </Pressable>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  signOut: {
    height: 52,
    borderRadius: 26,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontSize: 17,
  },
});
