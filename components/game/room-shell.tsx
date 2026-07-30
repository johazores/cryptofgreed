"use client";

import type { ReactNode } from "react";
import CharacterStats from "./character-stats";
import { useCharacter } from "@/context/character-context";

interface RoomShellProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function RoomShell({
  icon,
  eyebrow,
  title,
  description,
  children,
}: RoomShellProps) {
  const { character } = useCharacter();

  if (!character) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,#25202a_0%,#101116_42%,#08090c_100%)] px-3 py-5 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-6">
        <header className="rounded-2xl border border-white/10 bg-black/25 p-4 shadow-xl backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-200 sm:h-14 sm:w-14">
                {icon}
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-amber-200/75 uppercase">
                  {eyebrow}
                </p>
                <h1 className="mt-1 font-medievalsharp text-3xl leading-tight sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  {description}
                </p>
              </div>
            </div>
            <div className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
              Floor {character.floor}
            </div>
          </div>
        </header>

        <CharacterStats character={character} />

        <main className="rounded-2xl border border-white/10 bg-white/[0.96] p-4 text-slate-900 shadow-2xl sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
