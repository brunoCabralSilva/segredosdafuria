import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function TheHowlCarries() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(2);
  const [marked, setMarked] = useState(false);
  const { sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollRage = async () => {
    const rageTest = await calculateRageCheck(sessionId, email, setShowMessage);
    dataSheet.rage = rageTest?.rage;
    await updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
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
  }

  const discountWillpower = async() => {
    if (marked) {
      if (dataSheet.rage >= 1) {
        let agravatedValue = false;
        const actualWillpower = dataSheet.attributes.resolve + dataSheet.attributes.composure - dataSheet.willpower.length;
        if (actualWillpower < 0) agravatedValue =  true;
        if (dataSheet.willpower.length === 0) {
          if (agravatedValue) {
            dataSheet.willpower.push({ value: 1, agravated: true });
            rollRage();
          } else {
            dataSheet.willpower.push({ value: 1, agravated: false });
            rollRage();
          }
        } else {
          const resolveComposure = dataSheet.attributes.resolve + dataSheet.attributes.composure;
          const agravated = dataSheet.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
          const superficial = dataSheet.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
          const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
          const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
          if (missingInBoth.length > 0) {
            const smallestNumber = Math.min(...missingInBoth);
            if (agravatedValue) {
              dataSheet.willpower.push({ value: smallestNumber, agravated: true });
              rollRage();
            } else {
              dataSheet.willpower.push({ value: smallestNumber, agravated: false });
              rollRage();
            }
          } else {
            const missingInAgravated = allValues.filter(value => !agravated.includes(value));
            if (missingInAgravated.length > 0) {
              const smallestNumber = Math.min(...missingInAgravated);
              dataSheet.willpower.push({ value: smallestNumber, agravated: true });
              rollRage();
            } else {
              setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).' });
            }
          }
        }
      } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
    } else {
      let agravatedValue = false;
      const actualWillpower = dataSheet.attributes.composure + dataSheet.attributes.resolve - dataSheet.willpower.length;
      if (actualWillpower < 0) agravatedValue =  true;
      if (dataSheet.willpower.length === 0) {
        if (agravatedValue) dataSheet.willpower.push({ value: 1, agravated: true });
        else dataSheet.willpower.push({ value: 1, agravated: false });
      } else {
        const resolveComposure = dataSheet.attributes.resolve + dataSheet.attributes.composure;
        const agravated = dataSheet.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
        const superficial = dataSheet.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
        const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
        const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
        if (missingInBoth.length > 0) {
          const smallestNumber = Math.min(...missingInBoth);
          if (agravatedValue) dataSheet.willpower.push({ value: smallestNumber, agravated: true });
          else dataSheet.willpower.push({ value: smallestNumber, agravated: false });
        } else {
          const missingInAgravated = allValues.filter(value => !agravated.includes(value));
          if (missingInAgravated.length > 0) {
            const smallestNumber = Math.min(...missingInAgravated);
            dataSheet.willpower.push({ value: smallestNumber, agravated: true });
          } else {
            setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).' });
          }
        }
      }
      updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
    }
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
        <span>Marque se deseja que o efeito pode seja limitado à zona de proteção ao redor do caern onde possa estar (Será realidado um Teste de Fúria)</span>
      </label>
      <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          discountWillpower();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}