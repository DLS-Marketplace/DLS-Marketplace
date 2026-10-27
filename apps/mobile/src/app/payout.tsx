import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Icon } from '@/components/market/icon';
import { PayoutGlyph } from '@/components/market/payout-glyph';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney, PAYOUT_METHODS, useMarketplace } from '@/store/marketplace';
import type { PayoutMethod } from '@/store/types';

function validHandle(method: PayoutMethod, handle: string) {
  const h = handle.trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?[\d\s().-]{10,}$/;
  switch (method) {
    case 'cashapp':
      return /^\$[A-Za-z][\w]{0,19}$/.test(h);
    case 'venmo':
      return /^@[\w-]{4,30}$/.test(h);
    case 'paypal':
      return email.test(h) || phone.test(h);
    case 'zelle':
      return email.test(h) || phone.test(h);
  }
}

export default function PayoutScreen() {
  const theme = useTheme();
  const { balances, dispatch } = useMarketplace();
  const [method, setMethod] = useState<PayoutMethod>('cashapp');
  const [handle, setHandle] = useState('');
  const [amount, setAmount] = useState((balances.availableCents / 100).toFixed(2));

  const amountCents = Math.round(parseFloat(amount || '0') * 100);
  const amountOk = amountCents > 0 && amountCents <= balances.availableCents;
  const handleOk = validHandle(method, handle);
  const info = PAYOUT_METHODS[method];

  const submit = () => {
    dispatch({ type: 'requestPayout', method, handle: handle.trim(), amountCents });
    router.back();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={() => router.back()} />
      </Stack.Toolbar>

      <View style={styles.amountBlock}>
          <View style={styles.amountRow}>
          <Text style={[styles.dollar, { color: theme.text }]}>$</Text>
          <TextInput
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^\d.]/g, ''))}
            keyboardType="decimal-pad"
            style={[styles.amountInput, { color: theme.text }]}
            selectTextOnFocus
          />
        </View>
        <Pressable onPress={() => setAmount((balances.availableCents / 100).toFixed(2))}>
          <Text style={[styles.available, { color: amountOk ? theme.textSecondary : theme.warning }]}>
            {formatMoney(balances.availableCents)} ·{' '}
            <Text style={{ color: theme.tint, fontWeight: '700' }}>Max</Text>
          </Text>
        </Pressable>
      </View>

      <View style={styles.methodGrid}>
        {(Object.keys(PAYOUT_METHODS) as PayoutMethod[]).map((m) => {
          const active = m === method;
          return (
            <Pressable
              key={m}
              onPress={() => {
                setMethod(m);
                setHandle('');
              }}
              style={[
                styles.methodTile,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: active ? theme.tint : 'transparent',
                },
              ]}>
              <PayoutGlyph method={m} size={32} />
              <Text style={[styles.methodText, { color: theme.text }]}>{PAYOUT_METHODS[m].label}</Text>
              {active && (
                <View style={styles.check}>
                  <Icon name="checkmark.circle.fill" size={18} color={theme.tint} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={handle}
        onChangeText={setHandle}
        placeholder={info.placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={method === 'paypal' || method === 'zelle' ? 'email-address' : 'default'}
        returnKeyType="done"
        onSubmitEditing={() => amountOk && handleOk && submit()}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <Button
        title={amountOk ? `Send ${formatMoney(amountCents)}` : 'Send'}
        disabled={!amountOk || !handleOk}
        onPress={submit}
        style={styles.submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 12,
  },
  amountBlock: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollar: {
    fontSize: 40,
    fontWeight: '700',
  },
  amountInput: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: 0,
    minWidth: 120,
    fontVariant: ['tabular-nums'],
  },
  available: {
    fontSize: 14,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodTile: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
  methodText: {
    fontSize: 15,
    fontWeight: '700',
  },
  check: {
    marginLeft: 'auto',
  },
  submit: {
    marginTop: 8,
  },
  input: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 17,
    letterSpacing: 0,
  },
});
