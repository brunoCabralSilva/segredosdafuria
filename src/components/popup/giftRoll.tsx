'use client'
import { useContext } from "react";
import contexto from "@/context/context";
import GiftsMechanic from "../gifts/giftsMechanic";

export default function GiftRoll() {
  const { showGiftRoll } =  useContext(contexto);

  return(
    <div className="w-full bg-black flex flex-col items-center h-80vh z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-xl font-bold">Dom:  { showGiftRoll.gift.giftPtBr }</p>
      </label>
      {
        showGiftRoll.gift.cost &&
        <label className="w-full flex flex-col items-center">
          <p className="text-white w-full pb-1 text-justify">
            <span className="pr-2 font-bold">Custo:</span>
            { showGiftRoll.gift.cost }
          </p>
        </label>
      }
      {
        showGiftRoll.gift.pool &&
        <label className="w-full flex flex-col items-center">
          <p className="text-white w-full pb-1 text-justify">
            <span className="pr-2 font-bold">Teste:</span>
            { showGiftRoll.gift.pool }
          </p>
        </label>
      }
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-justify">
          <span className="pr-2 font-bold">Sistema:</span>
          { showGiftRoll.gift.systemPtBr }
        </p>
      </label>
      <GiftsMechanic name={showGiftRoll.gift.gift} />
    </div>
  );
}