'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { GiD10 } from "react-icons/gi";

export default function ItemAgravated(props: any) {
  const [totalItem, setTotalItem] = useState(0);
  const { name, namePtBr } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { dataSheet, setShowMessage, sheetId, session, email, setShowWillpowerTest } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const advantages = useMemo(() => sheetData?.advantagesAndFlaws?.advantages ?? [], [sheetData]);
  const flaws = useMemo(() => sheetData?.advantagesAndFlaws?.flaws ?? [], [sheetData]);
  const itemValues = useMemo(() => (Array.isArray(sheetData?.[name]) ? sheetData[name] : []), [name, sheetData]);

  useEffect(() => {
    const returnValues = async (): Promise<void> => {
      if (!sheetData) {
        setTotalItem(0);
        return;
      }

      if (name === 'willpower') {
        setTotalItem(Number(sheetData.attributes?.composure || 0) + Number(sheetData.attributes?.resolve || 0));
      }

      if (name === 'health') {
        const hasAdvantage = (title: string) =>
          advantages.some((advantage: { title: string }) => advantage.title === title);

        const getStandaloneStaminaValue = () => {
          const currentValue = Number(sheetData.attributes?.stamina || 0);

          if (!isSheetStandalone) return currentValue;

          if (sheetData.form === 'Crinos') return Math.max(0, currentValue - 4);

          if (sheetData.form === 'Hispo' || sheetData.form === 'Glabro') {
            return Math.max(0, currentValue - (hasAdvantage('Resiliêia de Luna') ? 4 : 2));
          }

          return currentValue;
        };

        const findMaldicaoDaAncia = flaws.find(
          (advantage: { title: string }) => advantage.title === 'Maldição da Anciã'
        );
        const findPeleEspessa = advantages.find(
          (advantage: { title: string }) => advantage.title === 'Pele Espessa'
        );
        const staminaValue = getStandaloneStaminaValue();

        if (findMaldicaoDaAncia && findPeleEspessa) setTotalItem(staminaValue + 3);
        else if (findMaldicaoDaAncia) setTotalItem(staminaValue + 2);
        else if (findPeleEspessa) setTotalItem(staminaValue + 4);
        else setTotalItem(staminaValue + 3);
      }
    };

    returnValues();
  }, [advantages, flaws, isSheetStandalone, name, sheetData]);

  const updateValue = async (value: number) => {
    if (dataSheet) {
      const dataPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? (acc.agravated += 1) : (acc.letal += 1);
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistMessage = `Dano Agravado(${dataPersist.agravated}) e Dano Letal (${dataPersist.letal})`;

      if (dataSheet.data[name].length === 0) {
        dataSheet.data[name] = [{ value, agravated: false }];
      } else {
        const itemAgravated = dataSheet.data[name].filter((item: any) => item.value === value && item.agravated === true);
        const restOfList = dataSheet.data[name].filter((item: any) => item.value !== value);
        if (itemAgravated.length > 0) {
          dataSheet.data[name] = restOfList;
        } else {
          const itemLetal = dataSheet.data[name].filter((item: any) => item.value === value);
          if (itemLetal.length === 0) dataSheet.data[name] = [...restOfList, { value, agravated: false }];
          else dataSheet.data[name] = [...restOfList, { value, agravated: true }];
        }
      }

      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      const newPersist = dataSheet.data[name].reduce((acc: any, item: any) => {
        item.agravated ? (acc.agravated += 1) : (acc.letal += 1);
        return acc;
      }, { agravated: 0, letal: 0 });
      const persistValue = `Dano Agravado(${newPersist.agravated}) e Dano Letal(${newPersist.letal})`;
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a ${namePtBr} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${persistMessage} para ${persistValue}.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
    } else {
      setShowMessage({ show: true, text: 'Jogador não encontrado. Por favor, atualize a página e tente novamente.' });
    }
  };

  const getHealthSummary = () => {
    const findMaldicaoDaAncia = flaws.find(
      (advantage: { title: string }) => advantage.title === 'Maldição da Anciã'
    );
    const findPeleEspessa = advantages.find(
      (advantage: { title: string }) => advantage.title === 'Pele Espessa'
    );

    const parts = ['VIGOR'];
    let staminaBonus = 3;
    if (findPeleEspessa) staminaBonus += 1;
    if (findMaldicaoDaAncia) staminaBonus -= 1;
    parts.push(' + ' + staminaBonus);

    return parts.join(' ');
  };

  const renderMarker = (index: number) => {
    const markerBaseClassName = 'h-5 w-5 border flex items-center justify-center';
    const marker = itemValues.find((element: any) => element.value === index + 1);

    if (isSheetStandalone) {
      return <button type="button" key={index} className="h-5 w-5 cursor-default border border-red-300/45 bg-red-950/30" />;
    }

    if (marker?.agravated) {
      return (
        <button
          type="button"
          onClick={() => updateValue(index + 1)}
          key={index}
          className={`${markerBaseClassName} cursor-pointer border-red-300/70 bg-red-950/30`}
        >
          <span className="relative block h-3.5 w-3.5">
            <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rotate-45 bg-red-300/70" />
            <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 -rotate-45 bg-red-300/70" />
          </span>
        </button>
      );
    }

    if (marker) {
      return (
        <button
          type="button"
          onClick={() => updateValue(index + 1)}
          key={index}
          className={`${markerBaseClassName} cursor-pointer border-red-300/70 bg-black/20`}
        >
          <span className="block h-4 w-[2px] rotate-45 bg-red-300/70" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => updateValue(index + 1)}
        key={index}
        className={`${markerBaseClassName} cursor-pointer border-zinc-600/70 bg-transparent`}
      />
    );
  };

  return (
    <section className="relative mt-2 sm:mt-5 w-full h-full overflow-hidden border border-zinc-500/30 bg-[#080c0d]/95 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.72)]">
      <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
      <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.28em] text-red-500/85">{namePtBr}</p>
        {!isSheetStandalone && name === 'willpower' && (
          <button
            className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-600"
            onClick={async () => setShowWillpowerTest(true)}
          >
            <GiD10 />
          </button>
        )}
      </div>
      <div className="mx-6 border-b border-zinc-500/20" />
      <div className="flex flex-col items-center pb-5 pt-4 text-center">
        <div className={`flex px-6 flex-wrap justify-center gap-2 w-full`}>
          {Array(totalItem)
            .fill('')
            .map((_, index) => renderMarker(index))}
        </div>
        {name === 'willpower' && (
          <div className="mt-4 font-geist-mono text-[0.58rem] uppercase tracking-[0.24em] text-zinc-500">
            AUTOCONTROLE + DETERMINAÇÃO
          </div>
        )}
        {name === 'health' && (
          <>
            <div className="mt-4 font-geist-mono text-[0.58rem] uppercase tracking-[0.24em] text-zinc-500">{getHealthSummary()}</div>
          </>
        )}
      </div>
    </section>
  );
}



