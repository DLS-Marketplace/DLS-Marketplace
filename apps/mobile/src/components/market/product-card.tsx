import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser, type Product } from '@/lib/queries';

import { Bux } from './loopbux';

const glass = isLiquidGlassAvailable();

export function ProductCard({ product, width }: { product: Product; width: number }) {
  const theme = useTheme();
  const isMine = product.seller.id === useCurrentUser()?.id;

  return (
    <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
      <Pressable style={{ width }}>
        {/* On iOS the photo zooms into the product page. */}
        <Link.AppleZoom>
          {/* Slot children need a flat style object. */}
          <View style={StyleSheet.flatten([styles.imageWrap, { backgroundColor: theme.backgroundSelected }])}>
            <Image source={product.images[0]} style={styles.image} contentFit="cover" transition={200} />
            <GlassView style={[styles.pricePill, !glass && styles.pricePillFallback]}>
              <Bux amount={product.priceCents} size={14} color={theme.text} />
            </GlassView>
            {isMine && (
              <View style={[styles.minePill, { backgroundColor: theme.tint }]}>
                <Text style={[styles.mineText, { color: theme.onTint }]}>Yours</Text>
              </View>
            )}
          </View>
        </Link.AppleZoom>
        <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
          {product.title}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    aspectRatio: 1,
    borderRadius: 18,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  pricePill: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pricePillFallback: {
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  minePill: {
    position: 'absolute',
    right: 8,
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mineText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '600',
  },
});
