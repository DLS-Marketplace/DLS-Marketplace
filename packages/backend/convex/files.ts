import { ConvexError } from 'convex/values';

import { mutation } from './_generated/server';

/** Short-lived URL to POST one image to. The response's storageId goes to products.create or users.updateProfile. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    if (!(await ctx.auth.getUserIdentity())) throw new ConvexError('Sign in required');
    return ctx.storage.generateUploadUrl();
  },
});
