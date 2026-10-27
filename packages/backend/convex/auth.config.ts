import type { AuthConfig } from 'convex/server';

// Clerk issues Convex tokens from the "convex" JWT template.
// Set the issuer with: bunx convex env set CLERK_JWT_ISSUER_DOMAIN https://<instance>.clerk.accounts.dev
export default {
  providers: [{ domain: process.env.CLERK_JWT_ISSUER_DOMAIN!, applicationID: 'convex' }],
} satisfies AuthConfig;
