import React from "react";
import { Card as CardType } from "@/lib/cards";
import { cn } from "@/lib/utils"
import { Shield, Sword } from "lucide-react"

interface CardProps {
  card: CardType;
  index: number;
  currentEnergy: number;
  onClick: (index: number) => void;
}

// Icons for different card types
const typeIcons = {
  ATTACK: <Sword className="h-4 w-4 text-red-400" />,
  SKILL: <Shield className="h-4 w-4 text-blue-400" />,
  POWER: <span className="text-xs text-purple-400">★</span>,
}

const cardStyles = {
  ATTACK: "border-red-700 bg-gradient-to-b from-red-900/90 to-red-950/90 hover:from-red-800/90 hover:to-red-900/90",
  SKILL:
    "border-blue-700 bg-gradient-to-b from-blue-900/90 to-blue-950/90 hover:from-blue-800/90 hover:to-blue-900/90",
  POWER:
    "border-purple-700 bg-gradient-to-b from-purple-900/90 to-purple-950/90 hover:from-purple-800/90 hover:to-purple-900/90",
}

const Card = ({ card, index, currentEnergy, onClick }: CardProps) => {
  const isPlayable = card.energy <= currentEnergy;

  return (
    <div
      onClick={() => onClick(index)}
      className={`
        flex-shrink-0 p-2 md:p-4 rounded-lg shadow-md border border-gray-200 
        w-24 md:w-32 h-full cursor-pointer 
        transform transition-all duration-200 hover:-translate-y-2
        ${isPlayable ? "hover:shadow-xl" : "opacity-50"}
        ${card.type === "ATTACK" ? cardStyles.ATTACK : card.type === "SKILL" ? cardStyles.SKILL : "bg-purple-500/10"}
      `}
    >
      {/* Energy Cost */}
      <div className="absolute top-2 left-2 flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm shadow-md border border-blue-500">
        <span
          className={`text-xs font-bold text-white ${
            !isPlayable && "text-red-200"
          }`}
        >
          {card.energy}
        </span>
      </div>

      <div className="pt-6 pb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-bold text-white">{card.name}</h3>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800/60 border border-gray-700/50">
            {typeIcons[card.type]}
          </div>
        </div>

        <div className="text-sm text-white mb-1">{card.type}</div>

        <div className="text-xs text-white border-t border-gray-200 pt-2 mt-1">{card.description}</div>
      </div>

      {/* Card glow effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          card.type === "ATTACK" ? "bg-red-500/10" : card.type === "SKILL" ? "bg-blue-500/10" : "bg-purple-500/10",
          "hover:opacity-100",
        )}
      />
    </div>
  );
};

export default Card;
