# Loop

Bun workspaces monorepo. Web and mobile share one [Convex](https://convex.dev) backend, so listings and profiles sync live across every device.

```
apps/
  web/        Website (Astro + React, HeroUI components, Loop theme)
  mobile/     Expo app (SDK 58, expo-router)
packages/
  backend/    Convex backend: schema, queries, mutations, file storage
  shared/     Categories and limits used by backend, web and mobile
```

## Setup

```sh
bun install
bun run web       # or: bun run mobile
```

No env files needed: web and mobile default to the shared dev Convex deployment and Clerk instance. To use your own, set `PUBLIC_CONVEX_URL` / `PUBLIC_CLERK_PUBLISHABLE_KEY` (web) or `EXPO_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (mobile, see `.env.example`) in a `.env.local`.

Changing backend functions needs access to the Convex project: `bun run backend` (log in on first run), then `bun run seed` for demo listings.

## Run

```sh
bun run backend   # Convex dev (pushes function changes on save)
bun run web       # website dev server
bun run mobile    # Expo dev server
bun run ios       # Expo on iOS simulator
bun run android   # Expo on Android emulator
```

Add Expo dependencies from `apps/mobile` with `bunx expo install <pkg>` so versions match the SDK.

`bunfig.toml` sets Bun's hoisted linker: React Native autolinking breaks with the isolated layout because it creates duplicate copies of native modules.

## Auth

Sign-in is passwordless through [Clerk](https://clerk.com): users enter their email, get a 6-digit code, and the first sign-in asks for a name. In the Clerk dashboard, email code must be on and Password off. In development, `name+clerk_test@example.com` addresses accept the code `424242`.

Clerk issues Convex tokens from the `convex` JWT template (`aud: convex`); `packages/backend/convex/auth.config.ts` trusts that issuer. A user's profile row is created when they first save their name.

## Backend

| Function | Auth | |
| --- | --- | --- |
| `users.me` | ✓ | Your profile, or null before you've saved a name |
| `users.updateProfile` | ✓ | `{ name?, imageId? }`; `imageId: null` removes the photo |
| `users.get` | | Public profile with listings |
| `products.list` | | Paginated; `category`, `q` (title search), `sort` (`newest`, `price_asc`, `price_desc`) |
| `products.get` | | One listing |
| `products.mine` | ✓ | Your listings |
| `products.create` | ✓ | `{ title, description, category, priceCents, imageIds }` |
| `products.remove` | ✓ | Deletes your listing and its photos |
| `files.generateUploadUrl` | ✓ | URL to POST one image to → `{ storageId }` |

Posting a listing is two steps: upload each photo to an upload URL to get its `storageId`, then create the product with those IDs. The mobile app downscales photos to 1600px JPEG first; the web app to 1200px.

## Deploying

Every push to `main` deploys automatically (`.github/workflows/deploy.yml`):

- Backend → production Convex (`standing-perch-700`)
- Web → https://gambit-ajg.pages.dev (Cloudflare Pages project `gambit`, built against `apps/web/.env.production`)

Repo secrets: `CONVEX_DEPLOY_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Prod's `CLERK_JWT_ISSUER_DOMAIN` is set; update it when moving to a production Clerk instance.
