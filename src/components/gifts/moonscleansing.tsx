import contexto from "@/context/context";
import { calculateRageChecks, registerMessage } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export function Moonscleansing() {
  const {
    sessionId,
    email,
    session,
    sheetId,
    dataSheet,
    setShowMessage,
    showGiftRoll, setShowGiftRoll,
    setShowMenuSession,
  } = useContext(contexto);

  type WillpowerDamage = {
    value: number;
    agravated: boolean;
  };

  function getResolveComposure(dataSheet: any): number {
    return (
      dataSheet.data.attributes.resolve +
      dataSheet.data.attributes.composure
    );
  }

  function getWillpowerValuesByType(
    willpower: WillpowerDamage[],
    agravated: boolean
  ): number[] {
    return willpower
      .filter((fdv: WillpowerDamage) => fdv.agravated === agravated)
      .map((fd: WillpowerDamage) => fd.value);
  }

  function getAllWillpowerValues(resolveComposure: number): number[] {
    return Array.from({ length: resolveComposure }, (_, i) => i + 1);
  }

  function getNextWillpowerDamage(
    willpower: WillpowerDamage[],
    resolveComposure: number
  ): WillpowerDamage | null {
    const actualWillpower = resolveComposure - willpower.length;
    const agravatedValue = actualWillpower < 0;

    if (willpower.length === 0) {
      return {
        value: 1,
        agravated: agravatedValue
      };
    }

    const agravated = getWillpowerValuesByType(willpower, true);
    const superficial = getWillpowerValuesByType(willpower, false);
    const allValues = getAllWillpowerValues(resolveComposure);

    const missingInBoth = allValues.filter(
      value => !agravated.includes(value) && !superficial.includes(value)
    );

    if (missingInBoth.length > 0) {
      return {
        value: Math.min(...missingInBoth),
        agravated: agravatedValue
      };
    }

    const missingInAgravated = allValues.filter(
      value => !agravated.includes(value)
    );

    if (missingInAgravated.length > 0) {
      return {
        value: Math.min(...missingInAgravated),
        agravated: true
      };
    }

    return null;
  }

  function canRemoveWillpowerPoints(
    willpower: WillpowerDamage[],
    resolveComposure: number,
    amount: number
  ): boolean {
    const simulatedWillpower = [...willpower];

    for (let i = 0; i < amount; i++) {
      const nextDamage = getNextWillpowerDamage(
        simulatedWillpower,
        resolveComposure
      );

      if (!nextDamage) {
        return false;
      }

      simulatedWillpower.push(nextDamage);
    }

    return true;
  }

  function removeWillpowerPoints(
    willpower: WillpowerDamage[],
    resolveComposure: number,
    amount: number
  ): WillpowerDamage[] {
    const newWillpower = [...willpower];

    for (let i = 0; i < amount; i++) {
      const nextDamage = getNextWillpowerDamage(
        newWillpower,
        resolveComposure
      );

      if (nextDamage) {
        newWillpower.push(nextDamage);
      }
    }

    return newWillpower;
  }

  const roll = async () => {
    const WILLPOWER_COST = 4;
    const resolveComposure = getResolveComposure(dataSheet);
    const hasEnoughWillpower = canRemoveWillpowerPoints(
      dataSheet.data.willpower,
      resolveComposure,
      WILLPOWER_COST
    );
    if (dataSheet.data.rage >= 4 && hasEnoughWillpower) {
      const rageTest = await calculateRageChecks(session.typeSession, sheetId, 4, setShowMessage);
      dataSheet.data.rage = rageTest?.rage;
      dataSheet.data.willpower = removeWillpowerPoints(
        dataSheet.data.willpower,
        resolveComposure,
        WILLPOWER_COST
      );
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      await registerMessage(
        sessionId,
        {
          type: 'gift',
          ...showGiftRoll.gift,
          roll: 'rage',
          rageResults: rageTest,
        },
        email,
        setShowMessage);

    } else if (dataSheet.data.rage >= 4 && !hasEnoughWillpower) {
      setShowMessage({
        show: true,
        text: 'Você não possui 4 pontos de Força de Vontade disponíveis para realizar este teste.'
      });
    } else if (dataSheet.data.rage < 4 && hasEnoughWillpower) {
      setShowMessage({ show: true, text: 'Você não possui 4 pontos de Fúria suficientes para ativar este Dom.' });
    } else {
      setShowMessage({ show: true, text: 'Você não possui 4 pontos Fúria e nem 4 pontos Força de Vontade para ativar este Dom.' });
    }
  }

  return(
    <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
        onClick={ () => {
          roll();
          setShowMenuSession('');
          setShowGiftRoll({ show: false, gift: {} });
        }}
      >
        Ativar Dom
      </button>
  )
} 