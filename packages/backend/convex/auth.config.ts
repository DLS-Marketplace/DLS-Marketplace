import type { AuthConfig } from 'convex/server';

// Clerk issues Convex tokens from the "convex" JWT template.
// Defaults to the shared dev Clerk instance; override with:
// bunx convex env set CLERK_JWT_ISSUER_DOMAIN https://<instance>.clerk.accounts.dev
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || 'https://moral-boxer-8384.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig;
