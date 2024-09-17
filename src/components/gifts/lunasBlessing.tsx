import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function LunasBlessing() {
  const {
    sessionId,
    email,
    dataSheet,
    showGiftRoll, setShowGiftRoll,
    returnSheetValues,
    setShowMenuSession,
  } = useContext(contexto);

  const rollRage = async () => {
    const rageTest = await calculateRageCheck(sessionId, email);
    dataSheet.rage = rageTest?.rage;
    await updateDataPlayer(sessionId, email, dataSheet);
    await registerMessage(
      sessionId,
      {
        type: 'gift',
        ...showGiftRoll.gift,
        roll: 'rage',
        rageResults: rageTest,
      },
      email);
    returnSheetValues();
  }

  const rollDice = async () => {
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
            window.alert(`Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).`);
          }
        }
      }
    } else window.alert('Você não possui Fúria suficiente para ativar este Dom.');
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