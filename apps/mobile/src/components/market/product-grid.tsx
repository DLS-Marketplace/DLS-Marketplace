import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { useProducts } from '@/lib/queries';
import { useMarketplace } from '@/store/marketplace';

import { Icon } from './icon';
import { ProductCard } from './product-card';

const PADDING = 16;
const GAP = 12;

type ProductGridProps = {
  products: ReturnType<typeof useProducts>;
  header?: ReactElement;
};

/** Two-column, paginated, live-updating grid of listings with loading and empty states. */
export function ProductGrid({ products, header }: ProductGridProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { isSold } = useMarketplace();
  const visible = products.results.filter((p) => !isSold(p.id));

  const contentWidth = Math.min(width, MaxContentWidth);
  const cardWidth = (contentWidth - PADDING * 2 - GAP) / 2;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      data={visible}
      keyExtractor={(p) => p.id}
      numColumns={2}
      ListHeaderComponent={header}
      columnWrapperStyle={styles.column}
      contentContainerStyle={[styles.content, { width: contentWidth, alignSelf: 'center' }]}
      renderItem={({ item }) => <ProductCard product={item} width={cardWidth} />}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (products.status === 'CanLoadMore') products.loadMore(24);
      }}
      ListFooterComponent={products.status === 'LoadingMore' ? <ActivityIndicator /> : undefined}
      ListEmptyComponent={
        <View style={styles.empty}>
          {products.status === 'LoadingFirstPage' ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.emptyInner}>
              <Icon name="magnifyingglass" size={28} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No results</Text>
            </View>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING,
    paddingBottom: 24,
    gap: 20,
  },
  column: {
    gap: GAP,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyInner: {
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 15,
  },
});
