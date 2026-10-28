import { CATEGORIES, CATEGORY_LABELS, type Category, type ProductSort } from '@loop/shared';
import type { SymbolViewProps } from 'expo-symbols';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Icon } from '@/components/market/icon';
import { ProductGrid } from '@/components/market/product-grid';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useProducts } from '@/lib/queries';

const CATEGORY_ICONS: Record<Category | 'all', SymbolViewProps['name']> = {
  all: 'square.grid.2x2.fill',
  food: 'fork.knife',
  assignments: 'book.closed.fill',
  clothes: 'tshirt.fill',
  jobs: 'briefcase.fill',
  other: 'shippingbox.fill',
};

const SORTS = [
  { key: 'newest', label: 'Newest', icon: 'clock' },
  { key: 'price_asc', label: 'Lowest price', icon: 'arrow.down' },
  { key: 'price_desc', label: 'Highest price', icon: 'arrow.up' },
] as const satisfies { key: ProductSort; label: string; icon: string }[];

export default function ShopScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [sort, setSort] = useState<ProductSort>('newest');
  const products = useProducts({ sort, category: category === 'all' ? undefined : category });

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="arrow.up.arrow.down" title="Sort by" accessibilityLabel="Sort">
          {SORTS.map((s) => (
            <Stack.Toolbar.MenuAction
              key={s.key}
              icon={s.icon}
              isOn={s.key === sort}
              onPress={() => {
                haptics.select();
                setSort(s.key);
              }}>
              {s.label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

      <ProductGrid
        products={products}
        header={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}>
            {(['all', ...CATEGORIES] as const).map((key) => {
              const active = key === category;
              return (
                <Pressable
                  key={key}
                  onPress={() => setCategory(key)}
                  style={[styles.chip, { backgroundColor: active ? theme.tint : theme.backgroundElement }]}>
                  <Icon
                    name={CATEGORY_ICONS[key]}
                    size={13}
                    color={active ? theme.onTint : theme.textSecondary}
                  />
                  <Text style={[styles.chipText, { color: active ? theme.onTint : theme.text }]}>
                    {key === 'all' ? 'All' : CATEGORY_LABELS[key]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  chipsScroll: {
    marginHorizontal: -16,
  },
  chips: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
