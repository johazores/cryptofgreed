"use client";
import { useState } from "react";
import { useCharacter } from "@/context/character-context";

interface EventProps {
  onContinue: () => void;
}

export default function Event({ onContinue }: EventProps) {
  const { character } = useCharacter();
  const [event, setEvent] = useState(generateRandomEvent());
  const [eventCompleted, setEventCompleted] = useState(false);

  function generateRandomEvent() {
    return {
      title: "Mysterious Shrine",
      description: "You encounter a mysterious shrine...",
      options: [
        {
          text: "Make an offering",
          outcome: "Gain a blessing but lose some gold",
        },
        {
          text: "Leave it alone",
          outcome: "Continue safely",
        },
      ],
    };
  }

  const handleOptionSelect = (optionIndex: number) => {
    setEventCompleted(true);
    setTimeout(onContinue, 1500);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medievalsharp mb-4">{event.title}</h2>
      <p className="mb-4">{event.description}</p>
      <div className="space-y-2">
        {!eventCompleted &&
          event.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className="w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg"
            >
              {option.text}
            </button>
          ))}
        {eventCompleted && (
          <button
            onClick={onContinue}
            className="w-full p-4 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Continue to Next Floor
          </button>
        )}
      </div>
    </div>
  );
}
