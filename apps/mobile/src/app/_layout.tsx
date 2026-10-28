import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useConvexAuth } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { convex } from '@/lib/convex';
import { useMe } from '@/lib/queries';
import { MarketplaceProvider } from '@/store/marketplace';

// Defaults to the shared dev Clerk instance; override with EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.
const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_bW9yYWwtYm94ZXItODM4NC5jbGVyay5hY2NvdW50cy5kZXYk';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, primary: colors.tintText, background: colors.background },
  };

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider value={theme}>
          <MarketplaceProvider>
            <RootStack />
          </MarketplaceProvider>
          <AnimatedSplashOverlay />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootStack() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { isLoading, isAuthenticated } = useConvexAuth();
  const me = useMe();
  // Signed-in screens wait for the profile, so we know whether to ask for a name.
  const profileReady = isAuthenticated && me !== undefined;
  // New accounts have no profile until they save a name; ask for one first.
  const needsName = profileReady && !me?.name.trim();

  // Mount the stack once auth and the profile have loaded, then keep it mounted.
  const [booted, setBooted] = useState(false);
  if (!booted && !isLoading && (!isAuthenticated || profileReady)) setBooted(true);
  if (!booted) return null;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.tintText,
        headerTitleStyle: { color: colors.text },
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Protected guard={profileReady && !needsName}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerTransparent: true, title: '' }} />
        <Stack.Screen
          name="checkout/[id]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            sheetGrabberVisible: true,
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="get-loopbux"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            sheetGrabberVisible: true,
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen name="new-listing" options={{ presentation: 'modal', title: 'New listing' }} />
        <Stack.Screen name="payout" options={{ presentation: 'modal', title: 'Cash out' }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', title: 'Edit profile' }} />
        <Stack.Screen name="seller/[id]" options={{ title: '' }} />
      </Stack.Protected>
      <Stack.Protected guard={needsName}>
        <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
      </Stack.Protected>
      {/* Stays up after the code is accepted until the profile has loaded. */}
      <Stack.Protected guard={!profileReady}>
        <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}
