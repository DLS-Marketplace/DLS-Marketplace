import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '@gambit/shared';
import { ConvexError } from 'convex/values';

import type { Doc, Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

/** The signed-in user's profile, or null if signed out or no profile yet. */
export async function currentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query('users')
    .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
    .unique();
}

export async function requireUser(ctx: QueryCtx) {
  const user = await currentUser(ctx);
  if (!user) throw new ConvexError('Sign in required');
  return user;
}

export async function imageUrl(ctx: QueryCtx, id: Id<'_storage'> | undefined) {
  return id ? ctx.storage.getUrl(id) : null;
}

export async function toProfile(ctx: QueryCtx, user: Doc<'users'>) {
  return {
    id: user._id,
    name: user.name,
    image: await imageUrl(ctx, user.imageId),
    createdAt: user._creationTime,
  };
}

export async function toProduct(ctx: QueryCtx, product: Doc<'products'>) {
  const [seller, images] = await Promise.all([
    ctx.db.get('users', product.sellerId),
    Promise.all(product.imageIds.map((id) => ctx.storage.getUrl(id))),
  ]);
  return {
    id: product._id,
    title: product.title,
    description: product.description,
    category: product.category,
    priceCents: product.priceCents,
    images: images.filter((url) => url !== null),
    seller: {
      id: product.sellerId,
      name: seller?.name ?? '',
      image: await imageUrl(ctx, seller?.imageId),
    },
    createdAt: product._creationTime,
  };
}

/** Checks uploaded files are images that aren't attached elsewhere, then records them as `userId`'s. */
export async function claimImages(ctx: MutationCtx, userId: Id<'users'>, ids: Id<'_storage'>[]) {
  if (new Set(ids).size !== ids.length) throw new ConvexError('Duplicate image');
  for (const id of ids) {
    const file = await ctx.db.system.get('_storage', id);
    if (!file) throw new ConvexError('Image upload not found');
    if (!(IMAGE_TYPES as readonly string[]).includes(file.contentType ?? '')) {
      throw new ConvexError('Upload a JPEG, PNG, WebP or HEIC image');
    }
    if (file.size > MAX_IMAGE_BYTES) throw new ConvexError('Image is larger than 10 MB');
    const taken = await ctx.db
      .query('images')
      .withIndex('by_storage', (q) => q.eq('storageId', id))
      .unique();
    if (taken) throw new ConvexError('Image already used');
  }
  for (const storageId of ids) await ctx.db.insert('images', { storageId, userId });
}

/** Deletes files and their ownership records. */
export async function deleteImages(ctx: MutationCtx, ids: Id<'_storage'>[]) {
  for (const id of ids) {
    const row = await ctx.db
      .query('images')
      .withIndex('by_storage', (q) => q.eq('storageId', id))
      .unique();
    if (row) await ctx.db.delete('images', row._id);
    await ctx.storage.delete(id);
  }
}
