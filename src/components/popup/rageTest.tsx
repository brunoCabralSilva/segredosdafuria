'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { calculateRageChecks, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useMemo, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import {
  openChatAfterSpecialRoll,
  SpecialRollFrame,
  specialRollActionButtonClass,
  specialRollCounterButtonClass,
  specialRollDisabledCounterButtonClass,
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
  const currentRage = Number(dataSheet?.data?.rage ?? 0);
  const [numberOfRageTests, setNumberOfRageTests] = useState(currentRage > 0 ? 1 : 0);
  const maxSelectableRage = useMemo(() => Math.max(0, currentRage), [currentRage]);

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
    if (numberOfRageTests <= 0) {
      setShowMessage({ show: true, text: 'Selecione ao menos um dado de Fúria para realizar a checagem.' });
      return;
    }

    const rageResults = await calculateRageChecks(session.typeSession, sheetId, numberOfRageTests, setShowMessage);
    if (!rageResults) return;

    await registerMessage(
      sessionId,
      {
        message: `Foi ${numberOfRageTests === 1 ? 'realizada uma Checagem' : 'realizado um conjunto de Checagens'} de Fúria para o personagem "${dataSheet.data.name}".`,
        rollOfRage: rageResults.rollOfRage,
        result: rageResults.result,
        rage: rageResults.rage,
        success: rageResults.success,
        user: dataSheet.user,
        type: 'rage-check',
      },
      email,
      setShowMessage,
    );

    await updateValueAfterRageCheck(rageResults.rage);
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
        <label htmlFor="rage-tests" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Número de Checagens de Fúria</p>
          <div className="flex w-full">
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${numberOfRageTests <= 1 ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (numberOfRageTests > 1) setNumberOfRageTests(numberOfRageTests - 1);
              }}
              disabled={numberOfRageTests <= 1}
            >
              <FaMinus />
            </button>
            <div id="rage-tests" className={specialRollValueClass}>
              {numberOfRageTests}
            </div>
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${numberOfRageTests >= maxSelectableRage ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (numberOfRageTests < maxSelectableRage) setNumberOfRageTests(numberOfRageTests + 1);
              }}
              disabled={numberOfRageTests >= maxSelectableRage}
            >
              <FaPlus />
            </button>
          </div>
        </label>
        <label htmlFor="rage-current-value" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Furia Atual</p>
          <div id="rage-current-value" className={specialRollValueClass}>
            {currentRage}
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
