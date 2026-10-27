import { CATEGORIES } from '@gambit/shared';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const category = v.union(...CATEGORIES.map((c) => v.literal(c)));

export default defineSchema({
  /** App profile for a Clerk user, created when they first save their name. */
  users: defineTable({
    /** From the Clerk token; demo sellers use `demo|…` and can't sign in. */
    tokenIdentifier: v.string(),
    name: v.string(),
    imageId: v.optional(v.id('_storage')),
  }).index('by_token', ['tokenIdentifier']),

  products: defineTable({
    sellerId: v.id('users'),
    title: v.string(),
    description: v.string(),
    category,
    priceCents: v.number(),
    imageIds: v.array(v.id('_storage')),
  })
    .index('by_seller', ['sellerId'])
    .index('by_category', ['category'])
    .index('by_price', ['priceCents'])
    .index('by_category_price', ['category', 'priceCents'])
    .searchIndex('search_title', { searchField: 'title', filterFields: ['category'] }),

  /** Uploaded files in use as a listing photo or avatar, so one can't be attached twice. */
  images: defineTable({
    storageId: v.id('_storage'),
    userId: v.id('users'),
  }).index('by_storage', ['storageId']),
});
