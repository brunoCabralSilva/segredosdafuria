import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function HungryTeeth() {
  const { sheetId, session, sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setOptionSelect, setShowMessage } = useContext(contexto);

  const rollRage = async () => {
    if (dataSheet.data.form !== "Crinos") {
      if (dataSheet.data.rage >= 1) {
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
      } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
    } else {
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
    }
  }

  return(
    <div className="w-full">
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
    </div>
  )
}
