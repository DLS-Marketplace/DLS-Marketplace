# Gambit

Bun workspaces monorepo. Web and mobile share one [Convex](https://convex.dev) backend, so listings and profiles sync live across every device.

```
apps/
  web/        Website (static HTML/CSS/JS, served with Vite)
  mobile/     Expo app (SDK 58, expo-router)
packages/
  backend/    Convex backend: schema, queries, mutations, file storage
  shared/     Categories and limits used by backend, web and mobile
```

## Setup

```sh
bun install
bun run backend   # first run: log in to Convex and create the project; keeps syncing convex/ after that
bunx convex env set CLERK_JWT_ISSUER_DOMAIN https://moral-boxer-8384.clerk.accounts.dev   # from packages/backend
bun run seed      # optional: demo listings
```

Copy `CONVEX_URL` from `packages/backend/.env.local` into:

- `apps/mobile/.env.local` as `EXPO_PUBLIC_CONVEX_URL` (plus `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, see `.env.example`)
- `apps/web/.env.local` as `VITE_CONVEX_URL`

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

- Backend: `bun run --filter @gambit/backend deploy` pushes to production Convex (`standing-perch-700`). Its `CLERK_JWT_ISSUER_DOMAIN` is set; update it when moving to a production Clerk instance.
- Web: `bun run --filter @gambit/web deploy` builds against production Convex (`apps/web/.env.production`) and uploads to Cloudflare Pages project `gambit` → https://gambit-ajg.pages.dev.
