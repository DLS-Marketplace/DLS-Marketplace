import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

type IconProps = {
  name: SymbolViewProps['name'];
  size?: number;
  color: ColorValue;
  weight?: SymbolViewProps['weight'];
};

export function Icon({ name, size = 18, color, weight = 'semibold' }: IconProps) {
  return <SymbolView name={name} size={size} tintColor={color} weight={weight} />;
}
