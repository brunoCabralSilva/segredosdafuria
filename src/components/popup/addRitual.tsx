'use client'
import { useContext } from "react";
import dataRituals from '../../data/rituals.json';
import contexto from "@/context/context";
import { resolveRitualEntries } from "@/firebase/utilities";
import Ritual from "../menuSession/ritual";
import ManageCollectionFrame from "./manageCollectionFrame";

export default function AddRitual() {
  const { dataSheet, setShowRitualsToAdd } = useContext(contexto);

  const selectedRituals = Array.isArray(dataSheet?.data?.rituals) ? resolveRitualEntries(dataSheet.data.rituals) : [];

  return (
    <ManageCollectionFrame
      title="Rituais"
      description="Gerencie os rituais disponíveis e vinculados ao personagem ativo usando o mesmo fluxo visual dos dons."
      onClose={() => setShowRitualsToAdd(false)}
      sidebar={(
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-4 pb-10">
          <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="font-kingthings text-base uppercase tracking-[0.18em] text-white">Rituais Adicionados</p>
              <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
                Itens atualmente vinculados à ficha
              </p>
            </div>
            <span className="border border-red-950 bg-red-950 px-2 py-1 font-geist-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              {selectedRituals.length}
            </span>
          </div>
          <div className="mt-4 space-y-2.5 pb-10">
            {selectedRituals.length === 0 ? (
              <div className="border border-white/10 bg-black/45 px-4 py-5 text-center font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
                Nenhum ritual adicionado.
              </div>
            ) : (
              selectedRituals.map((item: any, index: number) => (
                <div key={`${item.id}-${index}`} className="border border-red-700/60 bg-black/55 px-4 py-3 shadow-[0_0_20px_rgba(127,29,29,0.16)]">
                  <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">{item.titlePtBr}</p>
                  <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.1em] text-white/55">{item.title}</p>
                  <p className="mt-2 font-geist-mono text-[10px] leading-5 text-white/72">{item.type}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    >
      <div className="grid h-full grid-rows-[auto,minmax(0,1fr)] gap-4 overflow-hidden">
        <div className="border border-white/10 bg-black/45 px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Rituais disponíveis</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">{dataRituals.length}</p>
            </div>
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Rituais adicionados</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">{selectedRituals.length}</p>
            </div>
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Seleção atual</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">Personagem ativo</p>
            </div>
          </div>
        </div>
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-3 pb-10 sm:p-4 sm:pb-10">
          <div className="space-y-3 pb-10">
            {dataRituals.map((ritual: any, index: number) => (
              <div key={`${ritual.id}-${index}`}>
                <Ritual ritual={ritual} index={index} length={dataRituals.length} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ManageCollectionFrame>
  );
}
