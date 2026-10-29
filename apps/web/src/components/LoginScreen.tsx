import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputOTP,
  Label,
  Spinner,
  Typography,
} from "@heroui/react";
import LoopLogo from "./LoopLogo";
import ThemeToggle from "./ThemeToggle";
import {
  clerkMessage,
  passProtectCheck,
  sendCode,
  verifyCode,
  type PendingAuth,
} from "../lib/auth";
import { clerk } from "../lib/convex";

interface LoginScreenProps {
  onSignedIn: () => void;
}

export default function LoginScreen({ onSignedIn }: LoginScreenProps) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const pending = useRef<PendingAuth | null>(null);
  const protectContainer = useRef<HTMLDivElement>(null);

  const submitEmail = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email");
      return;
    }
    setBusy(true);
    setError("");
    try {
      pending.current = await sendCode(value, protectContainer.current!);
      setSentTo(value);
      setStep("code");
      setCode("");
    } catch (err) {
      setError(clerkMessage(err, "Couldn't send code"));
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (value: string) => {
    if (!pending.current || value.length !== 6) return;
    setBusy(true);
    setError("");
    try {
      const sessionId = await verifyCode(pending.current, value, protectContainer.current!);
      await clerk.setActive({ session: sessionId });
      onSignedIn();
    } catch (err) {
      setError(clerkMessage(err, "Wrong code"));
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center bg-[var(--background)] p-6">
      <ThemeToggle className="absolute top-4 right-4" />
      <Card className="w-full max-w-[400px] p-8">
        <Card.Content className="flex flex-col items-center gap-1">
          <LoopLogo variant="wordmark" className="h-16" />
          <Typography color="muted" className="mb-4 text-sm">
            {step === "email" ? "Sign in with email" : `Code sent to ${sentTo}`}
          </Typography>

          {step === "email" ? (
            <Form
              className="flex w-full flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitEmail();
              }}
            >
              <Label htmlFor="login-email" className="sr-only">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />
              <Button type="submit" fullWidth isPending={busy}>
                {busy ? <Spinner size="sm" /> : "Continue"}
              </Button>
            </Form>
          ) : (
            <div className="flex w-full flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={submitCode}
                aria-label="Code"
              >
                <InputOTP.Group>
                  <InputOTP.Slot index={0} />
                  <InputOTP.Slot index={1} />
                  <InputOTP.Slot index={2} />
                  <InputOTP.Slot index={3} />
                  <InputOTP.Slot index={4} />
                  <InputOTP.Slot index={5} />
                </InputOTP.Group>
              </InputOTP>
              <Button
                fullWidth
                isPending={busy}
                onPress={() => submitCode(code)}
                isDisabled={code.length !== 6}
              >
                {busy ? <Spinner size="sm" /> : "Sign in"}
              </Button>
              <Button
                fullWidth
                variant="outline"
                onPress={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
              >
                Back
              </Button>
            </div>
          )}

          {error && (
            <Alert status="danger" className="mt-3 w-full">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <div ref={protectContainer} hidden />

          <Typography color="muted" className="mt-6 text-xs">
            made by startup club
          </Typography>
        </Card.Content>
      </Card>
    </div>
  );
}
