import contexto from "@/context/context";
import { calculateRageChecks, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export function SpiritOfTheFray() {
  const [dificulty, setDificulty] = useState(1);
  const {
    sessionId,
    email,
    session,
    sheetId,
    dataSheet,
    setShowMessage,
    showGiftRoll, setShowGiftRoll,
    setShowMenuSession,
    setOptionSelect,
  } = useContext(contexto);

  const rollRage = async () => {
    if (dataSheet.data.rage >= dificulty) {
      const rageTest = await calculateRageChecks(session.typeSession, sheetId, dificulty, setShowMessage);
      dataSheet.data.rage = rageTest?.rage;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      await registerMessage(
        sessionId,
        {
          type: 'gift',
          ...showGiftRoll.gift,
          roll: 'rage',
          rageResults: rageTest,
        },
        email,
        setShowMessage);
    } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
  }

  return(
    <div>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Número de Alvos:</p>
        <div className="flex w-full">
          <div
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </div>
          <div
            id="dificulty"
            className="flex h-8 w-full items-center justify-center bg-white px-2 text-center text-[11px] font-semibold text-black"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setDificulty(15);
              else if (e.target.value >= 0) setDificulty(Number(e.target.value));
            }}
          >
            {dificulty}
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty < dataSheet.data.glory) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <button
        className="mt-3 w-full border border-white/20 bg-black px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-colors cursor-pointer hover:border-red-800"
        onClick={ () => {
          rollRage();
          setShowGiftRoll({ show: false, gift: {} });
          setOptionSelect('chat');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('session:open-chat'));
          }
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}
