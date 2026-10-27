import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Icon } from '@/components/market/icon';
import { PayoutGlyph } from '@/components/market/payout-glyph';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney, PAYOUT_METHODS, useMarketplace } from '@/store/marketplace';
import type { PayoutMethod } from '@/store/types';

type Activity = {
  id: string;
  createdAt: number;
  title: string;
  subtitle: string;
  amount: string;
  tone: 'positive' | 'neutral' | 'pending';
  icon?: SymbolViewProps['name'];
  method?: PayoutMethod;
};

function timeAgo(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function BillingScreen() {
  const theme = useTheme();
  const { balances, sales, purchases, payouts } = useMarketplace();

  const activity: Activity[] = [
    ...sales.map<Activity>((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      title: s.product.title,
      subtitle: s.stage === 'released' ? 'Sold' : 'Sold · pending',
      amount: `+${formatMoney(s.amountCents - s.feeCents)}`,
      tone: s.stage === 'released' ? 'positive' : 'pending',
      icon: 'tag.fill',
    })),
    ...purchases.map<Activity>((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      title: p.product.title,
      subtitle: 'Bought',
      amount: `-${formatMoney(p.amountCents)}`,
      tone: 'neutral',
      icon: 'bag.fill',
    })),
    ...payouts.map<Activity>((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      title: PAYOUT_METHODS[p.method].label,
      subtitle: `${p.handle} · ${p.status === 'sent' ? 'Sent' : 'Processing'}`,
      amount: `-${formatMoney(p.amountCents)}`,
      tone: p.status === 'sent' ? 'neutral' : 'pending',
      method: p.method,
    })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const toneColor = { positive: theme.tint, neutral: theme.text, pending: theme.warning };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={[styles.balanceCard, { backgroundColor: theme.tint }]}>
        <Text style={[styles.balanceLabel, { color: theme.onTint }]}>Available</Text>
        <Text style={[styles.balance, { color: theme.onTint }]}>
          {formatMoney(balances.availableCents)}
        </Text>
        <View style={styles.balanceRow}>
          <View>
            <Text style={[styles.subLabel, { color: theme.onTint }]}>Pending</Text>
            <Text style={[styles.subValue, { color: theme.onTint }]}>
              {formatMoney(balances.pendingCents)}
            </Text>
          </View>
          <View>
            <Text style={[styles.subLabel, { color: theme.onTint }]}>Paid out</Text>
            <Text style={[styles.subValue, { color: theme.onTint }]}>
              {formatMoney(balances.paidOutCents)}
            </Text>
          </View>
        </View>
        <Button
          title="Cash out"
          icon="arrow.up.right"
          textColor={theme.onTint}
          disabled={balances.availableCents <= 0}
          onPress={() => router.push('/payout')}
          style={styles.payoutButton}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity</Text>
      {activity.length === 0 && (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>No activity yet</Text>
      )}
      <View
        style={[
          styles.card,
          styles.list,
          { backgroundColor: theme.backgroundElement },
          activity.length === 0 && styles.hidden,
        ]}>
        {activity.map((a, i) => (
          <View
            key={a.id}
            style={[
              styles.activityRow,
              i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
            ]}>
            {a.method ? (
              <PayoutGlyph method={a.method} />
            ) : (
              <View style={[styles.activityIcon, { backgroundColor: theme.backgroundSelected }]}>
                <Icon name={a.icon!} size={15} color={theme.text} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[styles.activityTitle, { color: theme.text }]}>
                {a.title}
              </Text>
              <Text numberOfLines={1} style={[styles.activitySub, { color: theme.textSecondary }]}>
                {a.subtitle}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.activityAmount, { color: toneColor[a.tone] }]}>{a.amount}</Text>
              <Text style={[styles.activitySub, { color: theme.textSecondary }]}>
                {timeAgo(a.createdAt)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
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
  balanceCard: {
    padding: 20,
    borderRadius: 28,
    borderCurve: 'continuous',
    gap: 6,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.85,
  },
  balance: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 6,
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.75,
  },
  subValue: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  payoutButton: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  card: {
    padding: 16,
    borderRadius: 26,
    borderCurve: 'continuous',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 24,
  },
  hidden: {
    display: 'none',
  },
  list: {
    paddingVertical: 4,
    gap: 0,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  activitySub: {
    fontSize: 12,
    marginTop: 1,
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
