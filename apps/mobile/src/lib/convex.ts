import { ConvexReactClient } from 'convex/react';

const url = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!url) throw new Error('Missing EXPO_PUBLIC_CONVEX_URL in apps/mobile/.env.local');

// Kept in its own module so Fast Refresh edits to queries.ts don't create a new client.
export const convex = new ConvexReactClient(url, { unsavedChangesWarning: false });
