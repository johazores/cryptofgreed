"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import WalletButton from "@/components/wallet-button";
import { Skull } from "lucide-react";
import Modal from "@/components/modal";
import Auth from "@/components/auth";

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

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-1">
                <div className="relative w-8 h-8">
                  <Skull className="w-full h-full object-contain text-primary" />
                </div>
                <span className="text-xl font-semibold text-primary">
                  Crypt of Greed
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                {session && <WalletButton />}
                <Button
                  onClick={handleAuthAction}
                  isLoading={status === "loading"}
                  size="sm"
                >
                  {session ? "Logout" : "Login"}
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 
                  hover:bg-gray-100 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {session && (
                <>
                  <div className="px-3 py-2">
                    <WalletButton />
                  </div>
                </>
              )}

              <Button
                onClick={() => {
                  if (session) {
                    handleAuthAction();
                  } else {
                    setIsAuthModalOpen(true);
                  }
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                isLoading={status === "loading"}
                fullWidth
                className="justify-start"
              >
                {session ? "Logout" : "Login"}
              </Button>
            </div>
          </div>
        )}
      </nav>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        maxWidth="md"
      >
        <div className="p-6">
          <Auth onSuccess={() => setIsAuthModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
