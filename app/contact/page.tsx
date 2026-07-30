import type { Metadata } from "next";
import { Mail, MessageSquare, User } from "lucide-react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import TextArea from "@/components/ui/text-area";
import TextField from "@/components/ui/text-field";

export const metadata: Metadata = {
  title: "Contact - Crypt of Greed",
  description:
    "Get in touch with the Crypt of Greed team. Connect with us on Discord and Twitter for updates and support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-8 font-medievalsharp text-5xl font-bold text-gray-900">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Have questions about Crypt of Greed? We&apos;re here to help!
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <form className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <TextField
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  placeholder="Enter your name"
                  required
                  fullWidth
                  startIcon={<User className="h-5 w-5" />}
                />

                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  required
                  fullWidth
                  startIcon={<Mail className="h-5 w-5" />}
                />
              </div>

              <TextArea
                id="message"
                name="message"
                label="Message"
                placeholder="Enter your message"
                required
                fullWidth
                rows={6}
                startIcon={<MessageSquare className="h-5 w-5" />}
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 font-medievalsharp text-white transition-colors duration-200 hover:bg-primary-dark"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="mt-20">
            <h2 className="mb-12 text-center font-medievalsharp text-3xl font-bold">
              Connect With Us
            </h2>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
              <a
                href="https://discord.gg/cryptofgreed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 transition-colors duration-200 hover:bg-gray-100"
              >
                <FaDiscord className="h-8 w-8 text-primary" />
                <span className="font-medievalsharp text-xl">Join our Discord</span>
              </a>
              <a
                href="https://twitter.com/cryptofgreed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 transition-colors duration-200 hover:bg-gray-100"
              >
                <FaTwitter className="h-8 w-8 text-primary" />
                <span className="font-medievalsharp text-xl">Follow on Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
