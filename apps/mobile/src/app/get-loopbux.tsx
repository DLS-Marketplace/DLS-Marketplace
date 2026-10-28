import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Bux, LoopbuxIcon } from '@/components/market/loopbux';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { buxToUsdCents, formatUsd, LOOPBUX_PACKS, useMarketplace } from '@/store/marketplace';

export default function GetLoopbuxSheet() {
  const theme = useTheme();
  const { dispatch } = useMarketplace();
  const [pack, setPack] = useState(LOOPBUX_PACKS[1]);
  const [paying, setPaying] = useState(false);

  const pay = () => {
    setPaying(true);
    // Stand-in for a real card payment.
    setTimeout(() => {
      dispatch({ type: 'topUp', amount: pack });
      haptics.success();
      router.back();
    }, 900);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <LoopbuxIcon size={56} />
        <Text style={[styles.heading, { color: theme.text }]}>Get Loopbux</Text>
      </View>

      <View style={styles.grid}>
        {LOOPBUX_PACKS.map((amount) => (
          <Pressable
            key={amount}
            onPress={() => setPack(amount)}
            style={[
              styles.tile,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: amount === pack ? theme.tint : 'transparent',
              },
            ]}>
            <Bux amount={amount} size={20} color={theme.text} />
            <Text style={[styles.usd, { color: theme.textSecondary }]}>
              {formatUsd(buxToUsdCents(amount))}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button
        title={`Pay ${formatUsd(buxToUsdCents(pack))}`}
        icon="lock.fill"
        loading={paying}
        onPress={pay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 28,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
  usd: {
    fontSize: 14,
    fontWeight: '600',
  },
});
