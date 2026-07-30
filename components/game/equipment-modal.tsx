import type { Character } from "@/types/character";
import { PackageOpen, Sparkles } from "lucide-react";
import Modal from "@/components/ui/modal";

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

export default function EquipmentModal({
  isOpen,
  onClose,
  character,
}: EquipmentModalProps) {
  const equippedItems = character.equipment || [];
  const powers = character.powers || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      ariaLabel="Equipment and powers"
      showCloseButton
    >
      <div className="p-5 sm:p-7">
        <div className="pr-10">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Loadout
          </p>
          <h2 className="mt-1 font-medievalsharp text-3xl text-slate-950">
            Equipment & Powers
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            One item can be equipped in each slot. Buying a new item replaces the
            current item in that slot.
          </p>
        </div>

        <section className="mt-7">
          <h3 className="font-medievalsharp text-xl text-slate-900">Equipment</h3>
          {equippedItems.length === 0 ? (
            <EmptyState
              icon={<PackageOpen className="h-6 w-6" aria-hidden="true" />}
              title="No equipment yet"
              description="Visit a merchant room to purchase your first item."
            />
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {equippedItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-950">{item.name}</h4>
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-700 uppercase">
                      {item.slot}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(item.stats).map(([stat, value]) => (
                      <span
                        key={stat}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 capitalize"
                      >
                        {stat} +{value}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-7 border-t border-slate-200 pt-6">
          <h3 className="font-medievalsharp text-xl text-slate-900">Powers</h3>
          {powers.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
              title="No powers discovered"
              description="Future run rewards will appear here."
            />
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {powers.map((power) => (
                <article
                  key={power.id}
                  className="rounded-xl border border-violet-200 bg-violet-50 p-4"
                >
                  <h4 className="font-semibold text-violet-950">{power.name}</h4>
                  <p className="mt-1 text-sm text-violet-800">
                    {power.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-600">
      <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">{icon}</div>
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
