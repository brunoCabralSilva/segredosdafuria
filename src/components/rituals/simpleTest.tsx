import contexto from "@/context/context";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { useContext } from "react";
import { openChatAfterSpecialRoll } from "../popup/specialRollShared";
import { ritualActionButtonClass } from "./ritualFieldShared";

export function SimpleTest() {
  const { sessionId, email, showRitualRoll, setShowRitualRoll, setShowMenuSession, setShowMessage, setOptionSelect } = useContext(contexto);

  const roll = async () => {
    await registerMessage(sessionId, { ...showRitualRoll.ritual, type: "ritual" }, email, setShowMessage);
  };

  return (
    <div className="w-full">
      <button
        className={ritualActionButtonClass}
        onClick={() => {
          roll();
          openChatAfterSpecialRoll(setOptionSelect, setShowMenuSession);
          setShowRitualRoll({ show: false, ritual: {} });
        }}
      >
        Evocar Ritual
      </button>
    </div>
  );
}