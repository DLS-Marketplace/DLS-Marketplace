import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Bux } from '@/components/market/loopbux';
import { Icon } from '@/components/market/icon';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useProduct } from '@/lib/queries';
import { useMarketplace } from '@/store/marketplace';

export default function CheckoutSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { balances, dispatch } = useMarketplace();
  const product = useProduct(id);
  const [status, setStatus] = useState<'review' | 'paying' | 'done'>('review');

  if (!product) return null;
  const short = status === 'review' && balances.available < product.priceCents;

  const pay = () => {
    setStatus('paying');
    // Stand-in for a real payment call; the Loopbux are held by Loop.
    setTimeout(() => {
      dispatch({ type: 'buy', product });
      setStatus('done');
      haptics.success();
    }, 900);
  };

  if (status === 'done') {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <View style={[styles.successIcon, { backgroundColor: theme.tintSoft }]}>
          <Icon name="checkmark" size={30} color={theme.tintText} weight="bold" />
        </View>
        <Text style={[styles.heading, { color: theme.text }]}>Payment received</Text>
        <Text style={[styles.successBody, { color: theme.textSecondary }]}>
          Held by Loop until you get your item.
        </Text>
        <Button title="Done" style={styles.fullWidth} onPress={() => router.dismissTo('/')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Checkout</Text>

      <View style={[styles.itemRow, { backgroundColor: theme.backgroundElement }]}>
        <Image source={product.images[0]} style={styles.thumb} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={[styles.itemTitle, { color: theme.text }]}>
            {product.title}
          </Text>
          <Text style={[styles.itemMeta, { color: theme.textSecondary }]}>{product.seller.name}</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <Text style={[styles.noticeText, { color: short ? theme.warning : theme.textSecondary }]}>
          Balance
        </Text>
        <Bux amount={balances.available} size={13} color={short ? theme.warning : theme.textSecondary} />
      </View>

      {short ? (
        <Button title="Get Loopbux" icon="plus" onPress={() => router.push('/get-loopbux')} />
      ) : (
        <Button title="Pay" icon="lock.fill" loading={status === 'paying'} onPress={pay}>
          <Bux amount={product.priceCents} size={17} color={theme.onTint} />
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 28,
    gap: 16,
  },
  center: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  noticeText: {
    fontSize: 13,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  successBody: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
});
