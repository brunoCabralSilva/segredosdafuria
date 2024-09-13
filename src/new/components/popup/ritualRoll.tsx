'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { haranoHaugloskCheck } from "@/new/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/new/firebase/players";

export default function RitualRoll() {
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    email,
    sessionId,
    dataSheet,
    setShowMenuSession,
    returnSheetValues,
    showRitualRoll,
  } =  useContext(contexto);

  useEffect(() => {
    console.log(showRitualRoll.ritual);
  }, []);

  const rollDices = async () => {
    const typeEdited = '';
    dataSheet[typeEdited] = await haranoHaugloskCheck(sessionId, typeEdited, dataSheet, dificulty);
    await updateDataPlayer(sessionId, email, dataSheet);
    returnSheetValues();
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
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
      {
        showRitualRoll.ritual.pool !== "" &&
        <label htmlFor="dificulty" className="flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Dificuldade do Teste</p>
          <div className="flex w-full">
            <div
              className={`border border-white p-3 cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (dificulty > 0) setDificulty(dificulty - 1);
              }}
            >
              <FaMinus />
            </div>
            <div
              id="dificulty"
              className="p-2 bg-white text-center text-black w-full"
              onChange={ (e: any) => {
                if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setDificulty(15);
                else setDificulty(Number(e.target.value));
              }}
            >
              {dificulty}
            </div>
            <div
              className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (dificulty < 15) setDificulty(dificulty + 1)
              }}
            >
              <FaPlus />
            </div>
          </div>
        </label>
      }
      <button
        className={`${dificulty <= 0 ? 'text-black bg-gray-400' : 'text-white bg-black hover:border-red-800' } border-2 border-white  transition-colors cursor-pointer w-full p-2 mt-6 font-bold`}
        onClick={ rollDices }
        disabled={ dificulty <= 0 }
      >
        Evocar
      </button>
    </div>
  );
}