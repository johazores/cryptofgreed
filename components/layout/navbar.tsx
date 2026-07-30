"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Auth from "@/components/auth/auth-form";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import UserAvatar from "./user-avatar";

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const openAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener("openAuthModal", openAuthModal);
    return () => window.removeEventListener("openAuthModal", openAuthModal);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const links = session
    ? [{ href: "/dashboard", label: "Dashboard" }, ...publicLinks]
    : publicLinks;

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              href={session ? "/dashboard" : "/"}
              className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
            >
              <Image
                src="/skull.svg"
                alt=""
                width={34}
                height={34}
                priority
              />
              <span className="truncate font-medievalsharp text-xl font-bold text-slate-950 sm:text-2xl">
                Crypt of Greed
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {session ? (
                <UserAvatar />
              ) : (
                <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  Sign in
                </Button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label={
                  isMobileMenuOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={isMobileMenuOpen}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-3 py-3 shadow-lg md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {links.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        maxWidth="lg"
        ariaLabel="Sign in or create an account"
        showCloseButton
      >
        <Auth onSuccess={() => setIsAuthModalOpen(false)} />
      </Modal>
    </>
  );
}
