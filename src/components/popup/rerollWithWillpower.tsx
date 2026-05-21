'use client'
import contexto from "@/context/context";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Dice from "../dicesAndMessages/dice";
import { registerMessage, verifyResult } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";

interface diceSelected {
  index: number;
  dice: number;
  type: string;
};

export default function RerollWithWillpower() {
  const [result, setResult ] = useState<any>({});

  const {
    rerollWithWillPower,
    sessionId,
    setRerollWithWillPower,
    setShowMessage,
    dataSheet,
    sheetId,
  } = useContext(contexto);
  const [selectedDices, setSelectedDices] = useState<diceSelected[]>([]);

  const generateDiceValues = (amount: number) => {
    return Array.from({ length: amount }, () =>
      Math.floor(Math.random() * 10) + 1
    );
  };

  useEffect(() => {
    if (rerollWithWillPower.dataMessage.type === "roll") {
      setResult(rerollWithWillPower.dataMessage);
    } else setResult(rerollWithWillPower.dataMessage.results);
  }, []);

  const rerrolDices = async () => {
    let canRoll = true;
    let agravatedValue = false;
    if (selectedDices.length > 0) {
      if (sheetId) {
        const actualWillpower = dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length;
        if (actualWillpower < 0) agravatedValue =  true;
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
              canRoll = false;
            }
          }
        }
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
      if (canRoll && rerollWithWillPower.dataMessage.type === 'roll') {
        setRerollWithWillPower({ show: false, dataMessage: {} });
        const newDataMessage = rerollWithWillPower.dataMessage;
        newDataMessage.willpower = true;
        const rageDices = selectedDices.filter((diceSelected: diceSelected) => diceSelected.type === 'rage');
        const simpleDices = selectedDices.filter((diceSelected: diceSelected) => diceSelected.type === '');
        const newRageValues = generateDiceValues(rageDices.length);
        const newSimpleValues = generateDiceValues(simpleDices.length);

        newRageValues.forEach((diceSelected) => {
          const index = newDataMessage.rage.findIndex((value: number) => value > 2 && value < 6);
          if (index !== -1) newDataMessage.rage[index] = diceSelected;
        });

        newSimpleValues.forEach((diceSelected) => {
          const index = newDataMessage.margin.findIndex( (value: number) => value < 6);
          if (index !== -1) newDataMessage.margin[index] = diceSelected;
        });

        newDataMessage.test += ` Para este teste foi utilizado Força de Vontade para rerrolar ${selectedDices.length} ${selectedDices.length > 1 ? 'Dados' : 'dado'}.`;

        const newResult = verifyResult(newDataMessage.rage, newDataMessage.margin, newDataMessage.dificulty);

        const rollDataMessage = { ...newDataMessage, ...newResult };
        
        await registerMessage(
          sessionId,
          rollDataMessage,
          newDataMessage.email,
          setShowMessage,
        );
      } if (canRoll && rerollWithWillPower.dataMessage.type !== 'roll') {
        setRerollWithWillPower({ show: false, dataMessage: {} });
        const newDataMessage = rerollWithWillPower.dataMessage;
        newDataMessage.willpower = true;
        const rageDices = selectedDices.filter((diceSelected: diceSelected) => diceSelected.type === 'rage');
        const simpleDices = selectedDices.filter((diceSelected: diceSelected) => diceSelected.type === '');
        const newRageValues = generateDiceValues(rageDices.length);
        const newSimpleValues = generateDiceValues(simpleDices.length);

        newRageValues.forEach((diceSelected) => {
          const index = newDataMessage.results.rage.findIndex((value: number) => value > 2 && value < 6);
          if (index !== -1) newDataMessage.results.rage[index] = diceSelected;
        });

        newSimpleValues.forEach((diceSelected) => {
          const index = newDataMessage.results.margin.findIndex( (value: number) => value < 6);
          if (index !== -1) newDataMessage.results.margin[index] = diceSelected;
        });

        const newResult = verifyResult(newDataMessage.results.rage, newDataMessage.results.margin, newDataMessage.results.dificulty);

        const rollDataMessage = {
          ...newDataMessage,
          results: {
            ...newResult,
            rage: newDataMessage.results.rage,
            margin: newDataMessage.results.margin,
            dificulty: newDataMessage.results.dificulty,
          }
        };
        
        await registerMessage(
          sessionId,
          rollDataMessage,
          newDataMessage.email,
          setShowMessage,
        );
      }
    }
  }

  const selectDice = (index: number, dice: number, type: string) => {
    if (selectedDices.length === 3) {
      const findDice = selectedDices.find((diceSelected) => diceSelected.index == index && diceSelected.type === type);
      if (findDice) {
        const dicesSameType = selectedDices.filter((dicesSelected) => dicesSelected.type === type && dicesSelected.index !== index);
        const dicesDifType = selectedDices.filter((dicesSelected) => dicesSelected.type != type);
        setSelectedDices([...dicesSameType, ...dicesDifType]);
      }
    } else {
      const findDice = selectedDices.find((diceSelected) => diceSelected.index == index && diceSelected.type === type);
      if (findDice) {
        const dicesSameType = selectedDices.filter((dicesSelected) => dicesSelected.type === type && dicesSelected.index !== index);
        const dicesDifType = selectedDices.filter((dicesSelected) => dicesSelected.type != type);
        setSelectedDices([...dicesSameType, ...dicesDifType]);
      } else setSelectedDices([...selectedDices, { index, dice, type } ]);
    }
  }

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      {
        result && (result.rage || result.margin) &&
        <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-green-whats relative border-white border-2 pb-5">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={() => setRerollWithWillPower({ show: false, dataMessage: {} }) }
            />
          </div>
          <div className="pb-5 px-5 w-full">
            <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
              <p className="text-white w-full text-center pb-3 font-bold">
                Clique nos dados que deseja rerrolar (máximo de 3 dados), ao custo de 1 ponto de Dano Superficial na Força de Vontade (se você não possuir mais marcadores de Força de Vontade livres de dano, será aplicado 1 ponto de dano Agravado):
              </p>
            </label>
            <div className="flex w-full gap-2">
              <div className="py-2 flex flex-wrap justify-center items-center w-full gap-3">
                {
                  result.rage.length > 0 &&
                  result.rage
                    .filter((dice: number) => dice > 2 && dice < 6)
                    .sort((a: number, b: number) => a - b)
                    .map((dice: number, index: number) => (
                      <div
                        key={index}
                        className={`cursor-pointer p-2 rounded-lg ${selectedDices.find((diceSelected: any) => diceSelected.index === index && diceSelected.type === 'rage') ? 'bg-black' : '' }`}
                        onClick={ () => selectDice(index, dice, 'rage')}
                      >
                        <Dice dice={ dice } type="(rage)" />
                      </div>
                    ))
                }
                {
                  result.margin
                    .filter((dice: number) => dice < 6)
                    .sort((a: number, b: number) => a - b)
                    .map((dice: number, index: number) => (
                      <div
                        key={index}
                        className={`cursor-pointer p-2 rounded-lg ${selectedDices.find((diceSelected: diceSelected) => diceSelected.index === index && diceSelected.type === '') ? 'bg-black' : '' }`}
                        onClick={ () => selectDice(index, dice, '') }
                      >
                        <Dice dice={ dice } type="" />
                      </div>
                    ))
                }
              </div>
            </div>
            <button
              type="button"
              onClick={ rerrolDices }
              className={`text-white ${selectedDices.length > 0 ? 'bg-black cursor-pointer' : 'bg-gray-whats'} border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              {`Rerrolar ${selectedDices.length > 0 ? selectedDices.length : ''} ${selectedDices.length == 1 ? 'Dado' : ''} ${selectedDices.length > 1 ? 'Dados' : ''}`}
            </button>
          </div>
        </div>
      }
    </div>
  );
}