import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function RgOrWpWithConditionInRoll(
  props: {
    type: string,
    attribute: string,
    renown: string,
    dificulty: number,
    textDificulty: string,
    condition: string,
    skill?: string,
  }
) {
  const { type, attribute, skill, renown, dificulty: dif, textDificulty, condition } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(dif);
  const [marked, setMarked] = useState(false);
  const { sessionId, email, dataSheet, showGiftRoll, sheetId, setShowGiftRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = 0;
    if (skill !== '' && skill !== undefined) pool += Number(dataSheet.data.skills[skill].value);
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
      let roll = null;
      if (marked) roll = await rollTestOfUser();
      const rageTest = await calculateRageCheck(sheetId, setShowMessage);
      dataSheet.data.rage = rageTest?.rage;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      if (marked) {
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift, roll:  'rage-with-test', rageResults: rageTest, results: roll }, email, setShowMessage);
      } else {
        await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift, roll: 'rage', rageResults: rageTest }, email, setShowMessage);
      }
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
    if (marked) {
      const roll = await rollTestOfUser();
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift, roll: 'willpower', results: roll }, email, setShowMessage);
    } else await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
  }

  return(
    <div className="w-full">
      <label
        htmlFor="checkboxReflexive"
        className="pb-5 w-full text-white flex items-start cursor-pointer">
        <input
          type="checkbox"
          id="checkboxReflexive"
          className="mr-2 mt-1"
          checked={marked}
          onChange={ (e: any) => setMarked(e.target.checked) }
        />
        <span>{ condition }</span>
      </label>
      {
        marked &&
        <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Penalidade (-) ou Bônus (+) para o teste</p>
          <div className="flex w-full">
            <div
              className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
              }}
            >
              <FaMinus />
            </div>
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
            <div
              className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
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
        marked &&
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">{textDificulty === '' ? 'Dificuldade do Teste' : textDificulty }</p>
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
                else if (e.target.value >= 0) setDificulty(Number(e.target.value));
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
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          if (type === 'willpower') discountWillpower();
          else rollRage();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}