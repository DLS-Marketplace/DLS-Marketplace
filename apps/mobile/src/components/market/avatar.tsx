import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Icon } from './icon';

export function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  );
}

/** Profile photo, or initials on a tinted circle when there isn't one. */
export function Avatar({ name, image, size = 40 }: { name: string; image?: string | null; size?: number }) {
  const theme = useTheme();
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (image) {
    return (
      <Image
        source={image}
        style={[shape, { backgroundColor: theme.backgroundSelected }]}
        contentFit="cover"
        transition={150}
      />
    );
  }
  const initials = initialsOf(name);
  return (
    <View style={[styles.fallback, shape, { backgroundColor: theme.tint }]}>
      {initials ? (
        <Text style={[styles.initials, { color: theme.onTint, fontSize: size * 0.38 }]}>
          {initials}
        </Text>
      ) : (
        <Icon name="person.fill" size={size * 0.45} color={theme.onTint} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});
