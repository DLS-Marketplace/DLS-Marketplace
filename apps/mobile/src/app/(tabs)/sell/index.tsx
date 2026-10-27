import { Image } from 'expo-image';
import { Host, Picker, Text as SwiftText } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/market/button';
import { Icon } from '@/components/market/icon';
import { STAGES, StageBadge, StageTrack } from '@/components/market/stage';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useMyProducts, type Product } from '@/lib/queries';
import { formatMoney, useMarketplace } from '@/store/marketplace';
import type { ListingStage } from '@/store/types';

const FILTERS = {
  active: { label: 'Active', stages: ['listed'] },
  progress: { label: 'Pending', stages: ['paid', 'delivered'] },
  done: { label: 'Done', stages: ['released'] },
} satisfies Record<string, { label: string; stages: ListingStage[] }>;
type FilterKey = keyof typeof FILTERS;

export default function SellScreen() {
  const theme = useTheme();
  const { listingStage } = useMarketplace();
  const myProducts = useMyProducts();
  const [filter, setFilter] = useState<FilterKey>('active');

  const mine = myProducts ?? [];
  const countFor = (key: FilterKey) =>
    mine.filter((p) => (FILTERS[key].stages as ListingStage[]).includes(listingStage(p.id))).length;
  const shown = mine.filter((p) =>
    (FILTERS[filter].stages as ListingStage[]).includes(listingStage(p.id))
  );

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="plus"
          accessibilityLabel="List an item"
          onPress={() => router.push('/new-listing')}
        />
      </Stack.Toolbar>

      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        {myProducts === undefined ? (
          <ActivityIndicator style={styles.loading} />
        ) : mine.length === 0 ? (
          <HowItWorks />
        ) : (
          <>
            <Host matchContents={{ vertical: true }} style={styles.segment}>
              <Picker
                selection={filter}
                onSelectionChange={(key: FilterKey) => setFilter(key)}
                modifiers={[pickerStyle('segmented')]}>
                {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
                  <SwiftText key={key} modifiers={[tag(key)]}>
                    {countFor(key) > 0 ? `${FILTERS[key].label} ${countFor(key)}` : FILTERS[key].label}
                  </SwiftText>
                ))}
              </Picker>
            </Host>
            {shown.length === 0 ? (
              <Text style={[styles.empty, { color: theme.textSecondary }]}>Nothing here</Text>
            ) : (
              shown.map((p) => <ListingRow key={p.id} product={p} />)
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

/** Shown before the first listing: the selling cycle and a way to start. */
function HowItWorks() {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.cycle}>
        {STAGES.map((stage, i) => (
          <View key={stage.key} style={styles.cycleStep}>
            <View style={[styles.cycleIcon, { backgroundColor: theme.tintSoft }]}>
              <Icon name={stage.icon} size={17} color={theme.tint} />
            </View>
            <Text style={[styles.cycleLabel, { color: theme.text }]}>{stage.label}</Text>
            {i < STAGES.length - 1 && (
              <View style={styles.cycleArrow}>
                <Icon name="chevron.right" size={11} color={theme.textSecondary} />
              </View>
            )}
          </View>
        ))}
      </View>
      <Button title="List an item" icon="plus" onPress={() => router.push('/new-listing')} />
    </View>
  );
}

function ListingRow({ product }: { product: Product }) {
  const theme = useTheme();
  const { listingStage, saleFor, dispatch } = useMarketplace();
  const stage = listingStage(product.id);
  const sale = saleFor(product.id);

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Pressable
        style={styles.rowTop}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
        <Image source={product.images[0]} style={styles.thumb} contentFit="cover" />
        <View style={{ flex: 1, gap: 3 }}>
          <Text numberOfLines={1} style={[styles.rowTitle, { color: theme.text }]}>
            {product.title}
          </Text>
          <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
            {formatMoney(product.priceCents)}
            {sale ? ` · ${sale.buyer}` : ''}
          </Text>
          <StageBadge stage={stage} />
        </View>
      </Pressable>

      <View style={styles.actionRow}>
        <StageTrack stage={stage} />
        {stage === 'listed' && (
          <Button
            size="small"
            variant="secondary"
            title="Simulate sale"
            onPress={() => dispatch({ type: 'simulateSale', product })}
          />
        )}
        {stage === 'paid' && sale && (
          <Button
            size="small"
            icon="shippingbox.fill"
            title="Delivered"
            onPress={() => dispatch({ type: 'markDelivered', saleId: sale.id })}
          />
        )}
        {stage === 'delivered' && sale && (
          <Button
            size="small"
            variant="secondary"
            title="Simulate confirm"
            onPress={() => dispatch({ type: 'confirmReceipt', saleId: sale.id })}
          />
        )}
        {stage === 'released' && sale && (
          <Text style={[styles.earned, { color: theme.tint }]}>
            +{formatMoney(sale.amountCents - sale.feeCents)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingTop: 8,
    gap: 14,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  loading: {
    paddingVertical: 32,
  },
  card: {
    padding: 16,
    borderRadius: 26,
    borderCurve: 'continuous',
    gap: 14,
  },
  cycle: {
    flexDirection: 'row',
  },
  cycleStep: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  cycleIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleArrow: {
    position: 'absolute',
    right: -6,
    top: 15,
  },
  cycleLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  segment: {
    alignSelf: 'stretch',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 15,
  },
  rowTop: {
    flexDirection: 'row',
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowMeta: {
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  earned: {
    fontSize: 15,
    fontWeight: '700',
  },
});
