import React from "react";
import { Card as CardType } from "@/lib/cards";

interface CardProps {
  card: CardType;
  index: number;
  currentEnergy: number;
  onClick: (index: number) => void;
}

const Card = ({ card, index, currentEnergy, onClick }: CardProps) => {
  const isPlayable = card.energy <= currentEnergy;

  return (
    <div
      onClick={() => onClick(index)}
      className={`
        flex-shrink-0 bg-white p-2 md:p-4 rounded-lg shadow-md border border-gray-200 
        w-24 md:w-32 h-full cursor-pointer 
        transform transition-all duration-200 hover:-translate-y-2
        ${isPlayable ? "hover:shadow-xl" : "opacity-50"}
      `}
    >
      {/* Energy Cost */}
      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span
          className={`text-xs font-bold text-white ${
            !isPlayable && "text-red-200"
          }`}
        >
          {card.energy}
        </span>
      </div>

      {/* Card Content */}
      <div className="h-full flex flex-col">
        {/* Card Name */}
        <div className="text-xs md:text-sm font-bold mb-1">{card.name}</div>

        {/* Card Type */}
        <div className="text-[8px] md:text-xs text-gray-500 mb-1">
          {card.type}
        </div>

        {/* Card Description */}
        <div className="text-[10px] md:text-xs text-gray-600 flex-grow">
          {card.description}
        </div>
      </div>
    </div>
  );
};

export default Card;
