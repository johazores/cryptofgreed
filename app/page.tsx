import LoginButton from "@/components/login-button";
import {
  GiCrownedSkull,
  GiTreasureMap,
  GiCardPlay,
  GiChest,
  GiCrossedSwords,
  GiScrollUnfurled,
} from "react-icons/gi";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <GiCrownedSkull className="h-32 w-32 text-primary animate-float" />
            </div>
            <h1 className="font-medievalsharp text-7xl font-bold mb-6 text-gray-900">
              Crypt of <span className="text-primary">Greed</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Embark on an epic roguelike card adventure where every decision
              shapes your destiny. Battle monsters, collect treasures, and forge
              your legacy in the depths of the crypt.
            </p>
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-medievalsharp text-4xl text-gray-900 mb-4">
              Begin Your Adventure
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <GiCardPlay className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl text-gray-900 mb-4">
                Strategic Combat
              </h3>
              <p className="text-gray-600">
                Master unique card combinations and build powerful decks to
                overcome challenging encounters.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <GiTreasureMap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl text-gray-900 mb-4">
                Dynamic Adventures
              </h3>
              <p className="text-gray-600">
                Every run is unique with procedurally generated dungeons and
                diverse enemy encounters.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <GiChest className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl text-gray-900 mb-4">
                NFT Integration
              </h3>
              <p className="text-gray-600">
                Turn your achievements and rare items into NFTs on the Core DAO
                blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-medievalsharp text-4xl text-primary mb-2">
                1000+
              </div>
              <div className="text-gray-600">Unique Cards</div>
            </div>
            <div>
              <div className="font-medievalsharp text-4xl text-primary mb-2">
                50+
              </div>
              <div className="text-gray-600">Boss Encounters</div>
            </div>
            <div>
              <div className="font-medievalsharp text-4xl text-primary mb-2">
                3
              </div>
              <div className="text-gray-600">Character Classes</div>
            </div>
            <div>
              <div className="font-medievalsharp text-4xl text-primary mb-2">
                ∞
              </div>
              <div className="text-gray-600">Possible Builds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p>
              © {new Date().getFullYear()} Crypt of Greed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
