"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

type FightingStyle = "MELEE" | "RANGE" | "MAGIC";

const FIGHTING_STYLES: Record<FightingStyle, string> = {
  MELEE: "Close combat specialist with self-buffs and defensive abilities",
  RANGE: "Long-range fighter focusing on debuffs and status effects",
  MAGIC: "Spellcaster with powerful AOE and utility spells",
};

export default function CharacterCreation() {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<FightingStyle | null>(
    null
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          class: selectedClass,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create character"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl">
      <h2 className="font-medievalsharp text-3xl text-primary text-center mb-8">
        Create Your Champion
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-lg mb-3 font-medievalsharp">
            Champion Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-lg mb-3 font-medievalsharp">
            Choose Your Path
          </label>
          <div className="grid gap-4">
            {Object.entries(FIGHTING_STYLES).map(([style, description]) => (
              <div
                key={style}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedClass === style
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedClass(style as FightingStyle)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedClass === style
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {style === "MELEE" && (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    {style === "RANGE" && (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16m-7 6h7"
                        />
                      </svg>
                    )}
                    {style === "MAGIC" && (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medievalsharp text-xl mb-1">{style}</h3>
                    <p className="text-gray-600">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!name || !selectedClass || isLoading}
          isLoading={isLoading}
          className="w-full py-4 text-lg font-medievalsharp"
        >
          Begin Your Journey
        </Button>
      </form>
    </div>
  );
}
