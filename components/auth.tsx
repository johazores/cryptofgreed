"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import TextField from "@/components/textfield";
import Loader from "@/components/ui/loader";
import { Skull } from "lucide-react";
import { Mail, Lock } from "lucide-react";

type AuthMode = "login" | "register";

interface AuthProps {
  onSuccess?: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
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

  // Handle successful login
  useEffect(() => {
    if (session) {
      onSuccess?.();
      router.push("/dashboard");
    }
  }, [session, router, onSuccess]);

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
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Skull className="w-full h-full object-contain text-primary animate-float" />
            </div>
          </div>
          <h2 className="text-4xl font-medievalsharp font-bold text-center">
            {mode === "login"
              ? "Welcome Back, Adventurer"
              : "Create New Account"}
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            {mode === "login"
              ? "Return to your quest in the Crypt of Greed"
              : "Begin your journey into the depths"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              required
              fullWidth
              startIcon={<Mail className="w-5 h-5" />}
            />

            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              fullWidth
              startIcon={<Lock className="w-5 h-5" />}
              minLength={6}
            />
          </div>

          <div>
            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              size="lg"
              className="font-medievalsharp text-lg"
            >
              {mode === "login" ? "Enter the Crypt" : "Begin Your Journey"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === "login"
                    ? "New to Crypt of Greed?"
                    : "Already have an account?"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="mt-4 text-primary hover:text-primary-dark transition-colors"
            >
              {mode === "login"
                ? "Create your account"
                : "Sign in to your account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
