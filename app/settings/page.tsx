"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import TextField from "@/components/textfield";
import { User, Mail, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  // Update form data when session changes
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || ""
      });
    }
  }, [session?.user?.name, session?.user?.email]); // Watch specific properties

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();

      // Save email to localStorage
      localStorage.setItem('userEmail', formData.email);

      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
        }
      });

      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));

      // Force a router refresh to update all components
      router.refresh();

      toast.success(data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-medievalsharp font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            startIcon={<Mail className="w-5 w-5" />}
            fullWidth
          />

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full md:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 