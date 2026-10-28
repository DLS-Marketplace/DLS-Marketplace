import { ConvexReactClient } from 'convex/react';

// Defaults to the shared dev deployment; override with EXPO_PUBLIC_CONVEX_URL.
const url = process.env.EXPO_PUBLIC_CONVEX_URL || 'https://blissful-mandrill-162.convex.cloud';

// Kept in its own module so Fast Refresh edits to queries.ts don't create a new client.
export const convex = new ConvexReactClient(url, { unsavedChangesWarning: false });
