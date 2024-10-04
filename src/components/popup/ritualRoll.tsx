'use client'
import { useContext } from "react";
import contexto from "@/context/context";
import RitualsMechanic from "../rituals/ritualsMechanic";

export default function RitualRoll() {
  const { showRitualRoll } =  useContext(contexto);
  return(
    <div className="w-full bg-black flex flex-col items-center h-80vh z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full flex flex-col items-center">
        <p className="text-white w-full pb-1 text-xl mb-3 font-bold">{ showRitualRoll.ritual.titlePtBr }</p>
      </label>
      {
        showRitualRoll.ritual.cost &&
        <label className="w-full flex flex-col items-center">
          <p className="text-white w-full pb-1 text-justify">
            <span className="pr-2 font-bold">Custo:</span>
            { showRitualRoll.ritual.cost }
          </p>
        </label>
      }
      {
        showRitualRoll.ritual.pool &&
        <label className="w-full flex flex-col items-center">
          <p className="text-white w-full pb-1 mb-2 text-justify">
            <span className="pr-2 font-bold">Teste:</span>
            { showRitualRoll.ritual.pool }
          </p>
        </label>
      }
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-justify">
          <span className="pr-2 font-bold">Sistema:</span>
          { showRitualRoll.ritual.systemPtBr === "" ? showRitualRoll.ritual.descriptionPtBr : showRitualRoll.ritual.systemPtBr }
        </p>
      </label>
      <RitualsMechanic title={showRitualRoll.ritual.title} />
    </div>
  );
}