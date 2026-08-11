import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function ClawsOfFrozenDeath() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const { session, sheetId, sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setOptionSelect, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = Number(dataSheet.data.attributes.wits) + Number(dataSheet.data.honor);
    let rage = Number(dataSheet.data.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;
    const roll = rollTest(rage, pool, penaltyOrBonus, dificulty);
    return roll;
  }

  const rollRage = async () => {
    if (dataSheet.data.rage >= 1) {
      let roll = await rollTestOfUser();
      if (dataSheet.data.form !== 'Crinos') {
        const rageTest = await calculateRageCheck(session.typeSession, sheetId, setShowMessage);
        dataSheet.data.rage = rageTest?.rage;
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift, roll: 'rage-with-test', rageResults: rageTest, results: roll }, email, setShowMessage);
      } else {
        await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
      }
    } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
  }

  return(
    <div className="w-full">
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Penalidade (-) ou Bônus (+) para o teste</p>
        <div className="flex w-full">
          <div
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </div>
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
          <div
            className={`flex h-8 w-8 items-center justify-center border border-white/15 text-[10px] cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Vigor + Sobrevivência, ou um valor imposto pelo Narrador).</p>
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
              if (dificulty < 15) setDificulty(dificulty + 1)
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
