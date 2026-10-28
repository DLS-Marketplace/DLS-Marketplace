import type { SymbolViewProps } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';

import { Icon } from './icon';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: SymbolViewProps['name'];
  variant?: 'primary' | 'secondary' | 'plain';
  size?: 'large' | 'small';
  disabled?: boolean;
  loading?: boolean;
  /** Overrides the label/icon color, e.g. for destructive plain buttons. */
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Shown after the label, e.g. a Loopbux amount. */
  children?: ReactNode;
};

export function Button({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'large',
  disabled,
  loading,
  textColor,
  style,
  children,
}: ButtonProps) {
  const theme = useTheme();
  const background = {
    primary: theme.tint,
    secondary: theme.tintSoft,
    plain: 'transparent',
  }[variant];
  const foreground = textColor ?? (variant === 'primary' ? theme.onTint : theme.tintText);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'small' ? styles.small : styles.large,
        { backgroundColor: background, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <View style={styles.row}>
          {icon && <Icon name={icon} size={size === 'small' ? 13 : 16} color={foreground} />}
          <Text style={[styles.label, size === 'small' && styles.labelSmall, { color: foreground }]}>
            {title}
          </Text>
          {children}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
  },
  small: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 15,
    fontWeight: '600',
  },
});
