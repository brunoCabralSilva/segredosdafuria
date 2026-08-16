'use client'
import { useContext, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerWillpowerRoll } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import {
  openChatAfterSpecialRoll,
  SpecialRollFrame,
  specialRollActionButtonClass,
  specialRollCounterButtonClass,
  specialRollDisabledCounterButtonClass,
  specialRollLabelClass,
  specialRollSelectClass,
  specialRollValueClass,
} from "./specialRollShared";

export default function WillpowerTest() {
  const [willpowerType, setWillpowerType] = useState<string>('Aguardando Selecao');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    sessionId,
    dataSheet,
    sheetId,
    setDataSheet,
    setOptionSelect,
    setShowWillpowerTest,
    setShowMenuSession,
    setShowMessage,
  } = useContext(contexto);

  const closePopup = () => {
    setShowWillpowerTest(false);
  };

  const discountWillpower = async () => {
    let agravatedValue = false;
    const actualWillpower = dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length;
    if (actualWillpower < 0) agravatedValue = true;
    if (dataSheet.data.willpower.length === 0) {
      if (agravatedValue) dataSheet.data.willpower.push({ value: 1, agravated: true });
      else dataSheet.data.willpower.push({ value: 1, agravated: false });
    } else {
      const resolveComposure = dataSheet.data.attributes.resolve + dataSheet.data.attributes.composure;
      const agravated = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
      const superficial = dataSheet.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
      const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
      const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
      if (missingInBoth.length > 0) {
        const smallestNumber = Math.min(...missingInBoth);
        if (agravatedValue) dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
        else dataSheet.data.willpower.push({ value: smallestNumber, agravated: false });
      } else {
        const missingInAgravated = allValues.filter(value => !agravated.includes(value));
        if (missingInAgravated.length > 0) {
          const smallestNumber = Math.min(...missingInAgravated);
          dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
        } else {
          setShowMessage({ show: true, text: 'Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).' });
        }
      }
    }

    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    setDataSheet({ ...dataSheet });
  };

  const rollDices = async () => {
    const actualWillpower = Number(willpowerType.replace('total -', '').replace('restante -', ''));
    const type = willpowerType.includes('total') ? 'total' : 'restante';

    const roll = await registerWillpowerRoll(
      sessionId,
      type,
      dataSheet.data.name,
      actualWillpower,
      penaltyOrBonus,
      dificulty,
      setShowMessage,
    );

    const rollMessage = String(roll?.message || '').toLowerCase();
    const totalSuccesses = Number(roll?.brutalPairs || 0) + Number(roll?.criticalPairs || 0) + Number(roll?.success || 0);
    const failedWillpowerCheck = totalSuccesses < Number(roll?.dificulty || dificulty) || rollMessage.includes('falhou');

    console.log(failedWillpowerCheck);

    if (failedWillpowerCheck && sheetId) {
      await discountWillpower();
    }

    closePopup();
    openChatAfterSpecialRoll(setOptionSelect, setShowMenuSession);
  };

  const parsedWillpowerValue = willpowerType.replace('total -', '').replace('restante -', '').trim();
  const disableRoll = parsedWillpowerValue === '0' || parsedWillpowerValue === 'Aguardando Selecao';

  return (
    <SpecialRollFrame
      title="Checagem de Força de Vontade"
      description=""
      onClose={closePopup}
    >
      <div className="flex flex-col items-center">
        <label htmlFor="willpower-type" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Base da Parada</p>
          <select
            id="willpower-type"
            className={specialRollSelectClass}
            value={willpowerType}
            onChange={(e) => setWillpowerType(e.target.value)}
          >
            <option disabled value="Aguardando Selecao">
              Selecione a parada de dados
            </option>
            <option value={'restante - ' + (dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length)}>
              Usar Força de Vontade restante ({dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length})
            </option>
            <option value={'total - ' + (dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve)}>
              Usar Força de Vontade total ({dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve})
            </option>
          </select>
        </label>
        <label htmlFor="willpower-penalty" className="mb-3 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Penalidade (-) ou Bônus (+)</p>
          <div className="flex w-full">
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${penaltyOrBonus === -50 ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1);
              }}
            >
              <FaMinus />
            </button>
            <div id="willpower-penalty" className={specialRollValueClass}>
              {penaltyOrBonus}
            </div>
            <button
              type="button"
              className={`${specialRollCounterButtonClass} ${penaltyOrBonus === 50 ? specialRollDisabledCounterButtonClass : ''}`}
              onClick={() => {
                if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1);
              }}
            >
              <FaPlus />
            </button>
          </div>
        </label>
        <label htmlFor="willpower-dificulty" className="mb-3 flex w-full flex-col items-center">
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
            <div id="willpower-dificulty" className={specialRollValueClass}>
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
        <label htmlFor="willpower-pool" className="mb-1 flex w-full flex-col items-center">
          <p className={specialRollLabelClass}>Parada de Dados</p>
          <div id="willpower-pool" className={specialRollValueClass}>
            {parsedWillpowerValue === 'Aguardando Selecao' ? '-' : parsedWillpowerValue}
          </div>
        </label>
        {parsedWillpowerValue === '0' && (
          <div className="mt-2 text-center font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/65">
            Voce nao possui Força de Vontade disponível para realizar este teste.
          </div>
        )}
        <button
          type="button"
          className={`${specialRollActionButtonClass} ${disableRoll ? 'bg-gray-500 text-black' : 'bg-black text-white hover:border-red-800'}`}
          onClick={rollDices}
          disabled={disableRoll}
        >
          Realizar o teste
        </button>
      </div>
    </SpecialRollFrame>
  );
}