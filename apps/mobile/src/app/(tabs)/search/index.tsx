import { Stack } from 'expo-router';
import { useState } from 'react';

import { ProductGrid } from '@/components/market/product-grid';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { withHaptic } from '@/lib/haptics';
import { useProducts } from '@/lib/queries';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const q = useDebouncedValue(query.trim());
  const products = useProducts({ q, sort: 'newest' });

  return (
    <>
      <Stack.SearchBar
        placement="automatic"
        placeholder="Search"
        onChangeText={(e) => setQuery(e.nativeEvent.text)}
        onCancelButtonPress={withHaptic(() => setQuery(''))}
      />
      <ProductGrid products={products} />
    </>
  );
}
