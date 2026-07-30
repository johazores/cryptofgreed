"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Skull } from "lucide-react";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/text-field";

interface AuthProps {
  onSuccess?: () => void;
}

type AuthMode = "login" | "register";

export default function Auth({ onSuccess }: AuthProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    onSuccess?.();
  }, [session, onSuccess]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    try {
      if (mode === "register") {
        const registration = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!registration.ok) {
          throw new Error((await registration.text()) || "Failed to create account");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(
          mode === "login"
            ? "The email or password is incorrect"
            : "Account created, but automatic sign-in failed"
        );
      }

      onSuccess?.();
      router.push("/dashboard");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-64 items-center justify-center p-8 text-sm font-semibold text-slate-500">
        Checking your session...
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="bg-[radial-gradient(circle_at_top,#38232b_0%,#17151b_75%)] p-6 text-center text-white sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
          <Skull className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-bold tracking-[0.2em] text-amber-200/70 uppercase">
          {mode === "login" ? "Continue your run" : "Create a local account"}
        </p>
        <h2 className="mt-1 font-medievalsharp text-3xl sm:text-4xl">
          {mode === "login" ? "Welcome back" : "Enter the crypt"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-300">
          {mode === "login"
            ? "Sign in to access your characters and progression."
            : "Registration creates only a game account—no wallet or private key."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {error}
          </div>
        )}

        <TextField
          id="auth-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          fullWidth
          startIcon={<Mail className="h-5 w-5" />}
        />
        <TextField
          id="auth-password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
          fullWidth
          helperText={mode === "register" ? "Use at least 6 characters." : undefined}
          startIcon={<Lock className="h-5 w-5" />}
        />

        {mode === "register" && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            New accounts do not create custodial wallets or store blockchain keys.
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          loadingLabel={mode === "login" ? "Signing in..." : "Creating account..."}
          className="font-medievalsharp"
        >
          {mode === "login" ? "Enter the crypt" : "Create account"}
        </Button>

        <div className="border-t border-slate-200 pt-4 text-center">
          <p className="text-sm text-slate-500">
            {mode === "login" ? "New to Crypt of Greed?" : "Already have an account?"}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-1 text-primary"
            onClick={() => {
              setMode((current) => (current === "login" ? "register" : "login"));
              setError(null);
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </Button>
        </div>
      </form>
    </div>
  );
}
