import { api } from '@gambit/backend/convex/_generated/api';
import type { Id } from '@gambit/backend/convex/_generated/dataModel';
import type { Category, ProductSort } from '@gambit/shared';
import { useConvexAuth, useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { ConvexError } from 'convex/values';
import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useState } from 'react';

// Everything here is a live Convex subscription: changes from any device show up immediately.

export type Product = NonNullable<FunctionReturnType<typeof api.products.get>>;
export type Photo = { uri: string; width: number; height: number };

/** The signed-in user's profile; null before they've saved a name, undefined while loading. */
export function useMe() {
  const { isAuthenticated } = useConvexAuth();
  return useQuery(api.users.me, isAuthenticated ? {} : 'skip');
}

export function useCurrentUser() {
  return useMe() ?? null;
}

export function useProducts(query: { category?: Category; q?: string; sort: ProductSort }) {
  return usePaginatedQuery(api.products.list, query, { initialNumItems: 24 });
}

export function useProduct(id: string) {
  return useQuery(api.products.get, { id });
}

export function useProfile(id: string) {
  return useQuery(api.users.get, { id });
}

export function useMyProducts() {
  return useQuery(api.products.mine);
}

/** Message to show for a failed mutation. */
export function errorMessage(e: unknown) {
  if (e instanceof ConvexError) return String(e.data);
  return e instanceof Error ? e.message : 'Something went wrong';
}

/** Wraps an async call with a pending flag for buttons. */
function useTask<Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) {
  const [isPending, setPending] = useState(false);
  const run = async (...args: Args) => {
    setPending(true);
    try {
      return await fn(...args);
    } finally {
      setPending(false);
    }
  };
  return { run, isPending };
}

const MAX_DIMENSION = 1600;

/** Downscales and re-encodes a picked photo as JPEG, then uploads it to Convex storage. */
function useUploadImage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  return async (photo: Photo) => {
    const context = ImageManipulator.manipulate(photo.uri);
    if (Math.max(photo.width, photo.height) > MAX_DIMENSION) {
      context.resize(
        photo.width >= photo.height ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION }
      );
    }
    const rendered = await context.renderAsync();
    const { uri } = await rendered.saveAsync({ compress: 0.8, format: SaveFormat.JPEG });

    const res = await fetch(await generateUploadUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'image/jpeg' },
      body: new File(uri),
    });
    if (!res.ok) throw new Error('Photo upload failed');
    const { storageId } = (await res.json()) as { storageId: Id<'_storage'> };
    return storageId;
  };
}

/** Updates the signed-in user's name and/or photo (creating their profile on first save). */
export function useUpdateProfile() {
  const upload = useUploadImage();
  const updateProfile = useMutation(api.users.updateProfile);
  return useTask(async ({ name, photo }: { name?: string; photo?: Photo }) => {
    const imageId = photo ? await upload(photo) : undefined;
    await updateProfile({ name, imageId });
  });
}

export function useCreateProduct() {
  const upload = useUploadImage();
  const create = useMutation(api.products.create);
  return useTask(
    async ({
      photos,
      ...input
    }: {
      title: string;
      description: string;
      category: Category;
      priceCents: number;
      photos: Photo[];
    }) => {
      const imageIds = await Promise.all(photos.map(upload));
      return create({ ...input, imageIds });
    }
  );
}

export function useDeleteProduct() {
  const remove = useMutation(api.products.remove);
  return useTask((id: Id<'products'>) => remove({ id }));
}
