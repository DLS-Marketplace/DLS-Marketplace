/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#F2F2F7',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E5E5EA',
    textSecondary: '#6C6C70',
    border: '#E5E5EA',
    tint: '#007AFF',
    tintSoft: '#E5F1FF',
    onTint: '#FFFFFF',
    success: '#248A3D',
    successSoft: '#E3F5E8',
    warning: '#B26A00',
    warningSoft: '#FFF3DF',
    info: '#007AFF',
    infoSoft: '#E5F1FF',
    danger: '#FF3B30',
  },
  dark: {
    text: '#F2F2F7',
    background: '#000000',
    backgroundElement: '#1C1C1E',
    backgroundSelected: '#2C2C2E',
    textSecondary: '#98989F',
    border: '#2C2C2E',
    tint: '#0A84FF',
    tintSoft: '#0F2540',
    onTint: '#FFFFFF',
    success: '#30D158',
    successSoft: '#11291A',
    warning: '#F2B04C',
    warningSoft: '#2E2414',
    info: '#0A84FF',
    infoSoft: '#0F2540',
    danger: '#FF453A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
