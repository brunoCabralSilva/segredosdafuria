import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function LunasBlessing() {
  const {
    sessionId,
    email,
    sheetId,
    dataSheet,
    setShowMessage,
    showGiftRoll, setShowGiftRoll,
    setShowMenuSession,
  } = useContext(contexto);

  const rollRage = async () => {
    const rageTest = await calculateRageCheck(sheetId, setShowMessage);
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
  }

  const rollDice = async () => {
    if (dataSheet.data.rage >= 1) {
      let agravatedValue = false;
      const actualWillpower = dataSheet.data.attributes.resolve + dataSheet.data.attributes.composure - dataSheet.data.willpower.length;
      if (actualWillpower < 0) agravatedValue =  true;
      if (dataSheet.data.willpower.length === 0) {
        if (agravatedValue) {
          dataSheet.data.willpower.push({ value: 1, agravated: true });
          rollRage();
        } else {
          dataSheet.data.willpower.push({ value: 1, agravated: false });
          rollRage();
        }
      } else {
        const resolveComposure = dataSheet.data.attributes.resolve + dataSheet.data.attributes.composure;
        const agravated = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
        const superficial = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
        const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
        const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
        if (missingInBoth.length > 0) {
          const smallestNumber = Math.min(...missingInBoth);
          if (agravatedValue) {
            dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
            rollRage();
          } else {
            dataSheet.data.willpower.push({ value: smallestNumber, agravated: false });
            rollRage();
          }
        } else {
          const missingInAgravated = allValues.filter(value => !agravated.includes(value));
          if (missingInAgravated.length > 0) {
            const smallestNumber = Math.min(...missingInAgravated);
            dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
            rollRage();
          } else {
            setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).' });
          }
        }
      }
    } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
  }
  
  return(
    <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          rollDice();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
  )
}