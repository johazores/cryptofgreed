"use client";
import { useState } from "react";
import { useCharacter } from "@/context/character-context";
import Button from "@/components/ui/button";
import { MdOutlineQuestionMark } from "react-icons/md";

interface EventProps {
  onContinue: () => void;
}

export default function Event({ onContinue }: EventProps) {
  const { character } = useCharacter();
  const [event, setEvent] = useState(generateRandomEvent());
  const [eventCompleted, setEventCompleted] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  function generateRandomEvent() {
    return {
      title: "Mysterious Shrine",
      description:
        "You encounter a mysterious shrine glowing with an otherworldly light. The air around it hums with ancient power.",
      options: [
        {
          text: "Make an offering",
          outcome:
            "The shrine accepts your offering. You feel blessed with renewed strength.",
        },
        {
          text: "Leave it alone",
          outcome: "You decide not to tempt fate and continue on your journey.",
        },
      ],
    };
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOutcome(event.options[optionIndex].outcome);
    setEventCompleted(true);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <MdOutlineQuestionMark className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-medievalsharp">{event.title}</h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-6">{event.description}</p>

          {!eventCompleted ? (
            <div className="space-y-3">
              {event.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  fullWidth
                  size="lg"
                  className="font-medievalsharp"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-lg text-gray-700 italic">{selectedOutcome}</p>
            </div>
          )}
        </div>

        {eventCompleted && (
          <Button
            onClick={onContinue}
            variant="primary"
            fullWidth
            size="lg"
            className="font-medievalsharp"
          >
            Continue to Next Floor
          </Button>
        )}
      </div>
    </div>
  );
}
