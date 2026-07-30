"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gem, Skull, Sparkles, Trophy } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "victory" | "defeat";
  rewards?: {
    gold: number;
    experience: number;
    floor: number;
  };
  onRevive?: () => void | Promise<void>;
  onNextFloor?: () => void | Promise<void>;
  crystalCost?: number;
  userCrystals?: number;
}

export default function GameModal({
  isOpen,
  onClose,
  type,
  rewards,
  onRevive,
  onNextFloor,
  crystalCost,
  userCrystals,
}: GameModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const canAffordRevive =
    crystalCost !== undefined &&
    userCrystals !== undefined &&
    userCrystals >= crystalCost;

  const handleContinue = async () => {
    if (!onNextFloor || isProcessing) return;
    setIsProcessing(true);

    try {
      await onNextFloor();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevive = async () => {
    if (!onRevive || !canAffordRevive || isProcessing) return;
    setIsProcessing(true);

    try {
      await onRevive();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      ariaLabel={type === "victory" ? "Victory rewards" : "Defeat options"}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      <div className="p-5 sm:p-7">
        <div className="text-center">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
              type === "victory"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {type === "victory" ? (
              <Trophy className="h-7 w-7" aria-hidden="true" />
            ) : (
              <Skull className="h-7 w-7" aria-hidden="true" />
            )}
          </div>
          <p className="mt-4 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
            {type === "victory" ? "Encounter cleared" : "Run interrupted"}
          </p>
          <h2
            className={`mt-1 font-medievalsharp text-4xl ${
              type === "victory" ? "text-amber-900" : "text-red-800"
            }`}
          >
            {type === "victory" ? "Victory" : "Defeat"}
          </h2>
        </div>

        {type === "victory" && rewards && (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <RewardStat icon={Coins} label="Gold" value={`+${rewards.gold}`} />
            <RewardStat
              icon={Sparkles}
              label="Experience"
              value={`+${rewards.experience}`}
            />
            <RewardStat icon={Trophy} label="Floor" value={rewards.floor} />
          </div>
        )}

        {type === "defeat" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-semibold text-red-900">
                Your character has fallen in battle.
              </p>
              <p className="mt-1 text-sm leading-6 text-red-800/75">
                Revival restores full health and deducts crystals on the server.
              </p>
            </div>

            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-violet-900">
                  <Gem className="h-5 w-5" aria-hidden="true" />
                  <span className="font-semibold">Revival cost</span>
                </div>
                <span className="font-bold tabular-nums text-violet-950">
                  {crystalCost ?? 0}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-violet-800">
                <span>Your balance</span>
                <span className="font-semibold tabular-nums">
                  {userCrystals ?? 0}
                </span>
              </div>

              <Button
                className="mt-4"
                fullWidth
                onClick={handleRevive}
                disabled={!canAffordRevive}
                isLoading={isProcessing}
                loadingLabel="Reviving..."
              >
                {canAffordRevive
                  ? "Revive at full health"
                  : "Not enough crystals"}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {type === "victory" ? (
            <Button
              fullWidth
              size="lg"
              onClick={handleContinue}
              isLoading={isProcessing}
              loadingLabel="Opening the next path..."
            >
              Choose the next path
            </Button>
          ) : (
            <Button
              fullWidth
              size="lg"
              variant="outline"
              disabled={isProcessing}
              onClick={() => {
                router.push("/dashboard");
                onClose();
              }}
            >
              Return to dashboard
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function RewardStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
      <Icon className="mx-auto h-5 w-5 text-amber-800" aria-hidden="true" />
      <p className="mt-1 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-bold text-amber-950 tabular-nums">{value}</p>
    </div>
  );
}
