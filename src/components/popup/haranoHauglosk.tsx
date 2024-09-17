'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { haranoHaugloskCheck } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";

export default function HaranoHauglosk(props: { type: string }) {
  const { type } = props;
  const [haranoHauglosk, setHaranoHauglosk] = useState<number>(1);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    email,
    sessionId,
    dataSheet,
    setShowHauglosk,
    setShowHarano,
    setShowMenuSession,
    returnSheetValues,
  } =  useContext(contexto);

  useEffect(() => {
    if (Number(dataSheet.harano) + Number(dataSheet.hauglosk) === 0)
      setHaranoHauglosk(1);
    else
      setHaranoHauglosk(Number(dataSheet.harano) + Number(dataSheet.hauglosk));
  });

  const rollDices = async () => {
    const typeEdited = type.toLocaleLowerCase();
    dataSheet[typeEdited] = await haranoHaugloskCheck(sessionId, typeEdited, dataSheet, dificulty);
    await updateDataPlayer(sessionId, email, dataSheet);
    returnSheetValues();
    setShowHauglosk(false);
    setShowHarano(false);
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-xl mb-5 font-bold">Teste de { type }</p>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Parada de Dados</p>
        <div className="flex w-full">
          <div
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaMinus />
          </div>
          <div
            id="dices"
            className="p-2 bg-white text-center text-black w-full"
          >
            {haranoHauglosk}
          </div>
          <div
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
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
      <button
        className={`${dificulty <= 0 ? 'text-black bg-gray-400' : 'text-white bg-black hover:border-red-800' } border-2 border-white  transition-colors cursor-pointer w-full p-2 mt-6 font-bold`}
        onClick={ rollDices }
        disabled={ dificulty <= 0 }
      >
        Rolar dados
      </button>
    </div>
  );
}