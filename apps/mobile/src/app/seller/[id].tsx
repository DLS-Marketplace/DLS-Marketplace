import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ProfileView } from '@/components/market/profile-view';
import { useTheme } from '@/hooks/use-theme';
import { useProfile } from '@/lib/queries';

/** Public profile: a seller's photo, name and listings. */
export default function SellerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const profile = useProfile(id);

  if (!profile) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        {profile === undefined ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: theme.textSecondary }}>Profile not found</Text>
        )}
      </View>
    );
  }

  return (
    <ProfileView
      name={profile.name}
      image={profile.image}
      createdAt={profile.createdAt}
      listings={profile.listings}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
