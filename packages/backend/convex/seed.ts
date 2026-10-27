// Loads demo listings: `bun run seed` (from the repo root or packages/backend). Safe to re-run.
// Demo sellers aren't Clerk users, so nobody can sign in as them.
import { v } from 'convex/values';

import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { internalAction, internalMutation, internalQuery, type QueryCtx } from './_generated/server';
import demoProducts from './demoProducts.json';
import { category } from './schema';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function findSeller(ctx: QueryCtx, seller: string) {
  return ctx.db
    .query('users')
    .withIndex('by_token', (q) => q.eq('tokenIdentifier', `demo|${slug(seller)}`))
    .unique();
}

export const demo = internalAction({
  args: {},
  handler: async (ctx) => {
    let added = 0;
    // Oldest first, so the newest demo listing ends up on top.
    for (const p of [...demoProducts].sort((a, b) => b.listedDaysAgo - a.listedDaysAgo)) {
      if (await ctx.runQuery(internal.seed.exists, { seller: p.seller, title: p.title })) continue;
      const imageIds: Id<'_storage'>[] = [];
      for (const url of p.images) {
        const res = await fetch(url);
        if (res.ok) imageIds.push(await ctx.storage.store(await res.blob()));
        else console.warn(`Skipped ${url} (${res.status})`);
      }
      if (!imageIds.length) continue;
      await ctx.runMutation(internal.seed.insert, {
        seller: p.seller,
        title: p.title,
        description: p.description,
        category: p.category as (typeof category)['type'],
        priceCents: p.priceCents,
        imageIds,
      });
      added++;
    }
    return `Added ${added} demo listings`;
  },
});

export const exists = internalQuery({
  args: { seller: v.string(), title: v.string() },
  handler: async (ctx, { seller, title }) => {
    const user = await findSeller(ctx, seller);
    if (!user) return false;
    const products = await ctx.db
      .query('products')
      .withIndex('by_seller', (q) => q.eq('sellerId', user._id))
      .collect();
    return products.some((p) => p.title === title);
  },
});

export const insert = internalMutation({
  args: {
    seller: v.string(),
    title: v.string(),
    description: v.string(),
    category,
    priceCents: v.number(),
    imageIds: v.array(v.id('_storage')),
  },
  handler: async (ctx, { seller, imageIds, ...product }) => {
    const sellerId =
      (await findSeller(ctx, seller))?._id ??
      (await ctx.db.insert('users', { tokenIdentifier: `demo|${slug(seller)}`, name: seller }));
    for (const storageId of imageIds) await ctx.db.insert('images', { storageId, userId: sellerId });
    await ctx.db.insert('products', { ...product, sellerId, imageIds });
  },
});
