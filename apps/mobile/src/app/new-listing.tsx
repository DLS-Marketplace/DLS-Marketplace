import { CATEGORIES, CATEGORY_LABELS, MAX_IMAGES_PER_PRODUCT, type Category } from '@gambit/shared';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/market/button';
import { Icon } from '@/components/market/icon';
import { useTheme } from '@/hooks/use-theme';
import { errorMessage, useCreateProduct, type Photo } from '@/lib/queries';
import { feeFor, formatMoney } from '@/store/marketplace';


export default function NewListingScreen() {
  const theme = useTheme();
  const createProduct = useCreateProduct();
  const [images, setImages] = useState<Photo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('other');

  const priceCents = Math.round(parseFloat(price || '0') * 100);
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
        () => router.back(),
        (e) => Alert.alert('Couldn’t publish', errorMessage(e))
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
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Close" onPress={() => router.back()} />
      </Stack.Toolbar>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
        <Pressable
          onPress={pickImages}
          style={[styles.addPhoto, { borderColor: theme.tint, backgroundColor: theme.tintSoft }]}>
          <Icon name="camera.fill" size={22} color={theme.tint} />
          <Text style={[styles.addPhotoText, { color: theme.tint }]}>
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

      <TextInput
        value={price}
        onChangeText={(t) => setPrice(t.replace(/[^\d.]/g, ''))}
        placeholder="Price"
        placeholderTextColor={theme.textSecondary}
        keyboardType="decimal-pad"
        style={inputStyle}
      />
      {priceCents > 0 && (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          You get {formatMoney(priceCents - feeFor(priceCents))}
        </Text>
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
