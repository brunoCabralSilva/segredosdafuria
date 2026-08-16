import contexto from "@/context/context";
import { resolveRitualEntries } from "@/firebase/utilities";
import { useContext } from "react";
import AddRitual from "../popup/addRitual";
import RitualsAdded from "./ritualsAdded";

export default function Rituals() {
  const { dataSheet, showRitualsToAdd, setShowRitualsToAdd } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const rituals = Array.isArray(sheetData?.rituals) ? resolveRitualEntries(sheetData.rituals) : [];

  return (
    <section className="visage-card relative mt-2 sm:mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-slate-300 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.26em] text-red-500/85">Rituais</p>
        <button
          type="button"
          onClick={() => setShowRitualsToAdd(true)}
          className="sheet-readonly-action inline-flex items-center justify-center border border-red-950 bg-red-950 p-2 font-geist-mono text-[9px] uppercase transition-colors hover:bg-red-900 text-white"
          aria-label="Gerenciar Rituais"
        >
          Gerenciar
        </button>
      </div>
      <div className="mx-6 border-b border-white/10" />
      <div className="pb-4 pt-2">
        {rituals.map((item: any, index: number) => (
          <RitualsAdded key={`${item.id}-${index}`} ritual={item} />
        ))}
      </div>
      {showRitualsToAdd && <AddRitual />}
    </section>
  );
}
