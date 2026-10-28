import type { SymbolViewProps } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { ListingStage } from '@/store/types';

import { Icon } from './icon';

export const STAGES: { key: ListingStage; label: string; icon: SymbolViewProps['name'] }[] = [
  { key: 'listed', label: 'Listed', icon: 'tag.fill' },
  { key: 'paid', label: 'Sold', icon: 'lock.fill' },
  { key: 'delivered', label: 'Delivered', icon: 'shippingbox.fill' },
  { key: 'released', label: 'Paid', icon: 'g.circle.fill' },
];

export function stageIndex(stage: ListingStage) {
  return STAGES.findIndex((s) => s.key === stage);
}

export function StageBadge({ stage }: { stage: ListingStage }) {
  const theme = useTheme();
  const tone = {
    listed: { bg: theme.infoSoft, fg: theme.info, label: 'Active' },
    paid: { bg: theme.warningSoft, fg: theme.warning, label: 'Deliver now' },
    delivered: { bg: theme.warningSoft, fg: theme.warning, label: 'Waiting' },
    released: { bg: theme.successSoft, fg: theme.success, label: 'Completed' },
  }[stage];

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.badgeText, { color: tone.fg }]}>{tone.label}</Text>
    </View>
  );
}

/** Four-step progress track for the selling cycle. */
export function StageTrack({ stage }: { stage: ListingStage }) {
  const theme = useTheme();
  const current = stageIndex(stage);

  return (
    <View style={styles.track}>
      {STAGES.map((s, i) => {
        const done = i <= current;
        return (
          <View key={s.key} style={[styles.step, i === STAGES.length - 1 && styles.lastStep]}>
            <View
              style={[
                styles.dot,
                { backgroundColor: done ? theme.tint : theme.backgroundSelected },
              ]}>
              <Icon name={s.icon} size={10} color={done ? theme.onTint : theme.textSecondary} />
            </View>
            {i < STAGES.length - 1 && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: i < current ? theme.tint : theme.backgroundSelected },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastStep: {
    flex: 0,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    borderRadius: 1,
  },
});
