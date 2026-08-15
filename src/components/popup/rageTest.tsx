'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { rageCheck } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";
import {
  openChatAfterSpecialRoll,
  SpecialRollFrame,
  specialRollActionButtonClass,
  specialRollLabelClass,
  specialRollValueClass,
} from "./specialRollShared";

export default function RageTest() {
  const {
    email,
    dataSheet,
    sessionId,
    sheetId,
    session,
    setShowMessage,
    setShowRageTest,
    setShowMenuSession,
    setOptionSelect,
  } = useContext(contexto);

  const closePopup = () => {
    setShowRageTest(false);
  };

  const updateValueAfterRageCheck = async (value: number) => {
    const dataPersist = dataSheet.data.rage;
    dataSheet.data.rage = value;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Furia do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${dataPersist} para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const rollDices = async () => {
    const rage = await rageCheck(session.typeSession, sessionId, email, sheetId, setShowMessage, dataSheet);
    await updateValueAfterRageCheck(rage);
    closePopup();
    openChatAfterSpecialRoll(setOptionSelect, setShowMenuSession);
  };

  return (
    <SpecialRollFrame
      title="Checagem de Fúria"
      description=""
      onClose={closePopup}
    >
      <div className="flex flex-col items-center">
        <label htmlFor="rage-dice-pool" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Parada de Dados</p>
          <div id="rage-dice-pool" className={specialRollValueClass}>
            1
          </div>
        </label>
        <label htmlFor="rage-current-value" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Furia Atual</p>
          <div id="rage-current-value" className={specialRollValueClass}>
            {dataSheet?.data?.rage ?? 0}
          </div>
        </label>
        <button
          type="button"
          className={`${specialRollActionButtonClass} bg-black text-white hover:border-red-800`}
          onClick={rollDices}
        >
          Realizar o teste
        </button>
      </div>
    </SpecialRollFrame>
  );
}
