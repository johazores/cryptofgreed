"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import WalletButton from "@/components/wallet-button";
import { Skull } from "lucide-react";
import Modal from "@/components/modal";
import Auth from "@/components/auth";
import UserAvatar from "./user-avatar";

type MenuItem = {
  label: string;
  href: string;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    ...(session
      ? [
          {
            label: "Wallet & NFTs",
            href: "/dashboard/wallet",
          },
        ]
      : []),
  ];

  const handleAuthAction = async () => {
    if (session) {
      await signOut({ redirect: false });
      router.push("/");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Add useEffect to handle auth modal trigger
  useEffect(() => {
    const handleAuthModalTrigger = () => {
      setIsAuthModalOpen(true)
    }

    window.addEventListener('openAuthModal', handleAuthModalTrigger)
    return () => {
      window.removeEventListener('openAuthModal', handleAuthModalTrigger)
    }
  }, [])

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/skull.svg" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold text-gray-900">Crypt of Greed</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/wallet" className="text-gray-600 hover:text-gray-900">
                Wallet & NFTs
              </Link>
            </div>

            {/* Right Side - Auth & Profile */}
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <WalletButton />
                  <UserAvatar />
                </>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} maxWidth="lg">
        <div className="p-6">
          <Auth onSuccess={() => setIsAuthModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
