
import contexto from "@/context/context";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { useContext } from "react";

export function SimpleTest() {
  const { sessionId, email, showRitualRoll, setShowRitualRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const roll = async () => {
    await registerMessage(sessionId, { ...showRitualRoll.ritual, type: 'ritual', }, email, setShowMessage);;
  }

  return(
    <div className="w-full">
      <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          roll();
          setShowMenuSession('');
          setShowRitualRoll({ show: false, ritual: {} });
        }}
      >
        Evocar Ritual
      </button>
    </div>
  )
}