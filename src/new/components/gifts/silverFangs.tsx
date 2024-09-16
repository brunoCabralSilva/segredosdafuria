import contexto from "@/context/context";
import { calculateRageCheck, registerMessage } from "@/new/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/new/firebase/players";
import { useContext } from "react";

export function SilverFangs() {
  const { sessionId, email, dataSheet, showGiftRoll, setShowGiftRoll, returnSheetValues, setShowMenuSession, } = useContext(contexto);

  const rollRage = async () => {
    if (dataSheet.form !== "Crinos") {
      if (dataSheet.rage >= 1) {
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
      } else window.alert('Você não possui Fúria suficiente para ativar este Dom.');
    } else {
      await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email);
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