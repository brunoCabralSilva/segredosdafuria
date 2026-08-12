import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function ResistToxin() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [type, setType] = useState<number>(0);
  const { sessionId, session,sheetId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setOptionSelect, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = 0;
    pool = Number(dataSheet.data.glory) + Number(dataSheet.data.attributes.manipulation);
    let rage = Number(dataSheet.data.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;
    const roll = rollTest(rage, pool, penaltyOrBonus, dificulty);
    return roll;
  }

  const rollRage = async () => {
    const roll = await rollTestOfUser();
    if (type === 1) {
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift,  results: roll }, email, setShowMessage);
    } else {
      if (dataSheet.data.rage >= 1) {
      const rageTest = await calculateRageCheck(session.typeSession, sheetId, setShowMessage);
      dataSheet.data.rage = rageTest?.rage;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      await registerMessage(
        sessionId,
        {
          type: 'gift',
          ...showGiftRoll.gift,
          roll: 'rage-with-test',
          rageResults: rageTest,
          results: roll,
        },
        email,
        setShowMessage);
      } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
    }
  }

  return(
    <div className="w-full">
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Selecione a Condição</p>
        <select
          className="h-8 w-full cursor-pointer border border-white/10 bg-black/70 px-2 text-center font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-red-700/70"
          value={type}
          onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => setType(Number(e.target.value)) }
        >
          <option
            className="text-center text-black"
            value={ 0 }
            disabled
          >
            Escolha uma Condição
          </option>
          <option
            value={ 1 }
            className="bg-black text-center text-white"
          >
            Garou resistindo quando um teste normalmente não é permitido
          </option>
          <option
            value={ 2 }
            className="bg-black text-center text-white"
          >
            Garou resistindo a entorpecentes simples usando o Dom ativamente
          </option>
        </select>
      </label>
      {
        type !== 0 && type !== 3 &&
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
      }
      {
        type !== 0 && type !== 3 &&
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">Dificuldade do Teste</p>
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
      }
      {
        type !== 0 &&
        <button
          className="mt-3 w-full border border-white/20 bg-black px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-colors cursor-pointer hover:border-red-800"
          onClick={ () => {
            rollRage();
            setShowGiftRoll({ show: false, gift: {} });
            setOptionSelect('chat');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('session:open-action-result'));
            }
          }}
        >
          Ativar Dom
        </button>
      }
    </div>
  )
}
