'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerWillpowerRoll } from "@/firebase/messagesAndRolls";

export default function WillpowerTest() {
  const [willpowerValue, setWillpowerValue] = useState<number>(1);
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    sessionId,
    dataSheet,
    setShowWillpowerTest,
    setShowMenuSession,
    setShowMessage,
  } =  useContext(contexto);

  useEffect(() => {
    setWillpowerValue(dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length);
  });

  const rollDices = async () => {
    const actualWillpower = dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length;
    await registerWillpowerRoll(sessionId, dataSheet.data.name, actualWillpower, penaltyOrBonus, dificulty, setShowMessage);
    setShowWillpowerTest(false);
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-80vh z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-xl mb-5 font-bold">Teste de Força de Vontade</p>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Parada de Dados</p>
        <div className="flex w-full">
          <button
            type="button"
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaMinus />
          </button>
          <div
            id="dices"
            className="p-2 bg-white text-center text-black w-full"
          >
            {willpowerValue}
          </div>
          <button
            type="button"
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Penalidade (-) ou Bônus (+) para o teste</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </button>
          <div
            id="penaltyOrBonus"
            className="p-2 text-center text-black bg-white w-full appearance-none"
            onChange={(e: any) => {
              if (Number(e.target.value) < 0 && Number(e.target.value) < -50) setPenaltyOrBonus(-50);
              else setPenaltyOrBonus(Number(e.target.value))
            }}
          >
            {penaltyOrBonus}
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dificuldade do Teste</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 1 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 1) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
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
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </button>
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