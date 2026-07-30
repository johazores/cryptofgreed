import type { Metadata } from "next";
import { Compass, Landmark, Swords } from "lucide-react";

export const metadata: Metadata = {
  title: "About - Crypt of Greed",
  description:
    "Learn about Crypt of Greed, an early turn-based deckbuilding roguelite prototype built around a bank-or-risk Greed mechanic.",
};

const pillars = [
  {
    title: "Readable combat",
    description:
      "Enemy intent, energy, block, and card effects should make every turn understandable before the player commits.",
    icon: Swords,
  },
  {
    title: "Meaningful paths",
    description:
      "Battles, rest sites, merchants, and events should change the run instead of acting as disconnected screens.",
    icon: Compass,
  },
  {
    title: "Greed with consequences",
    description:
      "The defining goal is a fair decision between securing treasure and risking it for a stronger outcome.",
    icon: Landmark,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,#30202a_0%,#111217_38%,#f4f1ea_38%)] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-black/30 p-6 text-center text-white shadow-2xl backdrop-blur sm:p-10">
          <p className="text-xs font-bold tracking-[0.22em] text-amber-200/70 uppercase">
            Early gameplay prototype
          </p>
          <h1 className="mt-3 font-medievalsharp text-5xl sm:text-6xl">
            About Crypt of Greed
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Crypt of Greed is being developed as a premium deckbuilding roguelite.
            The prototype exists to prove one central idea: knowing when to secure
            what you have and when to risk one more dangerous room.
          </p>
        </header>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {pillars.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-medievalsharp text-2xl text-slate-950">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Current direction
          </p>
          <h2 className="mt-2 font-medievalsharp text-3xl text-slate-950 sm:text-4xl">
            Prove the game before scaling it
          </h2>
          <div className="mt-4 grid gap-6 text-sm leading-6 text-slate-600 md:grid-cols-2">
            <p>
              The browser build currently validates combat, character progression,
              room selection, equipment, revival, onboarding, and responsive UI.
              Run persistence and the full Greed loop are the next major systems.
            </p>
            <p>
              Blockchain wallets, NFT custody, and pay-to-earn mechanics are not
              part of the active product direction. Public claims and source code
              are kept aligned with what the prototype actually supports.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
