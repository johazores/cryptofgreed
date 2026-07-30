import LoginButton from "@/components/auth/login-button";
import {
  GiCardPlay,
  GiChest,
  GiCrownedSkull,
  GiTreasureMap,
} from "react-icons/gi";

const features = [
  {
    title: "Turn-Based Combat",
    description:
      "Read enemy intent, manage limited energy, and sequence attack and defense cards each turn.",
    icon: GiCardPlay,
  },
  {
    title: "Choose Your Path",
    description:
      "Move between battles, rest sites, shops, and events while the run structure is being expanded.",
    icon: GiTreasureMap,
  },
  {
    title: "Greed System in Development",
    description:
      "The next major milestone introduces the choice to bank treasure safely or risk it for stronger rewards.",
    icon: GiChest,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-6 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
              Early gameplay prototype
            </span>
            <div className="mb-8 flex justify-center">
              <GiCrownedSkull className="text-primary h-32 w-32 animate-float" />
            </div>
            <h1 className="mb-6 font-medievalsharp text-6xl font-bold text-gray-900 md:text-7xl">
              Crypt of <span className="text-primary">Greed</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
              A turn-based deckbuilding roguelite prototype where the long-term
              goal is simple: decide when to secure your treasure and when greed
              is worth one more dangerous room.
            </p>
            <LoginButton />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-medievalsharp text-4xl text-gray-900">
              Current Game Direction
            </h2>
            <div className="bg-primary mx-auto h-1 w-24" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl bg-white p-8 shadow-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 flex justify-center">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Icon className="text-primary h-12 w-12" />
                  </div>
                </div>
                <h3 className="mb-4 font-medievalsharp text-2xl text-gray-900">
                  {title}
                </h3>
                <p className="text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-medievalsharp text-3xl text-gray-900">
            What Is Playable Today
          </h2>
          <p className="text-lg text-gray-600">
            The prototype currently includes three character styles, four room
            types, starter decks, enemy intents, turn-based battles, floor
            progression, and basic rewards. The complete run-building and Greed
            loops are the next development focus.
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Crypt of Greed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
