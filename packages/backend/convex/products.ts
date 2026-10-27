import {
  DESCRIPTION_MAX_LENGTH,
  MAX_IMAGES_PER_PRODUCT,
  MAX_PRICE_CENTS,
  PRODUCT_SORTS,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '@gambit/shared';
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { mutation, query, type QueryCtx } from './_generated/server';
import { claimImages, currentUser, deleteImages, requireUser, toProduct } from './model';
import { category } from './schema';

type ListArgs = {
  category?: (typeof category)['type'];
  q?: string;
  sort: (typeof PRODUCT_SORTS)[number];
};

function listQuery(ctx: QueryCtx, { category, q, sort }: ListArgs) {
  const products = ctx.db.query('products');
  // Search results are ordered by relevance.
  if (q) {
    return products.withSearchIndex('search_title', (s) =>
      category ? s.search('title', q).eq('category', category) : s.search('title', q)
    );
  }
  if (sort === 'newest') {
    return (
      category ? products.withIndex('by_category', (i) => i.eq('category', category)) : products
    ).order('desc');
  }
  const order = sort === 'price_asc' ? 'asc' : 'desc';
  return category
    ? products.withIndex('by_category_price', (i) => i.eq('category', category)).order(order)
    : products.withIndex('by_price').order(order);
}

/** Listings, newest first unless sorted by price or searched. */
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(category),
    q: v.optional(v.string()),
    sort: v.optional(v.union(...PRODUCT_SORTS.map((s) => v.literal(s)))),
  },
  handler: async (ctx, { paginationOpts, sort = 'newest', ...args }) => {
    const q = args.q?.trim().slice(0, 100);
    const result = await listQuery(ctx, { category: args.category, q, sort }).paginate(paginationOpts);
    return { ...result, page: await Promise.all(result.page.map((p) => toProduct(ctx, p))) };
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId('products', args.id);
    const product = id && (await ctx.db.get('products', id));
    return product ? toProduct(ctx, product) : null;
  },
});

/** The signed-in user's listings. */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user) return [];
    const products = await ctx.db
      .query('products')
      .withIndex('by_seller', (q) => q.eq('sellerId', user._id))
      .order('desc')
      .collect();
    return Promise.all(products.map((p) => toProduct(ctx, p)));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category,
    priceCents: v.number(),
    imageIds: v.array(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const title = args.title.trim();
    const description = args.description.trim();
    if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
      throw new ConvexError(`Title must be ${TITLE_MIN_LENGTH}–${TITLE_MAX_LENGTH} characters`);
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) throw new ConvexError('Description is too long');
    if (!Number.isInteger(args.priceCents) || args.priceCents < 1 || args.priceCents > MAX_PRICE_CENTS) {
      throw new ConvexError('Invalid price');
    }
    if (args.imageIds.length < 1 || args.imageIds.length > MAX_IMAGES_PER_PRODUCT) {
      throw new ConvexError(`Add 1–${MAX_IMAGES_PER_PRODUCT} photos`);
    }

    await claimImages(ctx, user._id, args.imageIds);
    return ctx.db.insert('products', {
      sellerId: user._id,
      title,
      description,
      category: args.category,
      priceCents: args.priceCents,
      imageIds: args.imageIds,
    });
  },
});

/** Deletes one of your listings and its photos. */
export const remove = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const product = await ctx.db.get('products', args.id);
    if (!product) throw new ConvexError('Listing not found');
    if (product.sellerId !== user._id) throw new ConvexError('Not your listing');
    await ctx.db.delete('products', product._id);
    await deleteImages(ctx, product.imageIds);
  },
});
