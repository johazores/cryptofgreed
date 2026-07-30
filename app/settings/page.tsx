"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Mail, Save, User } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import TextField from "@/components/textfield";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!session?.user) return;
    setFormData({
      name: session.user.name || "",
      email: session.user.email || "",
    });
  }, [session?.user]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-sm font-semibold text-slate-300">
        Loading settings...
      </div>
    );
  }

  if (!session) redirect("/");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      await update({
        user: {
          ...session.user,
          name: data.user.name,
          email: data.user.email,
        },
      });
      router.refresh();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,#2d2027_0%,#111217_38%,#f4f1ea_38%)] px-3 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-3xl border border-white/10 bg-black/30 p-5 text-white shadow-2xl backdrop-blur sm:p-7">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <p className="mt-5 text-xs font-bold tracking-[0.2em] text-amber-200/70 uppercase">
            Account
          </p>
          <h1 className="mt-1 font-medievalsharp text-4xl sm:text-5xl">Settings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Update the name and email shown across your account.
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <User className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-medievalsharp text-3xl text-slate-950">Profile</h2>
              <p className="mt-1 text-sm text-slate-500">
                These changes affect sign-in and account display information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <TextField
              id="profile-name"
              name="name"
              label="Display name"
              value={formData.name}
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Adventurer"
              maxLength={50}
              fullWidth
              helperText="Optional. This name appears on your dashboard."
              startIcon={<User className="h-5 w-5" />}
            />
            <TextField
              id="profile-email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
              autoComplete="email"
              required
              fullWidth
              startIcon={<Mail className="h-5 w-5" />}
            />

            <div className="flex justify-end border-t border-slate-200 pt-5">
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                loadingLabel="Saving profile..."
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Save changes
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
