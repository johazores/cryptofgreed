import { AlertTriangle, Campfire, CircleHelp, ShoppingBag, Swords } from "lucide-react";
import Modal from "../modal";
import { RoomType, type RoomType as RoomTypeValue } from "@/lib/game/room-manager";

interface RoomOption {
  title: string;
  description: string;
  hint: string;
  icon: typeof Swords;
  tone: string;
}

interface RoomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomType: RoomTypeValue) => void;
  availableRooms: RoomTypeValue[];
  currentFloor?: number;
}

const roomOptions: Record<RoomTypeValue, RoomOption> = {
  [RoomType.BATTLE]: {
    title: "Battle",
    description: "Face an enemy and earn combat rewards.",
    hint: "High risk · Direct progress",
    icon: Swords,
    tone: "border-red-200 bg-red-50 text-red-800",
  },
  [RoomType.REST]: {
    title: "Rest Site",
    description: "Recover health or preserve your momentum.",
    hint: "Low risk · Recovery",
    icon: Campfire,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  [RoomType.SHOP]: {
    title: "Merchant",
    description: "Spend gold on a permanent equipment slot upgrade.",
    hint: "Preparation · Spend gold",
    icon: ShoppingBag,
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  [RoomType.EVENT]: {
    title: "Unknown Chamber",
    description: "Accept a visible bargain or walk away safely.",
    hint: "Variable risk · Choice",
    icon: CircleHelp,
    tone: "border-violet-200 bg-violet-50 text-violet-800",
  },
};

export default function RoomSelectionModal({
  isOpen,
  onClose,
  onSelectRoom,
  availableRooms,
  currentFloor = 1,
}: RoomSelectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      ariaLabel={`Choose a room for floor ${currentFloor}`}
      closeOnBackdrop={false}
      closeOnEscape={false}
    >
      <div className="p-5 sm:p-7">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.22em] text-primary uppercase">
            Floor {currentFloor}
          </p>
          <h2 className="mt-2 font-medievalsharp text-3xl text-slate-950 sm:text-4xl">
            Choose your path
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            Each room explains its likely value before you commit. You must choose
            one path to continue.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {availableRooms.map((roomType) => {
            const room = roomOptions[roomType];
            const Icon = room.icon;

            return (
              <button
                key={roomType}
                type="button"
                onClick={() => onSelectRoom(roomType)}
                className={`group rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none ${room.tone}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-white/70 p-3 shadow-sm">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <AlertTriangle
                    className="h-4 w-4 opacity-35 transition group-hover:opacity-65"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 font-medievalsharp text-2xl">{room.title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-80">
                  {room.description}
                </p>
                <p className="mt-4 text-[10px] font-bold tracking-[0.18em] uppercase opacity-65">
                  {room.hint}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
