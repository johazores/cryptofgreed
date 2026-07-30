"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";

export default function UserAvatar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!session?.user) return null;

  const displayName = session.user.name || session.user.email || "Adventurer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {initial || <User className="h-4 w-4" aria-hidden="true" />}
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="border-b border-slate-200 p-4">
            <p className="truncate font-semibold text-slate-950">{displayName}</p>
            {session.user.name && session.user.email && (
              <p className="mt-1 truncate text-sm text-slate-500">{session.user.email}</p>
            )}
          </div>
          <div className="p-2">
            <MenuLink href="/dashboard" icon={LayoutDashboard} onClick={() => setIsOpen(false)}>
              Dashboard
            </MenuLink>
            <MenuLink href="/settings" icon={Settings} onClick={() => setIsOpen(false)}>
              Settings
            </MenuLink>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-200 focus-visible:outline-none"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: typeof Settings;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
