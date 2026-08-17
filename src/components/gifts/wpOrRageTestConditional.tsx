import contexto from "@/context/context";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";

export function WpOrRageTestConditional(props: { type: string, condition: string }) {
  const { condition } = props;
  const [marked, setMarked] = useState(false);
  const { sessionId, email, sheetId, dataSheet, showGiftRoll, setShowGiftRoll, setOptionSelect, setShowMessage } = useContext(contexto);

  const discountWillpower = async() => {
    if (marked) {
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
            setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados posí­veis).' });
          }
        }
      }
      updateDataPlayer(sheetId, dataSheet, setShowMessage);
    }
    await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
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
