import { CATEGORIES, CATEGORY_LABELS, MAX_IMAGES_PER_PRODUCT, type Category } from '@loop/shared';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Bux, LoopbuxIcon } from '@/components/market/loopbux';
import { Icon } from '@/components/market/icon';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { haptics, withHaptic } from '@/lib/haptics';
import { errorMessage, useCreateProduct, type Photo } from '@/lib/queries';
import { feeFor } from '@/store/marketplace';

export default function NewListingScreen() {
  const theme = useTheme();
  const createProduct = useCreateProduct();
  const [images, setImages] = useState<Photo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('other');

  // Whole Loopbux; stored in the listing's `priceCents` field.
  const priceCents = parseInt(price || '0', 10);
  const canSubmit = images.length > 0 && title.trim().length > 2 && priceCents > 0;

  const pickImages = async () => {
    // A selectionLimit of 0 means "unlimited", so stop before asking for it.
    if (images.length >= MAX_IMAGES_PER_PRODUCT) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES_PER_PRODUCT - images.length,
      quality: 1,
    });
    if (!result.canceled) {
      const picked = result.assets.map(({ uri, width, height }) => ({ uri, width, height }));
      setImages((prev) => [...prev, ...picked].slice(0, MAX_IMAGES_PER_PRODUCT));
    }
  };

  const submit = () => {
    createProduct
      .run({
        title: title.trim(),
        description: description.trim(),
        category,
        priceCents,
        photos: images,
      })
      .then(
        () => {
          haptics.success();
          router.back();
        },
        (e) => {
          haptics.error();
          Alert.alert('Couldn’t publish', errorMessage(e));
        }
      );
  };

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }];

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={withHaptic(() => router.back())} />
      </Stack.Toolbar>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
        <Pressable
          onPress={pickImages}
          style={[styles.addPhoto, { borderColor: theme.tint, backgroundColor: theme.tintSoft }]}>
          <Icon name="camera.fill" size={22} color={theme.tintText} />
          <Text style={[styles.addPhotoText, { color: theme.tintText }]}>
            {images.length ? `${images.length}/${MAX_IMAGES_PER_PRODUCT}` : 'Photos'}
          </Text>
        </Pressable>
        {images.map(({ uri }) => (
          <Pressable key={uri} onPress={() => setImages((prev) => prev.filter((p) => p.uri !== uri))}>
            <Image source={uri} style={styles.photo} contentFit="cover" />
            <View style={styles.remove}>
              <Icon name="xmark.circle.fill" size={20} color="#fff" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={theme.textSecondary}
        style={inputStyle}
      />

      <View style={[styles.input, styles.priceRow, { backgroundColor: theme.backgroundElement }]}>
        <LoopbuxIcon size={20} />
        <TextInput
          value={price}
          onChangeText={(t) => setPrice(t.replace(/\D/g, ''))}
          placeholder="Price"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          style={[styles.priceInput, { color: theme.text }]}
        />
      </View>
      {priceCents > 0 && (
        <View style={styles.hintRow}>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>You get</Text>
          <Bux amount={priceCents - feeFor(priceCents)} size={13} color={theme.textSecondary} />
        </View>
      )}

      <View style={styles.chips}>
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, { backgroundColor: active ? theme.tint : theme.backgroundElement }]}>
              <Text style={[styles.chipText, { color: active ? theme.onTint : theme.text }]}>
                {CATEGORY_LABELS[c]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[inputStyle, styles.multiline]}
      />

      <Button
        title="Publish"
        icon="tag.fill"
        disabled={!canSubmit}
        loading={createProduct.isPending}
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
  photos: {
    gap: 10,
    paddingBottom: 6,
  },
  addPhoto: {
    width: 96,
    height: 96,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '700',
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 18,
  },
  remove: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 17,
    letterSpacing: 0,
  },
  multiline: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: 17,
    letterSpacing: 0,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hint: {
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submit: {
    marginTop: 16,
  },
});
