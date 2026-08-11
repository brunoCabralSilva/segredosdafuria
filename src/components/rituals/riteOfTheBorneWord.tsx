import contexto from "@/context/context";
import { registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { useContext, useState } from "react";
import {
  RitualCounterField,
  ritualActionButtonClass,
  ritualCheckboxInputClass,
  ritualCheckboxLabelClass,
  ritualKnownParticipantsLabel,
  ritualParticipantsLabel,
  ritualPenaltyLabel,
} from "./ritualFieldShared";

export function RiteOfTheBorneWord() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [marked, setMarked] = useState(false);
  const [numberOfPjs, setNumberOfPjs] = useState<number>(0);
  const [numberOfKnowPjs, setNumberOfKnowPjs] = useState<number>(0);
  const { sessionId, email, dataSheet, showRitualRoll, setShowRitualRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = Number(dataSheet.data.skills.occult.etiquette) + Number(dataSheet.data.honor);
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

  const rollDice = async () => {
    if (marked) {
      await registerMessage(sessionId, { type: "ritual", ...showRitualRoll.ritual }, email, setShowMessage);
    } else {
      const roll = await rollTestOfUser();
      await registerMessage(sessionId, { type: "ritual", ...showRitualRoll.ritual, roll: "willpower", results: roll }, email, setShowMessage);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="checkboxReflexive" className={ritualCheckboxLabelClass}>
        <input
          type="checkbox"
          id="checkboxReflexive"
          className={ritualCheckboxInputClass}
          checked={marked}
          onChange={(e: any) => setMarked(e.target.checked)}
        />
        <span>Marque se o espírito for resistir ao seu Ritual. Espíritos em termos excepcionalmente bons com o mestre do Rito concedem um sucesso automático.</span>
      </label>
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
      {marked && (
        <RitualCounterField
          label="Dificuldade 3, ou mais alta, se o espírito for hostil."
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
      )}
      {marked && (
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
      )}
      <button
        className={ritualActionButtonClass}
        onClick={() => {
          rollDice();
          setShowMenuSession("");
          setShowRitualRoll({ show: false, ritual: {} });
        }}
      >
        Evocar Ritual
      </button>
    </div>
  );
}