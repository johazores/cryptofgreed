import React from "react";
import { Metadata } from "next";
import { GiScrollUnfurled, GiQuillInk } from "react-icons/gi";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import TextField from "@/components/textfield";
import TextArea from "@/components/textarea";
import { Mail, User, MessageSquare } from "lucide-react";

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-medievalsharp text-5xl font-bold text-gray-900 mb-8">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about Crypt of Greed? We&apos;re here to help!
            </p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
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
                  startIcon={<User className="w-5 h-5" />}
                />

                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  required
                  fullWidth
                  startIcon={<Mail className="w-5 h-5" />}
                />
              </div>

              <div>
                <TextArea
                  id="message"
                  name="message"
                  label="Message"
                  placeholder="Enter your message"
                  required
                  fullWidth
                  rows={6}
                  startIcon={<MessageSquare className="w-5 h-5" />}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medievalsharp py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="mt-20">
            <h2 className="font-medievalsharp text-3xl font-bold text-center mb-12">
              Connect With Us
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
              <a
                href="https://discord.gg/cryptofgreed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaDiscord className="h-8 w-8 text-primary" />
                <span className="font-medievalsharp text-xl">
                  Join our Discord
                </span>
              </a>
              <a
                href="https://twitter.com/cryptofgreed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <FaTwitter className="h-8 w-8 text-primary" />
                <span className="font-medievalsharp text-xl">
                  Follow on Twitter
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
