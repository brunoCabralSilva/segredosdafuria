import contexto from "@/context/context";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function WindClaws() {
  const { sheetId, sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const discountWillpower = async() => {
    if (dataSheet.data.form !== 'Crinos') {
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
    } 
    await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
  }

  return(
    <div className="w-full">
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