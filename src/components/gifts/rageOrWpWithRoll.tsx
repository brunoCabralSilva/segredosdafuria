import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function RageOrWpWithRoll(
  props: {
    type: string,
    attribute: string,
    skill: string,
    renown: string,
    dificulty: number,
    textDificulty: string,
  }
) {
  const { type, attribute, renown, dificulty: dif, textDificulty } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(dif);
  const { sessionId, session, sheetId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setOptionSelect, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = 0;
    if (renown !== '') pool += Number(dataSheet.data[renown]);
    if (attribute !== '') pool += Number(dataSheet.data.attributes[attribute]);
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
      const roll = await rollTestOfUser();
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

  const discountWillpower = async() => {
    let agravatedValue = false;
    const actualWillpower = dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length;
    if (actualWillpower < 0) agravatedValue =  true;
    if (dataSheet.data.willpower.length === 0) {
      if (agravatedValue) dataSheet.data.willpower.push({ value: 1, agravated: true });
      else dataSheet.data.willpower.push({ value: 1, agravated: false });
    } else {
      const resolveComposure = dataSheet.data.attributes.resolve + dataSheet.data.attributes.composure;
      const agravated = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
      const superficial = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
      const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
      const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
      if (missingInBoth.length > 0) {
        const smallestNumber = Math.min(...missingInBoth);
        if (agravatedValue) dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
        else dataSheet.data.willpower.push({ value: smallestNumber, agravated: false });
      } else {
        const missingInAgravated = allValues.filter(value => !agravated.includes(value));
        if (missingInAgravated.length > 0) {
          const smallestNumber = Math.min(...missingInAgravated);
          dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
        } else {
          setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).' });
        }
      }
    }
    updateDataPlayer(sheetId, dataSheet, setShowMessage);
    const roll = await rollTestOfUser();
    await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift, roll: 'willpower', results: roll }, email, setShowMessage);
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
        <p className="w-full pb-1.5 font-geist-mono text-[10px] uppercase tracking-[0.08em] text-white/78">{textDificulty === '' ? 'Dificuldade da Checagem' : textDificulty }</p>
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
          if (type === 'willpower') discountWillpower();
          else rollRage();
          setShowGiftRoll({ show: false, gift: {} });
          setOptionSelect('chat');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('session:open-action-result'));
          }
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}
