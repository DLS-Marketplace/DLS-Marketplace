import type { ComponentProps } from 'react';
import { Pressable as RNPressable } from 'react-native';

import { haptics } from '@/lib/haptics';

/** Drop-in `Pressable` that taps on press. */
export function Pressable({ onPress, ...props }: ComponentProps<typeof RNPressable>) {
  return (
    <RNPressable
      {...props}
      onPress={
        onPress &&
        ((e) => {
          haptics.tap();
          onPress(e);
        })
      }
    />
  );
}
