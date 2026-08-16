'use client'

import contexto from "@/context/context";
import { registerMessage, verifyResult } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Dice from "../dicesAndMessages/dice";

interface DiceSelected {
  index: number;
  dice: number;
  type: string;
}

export default function RerollWithWillpower() {
  const [result, setResult] = useState<any>({});

  const {
    rerollWithWillPower,
    sessionId,
    setRerollWithWillPower,
    setShowMessage,
    dataSheet,
    sheetId,
  } = useContext(contexto);
  const [selectedDices, setSelectedDices] = useState<DiceSelected[]>([]);

  const generateDiceValues = (amount: number) => {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * 10) + 1);
  };

  useEffect(() => {
    if (rerollWithWillPower.dataMessage.type === 'roll') {
      setResult(rerollWithWillPower.dataMessage);
    } else {
      setResult(rerollWithWillPower.dataMessage.results);
    }
  }, []);

  const closePopup = () => {
    setRerollWithWillPower({ show: false, dataMessage: {} });
  };

  const rerrolDices = async () => {
    let canRoll = true;
    let agravatedValue = false;
    if (selectedDices.length > 0) {
      if (sheetId) {
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
          const missingInBoth = allValues.filter((value) => !agravated.includes(value) && !superficial.includes(value));
          if (missingInBoth.length > 0) {
            const smallestNumber = Math.min(...missingInBoth);
            if (agravatedValue) dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
            else dataSheet.data.willpower.push({ value: smallestNumber, agravated: false });
          } else {
            const missingInAgravated = allValues.filter((value) => !agravated.includes(value));
            if (missingInAgravated.length > 0) {
              const smallestNumber = Math.min(...missingInAgravated);
              dataSheet.data.willpower.push({ value: smallestNumber, agravated: true });
            } else {
              setShowMessage({ show: true, text: 'Voce nao possui mais pontos de Forca de Vontade para realizar este teste (Ja sofreu todos os danos Agravados possiveis).' });
              canRoll = false;
            }
          }
        }
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
      if (canRoll && rerollWithWillPower.dataMessage.type === 'roll') {
        closePopup();
        const newDataMessage = rerollWithWillPower.dataMessage;
        newDataMessage.willpower = true;
        const rageDices = selectedDices.filter((diceSelected: DiceSelected) => diceSelected.type === 'rage');
        const simpleDices = selectedDices.filter((diceSelected: DiceSelected) => diceSelected.type === '');
        const newRageValues = generateDiceValues(rageDices.length);
        const newSimpleValues = generateDiceValues(simpleDices.length);

        newRageValues.forEach((diceSelected) => {
          const index = newDataMessage.rage.findIndex((value: number) => value > 2 && value < 6);
          if (index !== -1) newDataMessage.rage[index] = diceSelected;
        });

        newSimpleValues.forEach((diceSelected) => {
          const index = newDataMessage.margin.findIndex((value: number) => value < 6);
          if (index !== -1) newDataMessage.margin[index] = diceSelected;
        });

        newDataMessage.test += ` Para este teste foi utilizado Forca de Vontade para rerrolar ${selectedDices.length} ${selectedDices.length > 1 ? 'Dados' : 'dado'}.`;

        const newResult = verifyResult(newDataMessage.rage, newDataMessage.margin, newDataMessage.dificulty);

        const rollDataMessage = { ...newDataMessage, ...newResult };

        await registerMessage(
          sessionId,
          rollDataMessage,
          newDataMessage.email,
          setShowMessage,
        );
      }
      if (canRoll && rerollWithWillPower.dataMessage.type !== 'roll') {
        closePopup();
        const newDataMessage = rerollWithWillPower.dataMessage;
        newDataMessage.willpower = true;
        const rageDices = selectedDices.filter((diceSelected: DiceSelected) => diceSelected.type === 'rage');
        const simpleDices = selectedDices.filter((diceSelected: DiceSelected) => diceSelected.type === '');
        const newRageValues = generateDiceValues(rageDices.length);
        const newSimpleValues = generateDiceValues(simpleDices.length);

        newRageValues.forEach((diceSelected) => {
          const index = newDataMessage.results.rage.findIndex((value: number) => value > 2 && value < 6);
          if (index !== -1) newDataMessage.results.rage[index] = diceSelected;
        });

        newSimpleValues.forEach((diceSelected) => {
          const index = newDataMessage.results.margin.findIndex((value: number) => value < 6);
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
          },
        };

        await registerMessage(
          sessionId,
          rollDataMessage,
          newDataMessage.email,
          setShowMessage,
        );
      }
    }
  };

  const selectDice = (index: number, dice: number, type: string) => {
    if (selectedDices.length === 3) {
      const findDice = selectedDices.find((diceSelected) => diceSelected.index === index && diceSelected.type === type);
      if (findDice) {
        const dicesSameType = selectedDices.filter((dicesSelected) => dicesSelected.type === type && dicesSelected.index !== index);
        const dicesDifType = selectedDices.filter((dicesSelected) => dicesSelected.type !== type);
        setSelectedDices([...dicesSameType, ...dicesDifType]);
      }
    } else {
      const findDice = selectedDices.find((diceSelected) => diceSelected.index === index && diceSelected.type === type);
      if (findDice) {
        const dicesSameType = selectedDices.filter((dicesSelected) => dicesSelected.type === type && dicesSelected.index !== index);
        const dicesDifType = selectedDices.filter((dicesSelected) => dicesSelected.type !== type);
        setSelectedDices([...dicesSameType, ...dicesDifType]);
      } else setSelectedDices([...selectedDices, { index, dice, type }]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      {result && (result.rage || result.margin) && (
        <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/90" />

          <button
            type="button"
            onClick={closePopup}
            className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
            aria-label="Fechar rerrolagem com forca de vontade"
          >
            <AiFillCloseCircle />
          </button>

          <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
            <h2 className="mt-2 font-kingthings text-xl">Rerrolar Com Força De Vontade</h2>
            <p className="mt-2 max-w-2xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
              Clique nos dados que deseja rerrolar, com limite de 3 dados. A Checagem consome 1 ponto de dano superficial em Força de Vontade e, sem espaços livres, aplica 1 ponto agravado.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="bg-black/45 px-3 py-4 sm:px-4">
              <div className="flex w-full gap-2">
                <div className="flex w-full flex-wrap items-center justify-center gap-3 py-2">
                  {result.rage.length > 0 &&
                    result.rage
                      .filter((dice: number) => dice > 2 && dice < 6)
                      .sort((a: number, b: number) => a - b)
                      .map((dice: number, index: number) => (
                        <button
                          key={`rage-${index}`}
                          type="button"
                          className={`cursor-pointer border p-2 transition-colors ${
                            selectedDices.find((diceSelected: DiceSelected) => diceSelected.index === index && diceSelected.type === 'rage')
                              ? 'border-red-700 bg-red-950/40'
                              : 'border-zinc-600/50 bg-black/45 hover:border-zinc-400/70'
                          }`}
                          onClick={() => selectDice(index, dice, 'rage')}
                        >
                          <Dice dice={dice} type="(rage)" />
                        </button>
                      ))}

                  {result.margin
                    .filter((dice: number) => dice < 6)
                    .sort((a: number, b: number) => a - b)
                    .map((dice: number, index: number) => (
                      <button
                        key={`margin-${index}`}
                        type="button"
                        className={`cursor-pointer border p-2 transition-colors ${
                          selectedDices.find((diceSelected: DiceSelected) => diceSelected.index === index && diceSelected.type === '')
                            ? 'border-red-700 bg-red-950/40'
                            : 'border-zinc-600/50 bg-black/45 hover:border-zinc-400/70'
                        }`}
                        onClick={() => selectDice(index, dice, '')}
                      >
                        <Dice dice={dice} type="" />
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={rerrolDices}
              disabled={selectedDices.length === 0}
              className="inline-flex w-full items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-white/35"
            >
              {`Rerrolar ${selectedDices.length > 0 ? selectedDices.length : ''} ${selectedDices.length === 1 ? 'Dado' : ''} ${selectedDices.length > 1 ? 'Dados' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
