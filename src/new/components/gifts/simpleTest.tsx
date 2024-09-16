import contexto from "@/context/context";
import { registerMessage } from "@/new/firebase/messagesAndRolls";
import { useContext } from "react";

export function SimpleTest() {
  const { sessionId, email, showGiftRoll, setShowGiftRoll, returnSheetValues, setShowMenuSession, } = useContext(contexto);

  const roll = async () => {
    await registerMessage(sessionId, { type: 'gift', ...showGiftRoll.gift }, email);
    returnSheetValues();
  }

  return(
    <div className="w-full">
      <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          roll();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
    </div>
  )
}