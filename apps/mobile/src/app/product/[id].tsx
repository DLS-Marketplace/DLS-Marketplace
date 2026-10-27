import { CATEGORY_LABELS } from '@gambit/shared';
import { Image } from 'expo-image';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/market/avatar';
import { Icon } from '@/components/market/icon';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { errorMessage, useCurrentUser, useDeleteProduct, useProduct } from '@/lib/queries';
import { formatPrice, useMarketplace } from '@/store/marketplace';

function daysSince(time: number) {
  return Math.floor((Date.now() - time) / 86_400_000);
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isSold, purchases } = useMarketplace();
  const user = useCurrentUser();
  const product = useProduct(id);
  const deleteProduct = useDeleteProduct();
  const [page, setPage] = useState(0);

  if (!product) {
    return (
      <View style={[styles.missing, { backgroundColor: theme.background }]}>
        {product === undefined ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: theme.textSecondary }}>Listing not found</Text>
        )}
      </View>
    );
  }

  const imageWidth = Math.min(width, MaxContentWidth);
  const isMine = product.seller.id === user?.id;
  const boughtByMe = purchases.some((p) => p.product.id === product.id);
  const sold = isSold(product.id);
  const price = formatPrice(product.priceCents);
  const listedDaysAgo = daysSince(product.createdAt);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {isMine && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel="More">
            <Stack.Toolbar.MenuAction
              icon="trash"
              destructive
              onPress={() =>
                Alert.alert('Delete listing?', undefined, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                      deleteProduct.run(product.id).then(
                        () => router.back(),
                        (e) => Alert.alert('Couldn’t delete', errorMessage(e))
                      ),
                  },
                ])
              }>
              Delete
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      )}

      {/* iOS 26 bottom toolbar: the price and Buy button float on glass. */}
      <Stack.Toolbar>
        <Stack.Toolbar.View hidesSharedBackground>
          <View style={styles.barPriceWrap}>
            <Text style={[styles.barPrice, { color: theme.text }]}>{price}</Text>
          </View>
        </Stack.Toolbar.View>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          variant="prominent"
          disabled={isMine || sold}
          onPress={() => router.push({ pathname: '/checkout/[id]', params: { id: product.id } })}>
          {isMine ? 'Your listing' : boughtByMe ? 'Purchased' : sold ? 'Sold' : 'Buy now'}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        {/* Where the product card's photo zooms to. */}
        <Link.AppleZoomTarget>
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setPage(Math.round(e.nativeEvent.contentOffset.x / imageWidth))
              }>
              {product.images.map((uri) => (
                <Image
                  key={uri}
                  source={uri}
                  style={{ width: imageWidth, height: imageWidth, backgroundColor: theme.backgroundSelected }}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>
            {product.images.length > 1 && (
              <View style={styles.dots}>
                {product.images.map((uri, i) => (
                  <View
                    key={uri}
                    style={[styles.dot, { opacity: i === page ? 1 : 0.45, width: i === page ? 18 : 7 }]}
                  />
                ))}
              </View>
            )}
          </View>
        </Link.AppleZoomTarget>

        <View style={styles.body}>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: theme.tintSoft }]}>
              <Text style={[styles.tagText, { color: theme.tint }]}>
                {CATEGORY_LABELS[product.category]}
              </Text>
            </View>
            <Text style={[styles.listed, { color: theme.textSecondary }]}>
              {listedDaysAgo === 0 ? 'Today' : `${listedDaysAgo}d ago`}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>

          <Pressable
            onPress={() =>
              isMine
                ? router.navigate('/profile')
                : router.push({ pathname: '/seller/[id]', params: { id: product.seller.id } })
            }
            style={({ pressed }) => [
              styles.sellerCard,
              { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Avatar name={product.seller.name} image={product.seller.image} size={40} />
            <Text style={[styles.sellerName, { color: theme.text }]}>{product.seller.name}</Text>
            <Icon name="chevron.right" size={14} color={theme.textSecondary} />
          </Pressable>

          {!!product.description && (
            <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>
          )}

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  body: {
    padding: 20,
    gap: 12,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listed: {
    fontSize: 13,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 22,
    borderCurve: 'continuous',
    marginTop: 4,
  },
  sellerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 23,
  },
  // Toolbar views are top-aligned; this height centers the price on the Buy button.
  barPriceWrap: {
    height: 64,
    minWidth: 80,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  barPrice: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
