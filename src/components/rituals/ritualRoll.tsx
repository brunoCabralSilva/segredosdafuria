'use client'
import { useContext } from "react";
import contexto from "@/context/context";
import RitualsMechanic from "./ritualsMechanic";
import { SpecialRollFrame } from "../popup/specialRollShared";

export default function RitualRoll() {
  const { showRitualRoll, setShowRitualRoll } = useContext(contexto);

  return (
    <SpecialRollFrame
      title={showRitualRoll.ritual.titlePtBr}
      description=""
      onClose={() => setShowRitualRoll({ show: false, ritual: {} })}
    >
      <div className="flex flex-col gap-3">
        {showRitualRoll.ritual.cost && (
          <div className="border-b border-white/5 pb-2 font-geist-mono text-[10px] leading-5 text-white/78">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Custo:</span>
            <span>{showRitualRoll.ritual.cost}</span>
          </div>
        )}
        {showRitualRoll.ritual.pool && (
          <div className="border-b border-white/5 pb-2 font-geist-mono text-[10px] leading-5 text-white/78">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Teste:</span>
            <span>{showRitualRoll.ritual.pool}</span>
          </div>
        )}
        <div className="font-geist-mono text-[10px] leading-5 text-white/78">
          <span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span>
          <span>{showRitualRoll.ritual.systemPtBr === '' ? showRitualRoll.ritual.descriptionPtBr : showRitualRoll.ritual.systemPtBr}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <RitualsMechanic title={showRitualRoll.ritual.title} />
        </div>
      </div>
    </SpecialRollFrame>
  );
}
