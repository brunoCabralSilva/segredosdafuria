import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function RazorClaws() {
  const { sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollRage = async () => {
    if (dataSheet.form !== "Crinos") {
      if (dataSheet.rage >= 1) {
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
      } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
    } else {
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email, setShowMessage);
    }
  }

  return(
    <div className="w-full">
      <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          rollRage();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}