import { Clerk } from "@clerk/clerk-js";
import { ConvexReactClient } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@loop/backend/convex/_generated/api";

// Default to the shared dev Clerk instance and Convex deployment; .env files override.
export const clerk = new Clerk(
  import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_bW9yYWwtYm94ZXItODM4NC5jbGVyay5hY2NvdW50cy5kZXYk",
);

export const convex = new ConvexReactClient(
  import.meta.env.PUBLIC_CONVEX_URL || "https://blissful-mandrill-162.convex.cloud",
);

/** Auth bridge for ConvexProviderWithAuth: reflects the Clerk session state. */
export function useClerkAuth() {
  const [state, setState] = useState(() => ({
    isLoading: !clerk.loaded,
    isAuthenticated: !!clerk.session,
  }));

  useEffect(() => {
    return clerk.addListener((u) =>
      setState({ isLoading: false, isAuthenticated: !!u?.session }),
    );
  }, []);

  // Stable identity — ConvexProviderWithAuth re-auths whenever this changes.
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) =>
      (await clerk.session?.getToken({ template: "convex", skipCache: forceRefreshToken })) ?? null,
    [],
  );

  return { ...state, fetchAccessToken };
}

export async function uploadImage(blob: Blob): Promise<string> {
  const url = await convex.mutation(api.files.generateUploadUrl, {});
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  if (!res.ok) throw new Error("Photo upload failed");
  return (await res.json()).storageId as string;
}

export { api };
