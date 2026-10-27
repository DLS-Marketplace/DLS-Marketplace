import { StyleSheet, Text, View } from 'react-native';

import { PAYOUT_METHODS } from '@/store/marketplace';
import type { PayoutMethod } from '@/store/types';

export function PayoutGlyph({ method, size = 36 }: { method: PayoutMethod; size?: number }) {
  const { color, glyph } = PAYOUT_METHODS[method];
  return (
    <View
      style={[
        styles.glyph,
        { width: size, height: size, borderRadius: size * 0.3, backgroundColor: color },
      ]}>
      <Text style={[styles.text, { fontSize: size * 0.5 }]}>{glyph}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: {
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  text: {
    color: '#fff',
    fontWeight: '900',
  },
});
