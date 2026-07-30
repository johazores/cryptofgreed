import type { Card as CardType } from "@/lib/cards";
import { Shield, Sparkles, Sword } from "lucide-react";

interface CardProps {
  card: CardType;
  index: number;
  currentEnergy: number;
  onClick: (index: number) => void;
  disabled?: boolean;
}

const typeConfig = {
  ATTACK: {
    icon: Sword,
    label: "Attack",
    className:
      "border-red-400/35 bg-gradient-to-b from-red-950 to-slate-950 hover:border-red-300/70",
    badge: "bg-red-400/15 text-red-200",
  },
  SKILL: {
    icon: Shield,
    label: "Skill",
    className:
      "border-sky-400/35 bg-gradient-to-b from-sky-950 to-slate-950 hover:border-sky-300/70",
    badge: "bg-sky-400/15 text-sky-200",
  },
  POWER: {
    icon: Sparkles,
    label: "Power",
    className:
      "border-violet-400/35 bg-gradient-to-b from-violet-950 to-slate-950 hover:border-violet-300/70",
    badge: "bg-violet-400/15 text-violet-200",
  },
} as const;

export default function Card({
  card,
  index,
  currentEnergy,
  onClick,
  disabled = false,
}: CardProps) {
  const isPlayable = !disabled && card.energy <= currentEnergy;
  const config = typeConfig[card.type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      disabled={!isPlayable}
      aria-label={`${card.name}. Costs ${card.energy} energy. ${card.description}`}
      className={`group relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border p-3 text-left text-white shadow-lg transition duration-200 sm:h-48 sm:w-36 ${config.className} ${
        isPlayable
          ? "hover:-translate-y-2 hover:shadow-2xl focus-visible:-translate-y-1"
          : "cursor-not-allowed opacity-45 grayscale-[0.2]"
      } focus-visible:ring-4 focus-visible:ring-amber-300/40 focus-visible:outline-none`}
    >
      <span className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full border border-sky-200/30 bg-sky-500 font-bold text-white shadow-md">
        {card.energy}
      </span>

      <span
        className={`absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold tracking-wide uppercase ${config.badge}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {config.label}
      </span>

      <div className="flex h-full flex-col pt-10">
        <h3 className="font-medievalsharp text-base leading-tight sm:text-lg">
          {card.name}
        </h3>
        <div className="my-3 h-px bg-white/15" />
        <p className="text-xs leading-5 text-slate-200 sm:text-sm">
          {card.description}
        </p>
        <div className="mt-auto text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
          Play card
        </div>
      </div>

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 to-white/5 opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}
