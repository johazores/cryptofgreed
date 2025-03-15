"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type AuthMode = "login" | "register";

export default function Auth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!mounted || status === "loading" || session) {
    return <Loader fullScreen className="h-8 w-8" />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Failed to register");
        }

        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        router.push("/dashboard");
      } else {
        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (response?.error) {
          throw new Error("Invalid credentials");
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg p-6 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold">
            {mode === "login" ? "Login to your account" : "Create new account"}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-600">{error}</div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border p-2"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border p-2"
                placeholder="Password"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <Button type="submit" isLoading={loading} fullWidth size="lg">
              {mode === "login" ? "Login" : "Register"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
