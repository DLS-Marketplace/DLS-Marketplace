import type { ReactNode } from 'react';
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
import type { Product } from '@/lib/queries';

import { Avatar } from './avatar';
import { ProductCard } from './product-card';

const PADDING = 16;
const GAP = 12;

function joinedLabel(time: number) {
  return `Joined ${new Date(time).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

type ProfileViewProps = {
  name: string;
  image: string | null;
  createdAt?: number;
  listings: Product[] | undefined;
  loading?: boolean;
  /** Buttons under the name (e.g. Edit profile). */
  actions?: ReactNode;
  /** Rendered after the listings (e.g. Sign out). */
  footer?: ReactNode;
};

/** Avatar, name and a grid of the user's listings. Shared by Profile and seller pages. */
export function ProfileView({
  name,
  image,
  createdAt,
  listings,
  loading,
  actions,
  footer,
}: ProfileViewProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MaxContentWidth);
  const cardWidth = (contentWidth - PADDING * 2 - GAP) / 2;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      data={listings ?? []}
      keyExtractor={(p) => p.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={[styles.content, { width: contentWidth, alignSelf: 'center' }]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Avatar name={name} image={image} size={96} />
          <View style={styles.nameBlock}>
            <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {[
                createdAt && joinedLabel(createdAt),
                listings && `${listings.length} ${listings.length === 1 ? 'listing' : 'listings'}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
          {actions}
        </View>
      }
      renderItem={({ item }) => <ProductCard product={item} width={cardWidth} />}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator style={styles.empty} />
        ) : (
          <Text style={[styles.empty, styles.emptyText, { color: theme.textSecondary }]}>
            No listings yet
          </Text>
        )
      }
      ListFooterComponent={footer ? <View style={styles.footer}>{footer}</View> : undefined}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PADDING,
    paddingBottom: 32,
    gap: 20,
  },
  column: {
    gap: GAP,
  },
  header: {
    alignItems: 'center',
    gap: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  nameBlock: {
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  meta: {
    fontSize: 14,
  },
  empty: {
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    marginTop: 12,
  },
});
