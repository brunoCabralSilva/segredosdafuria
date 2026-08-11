import contexto from "@/context/context";
import { registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { useContext, useState } from "react";
import {
  RitualCounterField,
  ritualActionButtonClass,
  ritualDisabledActionButtonClass,
  ritualKnownParticipantsLabel,
  ritualParticipantsLabel,
  ritualPenaltyLabel,
  ritualSelectClass,
} from "./ritualFieldShared";

export function RiteOfPatronage() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(3);
  const [renown, setRenown] = useState("");
  const [numberOfPjs, setNumberOfPjs] = useState<number>(0);
  const [numberOfKnowPjs, setNumberOfKnowPjs] = useState<number>(0);
  const { sessionId, email, dataSheet, showRitualRoll, setShowRitualRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = dataSheet.data.skills.etiquette.value + dataSheet.data[renown];
    let rage = Number(dataSheet.data.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;
    const totalPool = pool + numberOfKnowPjs;
    const totalRage = rage + numberOfPjs;
    const roll = rollTest(totalRage, totalPool, penaltyOrBonus, dificulty);
    return roll;
  };

  const rollDices = async () => {
    const roll = await rollTestOfUser();
    await registerMessage(sessionId, { ...showRitualRoll.ritual, type: "ritual", results: roll }, email, setShowMessage);
  };

  return (
    <div className="w-full">
      <select onChange={(e) => setRenown(e.target.value)} value={renown} className={ritualSelectClass}>
        <option value="" disabled>Selecione um Renome</option>
        <option value="honor">Honra</option>
        <option value="glory">Glória</option>
        <option value="wisdom">Sabedoria</option>
      </select>
      <RitualCounterField
        label={ritualParticipantsLabel}
        value={numberOfPjs}
        decreaseDisabled={numberOfPjs === 0}
        increaseDisabled={numberOfPjs === 15}
        onDecrease={() => {
          if (numberOfPjs > 0) {
            const nextValue = numberOfPjs - 1;
            setNumberOfPjs(nextValue);
            if (numberOfKnowPjs > nextValue) {
              setNumberOfKnowPjs(nextValue);
            }
          }
        }}
        onIncrease={() => {
          if (numberOfPjs < 15) setNumberOfPjs(numberOfPjs + 1);
        }}
      />
      <RitualCounterField
        label={ritualKnownParticipantsLabel}
        value={numberOfKnowPjs}
        decreaseDisabled={numberOfKnowPjs === 0}
        increaseDisabled={numberOfKnowPjs === numberOfPjs}
        onDecrease={() => {
          if (numberOfKnowPjs > 0) setNumberOfKnowPjs(numberOfKnowPjs - 1);
        }}
        onIncrease={() => {
          if (numberOfKnowPjs < numberOfPjs) setNumberOfKnowPjs(numberOfKnowPjs + 1);
        }}
      />
      <RitualCounterField
        label="Dificuldade do teste"
        value={dificulty}
        decreaseDisabled={dificulty === 0}
        increaseDisabled={dificulty === 15}
        onDecrease={() => {
          if (dificulty > 0) setDificulty(dificulty - 1);
        }}
        onIncrease={() => {
          if (dificulty < 15) setDificulty(dificulty + 1);
        }}
      />
      <RitualCounterField
        label={ritualPenaltyLabel}
        value={penaltyOrBonus}
        decreaseDisabled={penaltyOrBonus === -50}
        increaseDisabled={penaltyOrBonus === 50}
        onDecrease={() => {
          if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1);
        }}
        onIncrease={() => {
          if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1);
        }}
      />
      <button
        className={`${ritualActionButtonClass} ${renown !== "" ? "" : ritualDisabledActionButtonClass}`}
        disabled={renown === ""}
        onClick={() => {
          rollDices();
          setShowMenuSession("");
          setShowRitualRoll({ show: false, ritual: {} });
        }}
      >
        Evocar Ritual
      </button>
    </div>
  );
}