import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";

export function TheHowlCarries() {
  const [marked, setMarked] = useState(false);
  const { sessionId, session, email, sheetId, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setOptionSelect, setShowMessage } = useContext(contexto);

  const rollRage = async () => {
    const rageTest = await calculateRageCheck(session.typeSession, sheetId, setShowMessage);
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

  const discountWillpower = async() => {
    if (marked) {
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
    } else {
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
        <span>Marque se deseja que o efeito pode seja limitado à zona de proteção ao redor do caern onde possa estar (Será realizado um Teste de Fúria)</span>
      </label>
      <button
        className="mt-3 w-full border border-white/20 bg-black px-2.5 py-2 font-geist-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-colors cursor-pointer hover:border-red-800"
        onClick={ () => {
          discountWillpower();
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
