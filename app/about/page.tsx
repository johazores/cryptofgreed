import React from "react";
import { Metadata } from "next";
import {
  GiCrownedSkull,
  GiScrollUnfurled,
  GiTeamDowngrade,
} from "react-icons/gi";

export const metadata: Metadata = {
  title: "About - Crypt of Greed",
  description:
    "Learn about Crypt of Greed, a roguelike card game with NFT integration built on Core DAO blockchain.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-medievalsharp text-5xl font-bold text-gray-900 mb-8">
              About <span className="text-primary">Crypt of Greed</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the story behind the most immersive blockchain-powered
              roguelike card game.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <GiScrollUnfurled className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl font-bold text-gray-900 mb-4">
                Our Story
              </h3>
              <p className="text-gray-600">
                Born from a passion for roguelike games and blockchain
                technology, Crypt of Greed combines classic dungeon crawling
                with modern NFT integration.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <GiCrownedSkull className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                We aim to create an engaging gaming experience where every
                achievement and rare item holds real value through blockchain
                technology.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <GiTeamDowngrade className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="font-medievalsharp text-2xl font-bold text-gray-900 mb-4">
                Our Team
              </h3>
              <p className="text-gray-600">
                A dedicated group of gamers, developers, and blockchain
                enthusiasts working together to bring this unique gaming
                experience to life.
              </p>
            </div>
          </div>

          <div className="mt-20 bg-gray-50 rounded-2xl p-8 lg:p-12">
            <h2 className="font-medievalsharp text-3xl font-bold text-gray-900 mb-6 text-center">
              Built on Core DAO
            </h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto">
              Leveraging the power of Core DAO blockchain, we provide a seamless
              gaming experience with true ownership of in-game assets through
              NFTs, all while maintaining low transaction costs and high
              performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
