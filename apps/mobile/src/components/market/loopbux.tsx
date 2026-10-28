import { useId } from 'react';
import { StyleSheet, Text, View, type ColorValue, type StyleProp, type TextStyle } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Polygon, Rect } from 'react-native-svg';

import { formatBux } from '@/store/marketplace';

/** One cartoon chain link: dark outline, gold band, glossy streak. */
function Link({ cx, cy }: { cx: number; cy: number }) {
  const x = cx - 5;
  const y = cy - 3;
  return (
    <G transform={`rotate(-45 ${cx} ${cy})`}>
      <Rect x={x} y={y} width={10} height={6} rx={3} fill="none" stroke="#5C3300" strokeWidth={4.2} />
      <Rect x={x} y={y} width={10} height={6} rx={3} fill="none" stroke="#FFC233" strokeWidth={2.4} />
      <Path d={`M${x + 2.1} ${y}h4`} stroke="#FFF3C4" strokeWidth={0.9} strokeLinecap="round" />
    </G>
  );
}

/** The Loopbux icon: two interlocked gold chain links. */
export function LoopbuxIcon({ size = 18 }: { size?: number }) {
  const clip = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        {/* Upper-left half: redrawing the first link here puts it over the second at one crossing. */}
        <ClipPath id={clip}>
          <Polygon points="0,0 24,0 0,24" />
        </ClipPath>
      </Defs>
      <Link cx={9.5} cy={14.5} />
      <Link cx={14.5} cy={9.5} />
      <G clipPath={`url(#${clip})`}>
        <Link cx={9.5} cy={14.5} />
      </G>
    </Svg>
  );
}

type BuxProps = {
  amount: number;
  /** Text size; the coin scales with it. */
  size?: number;
  color: ColorValue;
  /** Prefix such as "+" or "-". */
  sign?: string;
  style?: StyleProp<TextStyle>;
};

/** A Loopbux amount: coin followed by the number. */
export function Bux({ amount, size = 15, color, sign = '', style }: BuxProps) {
  return (
    <View style={[styles.row, { gap: size * 0.25 }]}>
      {!!sign && <Text style={[styles.text, { fontSize: size, color }, style]}>{sign}</Text>}
      <LoopbuxIcon size={size * 0.95} />
      <Text style={[styles.text, { fontSize: size, color }, style]}>{formatBux(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
