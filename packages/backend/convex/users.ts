import { NAME_MAX_LENGTH } from '@loop/shared';
import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { claimImages, currentUser, deleteImages, toProduct, toProfile } from './model';

/** The signed-in user's profile; null when signed out or before they've saved a name. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    return user && toProfile(ctx, user);
  },
});

/** Public profile with the user's listings. */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId('users', args.id);
    const user = id && (await ctx.db.get('users', id));
    if (!user) return null;
    const products = await ctx.db
      .query('products')
      .withIndex('by_seller', (q) => q.eq('sellerId', user._id))
      .order('desc')
      .collect();
    return {
      ...(await toProfile(ctx, user)),
      listings: await Promise.all(products.map((p) => toProduct(ctx, p))),
    };
  },
});

/** Creates the profile on first save. `imageId: null` removes the photo. */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    imageId: v.optional(v.union(v.id('_storage'), v.null())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Sign in required');

    const name = args.name?.trim();
    if (name !== undefined && (name.length < 1 || name.length > NAME_MAX_LENGTH)) {
      throw new ConvexError(`Name must be 1–${NAME_MAX_LENGTH} characters`);
    }

    let user = await currentUser(ctx);
    if (!user) {
      if (!name) throw new ConvexError('Name required');
      const id = await ctx.db.insert('users', { tokenIdentifier: identity.tokenIdentifier, name });
      user = (await ctx.db.get('users', id))!;
    } else if (name !== undefined) {
      await ctx.db.patch('users', user._id, { name });
    }

    if (args.imageId !== undefined && args.imageId !== user.imageId) {
      if (args.imageId) await claimImages(ctx, user._id, [args.imageId]);
      if (user.imageId) await deleteImages(ctx, [user.imageId]);
      await ctx.db.patch('users', user._id, { imageId: args.imageId ?? undefined });
    }
  },
});
