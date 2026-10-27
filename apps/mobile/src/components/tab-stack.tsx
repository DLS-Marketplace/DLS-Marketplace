import { Stack } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

/** A tab's own native stack, with an iOS large title that collapses on scroll. */
export function TabStack({ title, largeTitle = true }: { title: string; largeTitle?: boolean }) {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerLargeTitleEnabled: largeTitle,
        headerTransparent: !largeTitle || undefined,
        headerShadowVisible: false,
        headerTintColor: theme.tint,
        headerLargeTitleStyle: { color: theme.text },
        headerTitleStyle: { color: theme.text },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: theme.background },
      }}>
      <Stack.Screen name="index" options={{ title: largeTitle ? title : '' }} />
    </Stack>
  );
}
