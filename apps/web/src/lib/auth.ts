import { clerk } from "./convex";

export type PendingAuth =
  | { mode: "signIn"; resource: any }
  | { mode: "signUp"; resource: any };

export function clerkMessage(err: any, fallback: string): string {
  const first = err?.errors?.[0];
  return first?.longMessage || first?.message || err?.message || fallback;
}

export function convexMessage(err: any): string {
  return err?.data ? String(err.data) : err?.message || "Something went wrong";
}

// Clerk Protect can require a bot check mid-flow (Clerk's prebuilt UI does this automatically).
// Run the challenge module it points to and submit the proof; checks can be chained.
export async function passProtectCheck(resource: any, container: HTMLElement): Promise<any> {
  for (let i = 0; resource.protectCheck && i < 3; i++) {
    const { sdkUrl, token, uiHints } = resource.protectCheck;
    if (new URL(sdkUrl).protocol !== "https:") throw new Error("Invalid security check");
    const { default: runCheck } = await import(/* @vite-ignore */ sdkUrl);
    try {
      const proofToken = await runCheck(container, {
        token,
        uiHints,
        setWidgetVisible: async (visible: boolean) => {
          container.hidden = !visible;
        },
      });
      resource = await resource.submitProtectCheck({ proofToken });
    } finally {
      container.hidden = true;
      container.replaceChildren();
    }
  }
  if (resource.protectCheck) throw new Error("Security check failed");
  return resource;
}

// New emails get a sign-up instead of a sign-in; both verify with an emailed code.
export async function sendCode(email: string, protectContainer: HTMLElement): Promise<PendingAuth> {
  try {
    const signIn = await passProtectCheck(
      await clerk.client!.signIn.create({ identifier: email }),
      protectContainer,
    );
    const factor = signIn.supportedFirstFactors?.find((f: any) => f.strategy === "email_code");
    if (!factor) throw new Error("Email code sign-in isn't enabled");
    await signIn.prepareFirstFactor({
      strategy: "email_code",
      emailAddressId: factor.emailAddressId,
    });
    return { mode: "signIn", resource: signIn };
  } catch (err: any) {
    if (err?.errors?.[0]?.code !== "form_identifier_not_found") throw err;
    const signUp = await passProtectCheck(
      await clerk.client!.signUp.create({ emailAddress: email }),
      protectContainer,
    );
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    return { mode: "signUp", resource: signUp };
  }
}

export async function verifyCode(
  pending: PendingAuth,
  code: string,
  protectContainer: HTMLElement,
): Promise<string> {
  const result = await passProtectCheck(
    pending.mode === "signIn"
      ? await pending.resource.attemptFirstFactor({ strategy: "email_code", code })
      : await pending.resource.attemptEmailAddressVerification({ code }),
    protectContainer,
  );
  if (result.status !== "complete") throw new Error("Couldn't sign in");
  return result.createdSessionId as string;
}
