"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";
import Modal from "@/components/modal";
import Auth from "@/components/auth";
import UserAvatar from "./user-avatar";

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const openAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener("openAuthModal", openAuthModal);
    return () => window.removeEventListener("openAuthModal", openAuthModal);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/skull.svg"
                alt="Crypt of Greed"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900">
                Crypt of Greed
              </span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <UserAvatar />
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-white"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        maxWidth="lg"
      >
        <div className="p-6">
          <Auth onSuccess={() => setIsAuthModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
