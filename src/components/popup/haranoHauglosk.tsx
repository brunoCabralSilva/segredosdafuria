'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { haranoHaugloskCheck } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import {
  openChatAfterSpecialRoll,
  SpecialRollFrame,
  specialRollActionButtonClass,
  specialRollCounterButtonClass,
  specialRollDisabledCounterButtonClass,
  specialRollLabelClass,
  specialRollValueClass,
} from "./specialRollShared";

export default function HaranoHauglosk(props: { type: string }) {
  const { type } = props;
  const [haranoHauglosk, setHaranoHauglosk] = useState<number>(1);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    sessionId,
    dataSheet,
    sheetId,
    setOptionSelect,
    setShowHauglosk,
    setShowHarano,
    setShowMenuSession,
    setShowMessage,
  } = useContext(contexto);

  useEffect(() => {
    if (Number(dataSheet.data.harano) + Number(dataSheet.data.hauglosk) === 0) {
      setHaranoHauglosk(1);
    } else {
      setHaranoHauglosk(Number(dataSheet.data.harano) + Number(dataSheet.data.hauglosk));
    }
  }, [dataSheet.data.harano, dataSheet.data.hauglosk]);

  const closePopup = () => {
    setShowHauglosk(false);
    setShowHarano(false);
  };

  const rollDices = async () => {
    const typeEdited = type.toLocaleLowerCase();
    dataSheet.data[typeEdited] = await haranoHaugloskCheck(sessionId, typeEdited, dataSheet, dificulty, '', setShowMessage);
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    closePopup();
    openChatAfterSpecialRoll(setOptionSelect, setShowMenuSession);
  };

  return (
    <SpecialRollFrame
      title={`Checagem de ${type}`}
      description=""
      onClose={closePopup}
    >
      <div className="flex flex-col items-center">
        <label htmlFor="shadow-pool" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Parada de Dados</p>
          <div id="shadow-pool" className={specialRollValueClass}>
            {haranoHauglosk}
          </div>
        </label>
        <label htmlFor="shadow-dificulty" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Dificuldade da Checagem</p>
          <div className="flex w-full">
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${dificulty === 1 ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (dificulty > 1) setDificulty(dificulty - 1);
              }}
            >
              <FaMinus />
            </button>
            <div id="shadow-dificulty" className={specialRollValueClass}>
              {dificulty}
            </div>
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${dificulty === 15 ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (dificulty < 15) setDificulty(dificulty + 1);
              }}
            >
              <FaPlus />
            </button>
          </div>
        </label>
        <button
          type="button"
          className={`${specialRollActionButtonClass} ${dificulty <= 0 ? 'bg-gray-500 text-black' : 'bg-black text-white hover:border-red-800'}`}
          onClick={rollDices}
          disabled={dificulty <= 0}
        >
          Realizar o teste
        </button>
      </div>
    </SpecialRollFrame>
  );
}
