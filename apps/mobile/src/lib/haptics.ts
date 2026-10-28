import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS !== 'web';

/** Fire-and-forget haptics; no-ops on web. */
export const haptics = {
  tap: () => enabled && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  select: () => enabled && void Haptics.selectionAsync(),
  success: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

/** Wraps a press handler so it taps first. */
export function withHaptic<A extends unknown[]>(fn: (...args: A) => void) {
  return (...args: A) => {
    haptics.tap();
    fn(...args);
  };
}
