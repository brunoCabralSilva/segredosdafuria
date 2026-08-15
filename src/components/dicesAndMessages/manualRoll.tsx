import contexto from "@/context/context";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerManualRoll } from "@/firebase/messagesAndRolls";
import { openChatAfterSpecialRoll } from "../popup/specialRollShared";

export default function ManualRoll() {
	const [valueOfRage, setValueOfRage] = useState<number>(0);
  const [valueOf, setValueOf] = useState<number>(0);
  const [totalDices, setTotalDices] = useState<number>(1);
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
	const { setShowMenuSession, sessionId, setShowMessage, setOptionSelect } = useContext(contexto);

	const disableRoll = () => {
    return dificulty <= 0 &&  valueOf <= 0 && penaltyOrBonus === 0;
  }

	const rollDices = async () => {
    await registerManualRoll(sessionId, valueOfRage, (totalDices - valueOfRage), penaltyOrBonus, dificulty, setShowMessage);
    openChatAfterSpecialRoll(setOptionSelect, setShowMenuSession);
  };

  return(
    <div className="flex h-full min-h-0 w-full flex-col items-center overflow-y-auto bg-transparent">
      <label htmlFor="valueOf" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Quantidade de Dados Totais:</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ totalDices === 1 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (totalDices > 1) {
                setTotalDices(totalDices - 1);
                if (totalDices - 1 < valueOfRage)
                  setValueOfRage(totalDices - 1);
              }
            }}
          >
            <FaMinus />
          </button>
          <div
            id="totalDices"
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 50)) setTotalDices(50);
              else if (e.target.value >= 0) setTotalDices(Number(e.target.value));
              else setTotalDices(0);
            }}
          >
            {totalDices}
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ totalDices === 50 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (totalDices < 50) {
                setTotalDices(totalDices + 1);
                if (totalDices + 1 < valueOfRage)
                  setValueOfRage(totalDices + 1);
              }
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="valueOf" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Dentre estes, quantos são de Fúria?</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ valueOfRage === 0 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (valueOfRage > 0) setValueOfRage(valueOfRage - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="valueOfRage"
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 50)) setValueOfRage(50);
              else if (e.target.value >= 0) setValueOfRage(Number(e.target.value));
              else setValueOfRage(0);
            }}
          >
            {valueOfRage}
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ (valueOfRage === 5 || valueOfRage === totalDices) ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (valueOfRage < totalDices) setValueOfRage(valueOfRage + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Penalidade (-) ou Bônus (+) para o teste</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </button>
          <div
            id="penaltyOrBonus"
            className="flex h-8 w-full items-center justify-center appearance-none bg-white px-2 text-center text-[11px] font-semibold text-black"
            onChange={(e: any) => {
              if (Number(e.target.value) < 0 && Number(e.target.value) < -50) setPenaltyOrBonus(-50);
              else setPenaltyOrBonus(Number(e.target.value))
            }}
          >
            {penaltyOrBonus}
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-3 flex w-full flex-col items-center">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Dificuldade da Checagem</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 0 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="dificulty"
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setDificulty(15);
              else if (e.target.value >= 0) setDificulty(Number(e.target.value));
              else setValueOf(0);
            }}
          >
            {dificulty}
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 15 ? 'bg-gray-500 text-black' : 'bg-black/70 text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <button
        className={`${disableRoll() ? 'bg-gray-500 text-black' : 'bg-black text-white hover:border-red-800' } mt-3 w-full border border-white/20 px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer`}
        onClick={ rollDices }
        disabled={ disableRoll() }
      >
        Rolar dados
      </button>
    </div>
  );
}