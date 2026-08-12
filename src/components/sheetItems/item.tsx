'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { GiD10 } from "react-icons/gi";

export default function Item(props: any) {
  const { name, quant, namePtBr } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const {
    email,
    dataSheet,
    sheetId,
    session,
    setShowMessage,
    setShowRageTest,
    setShowHarano,
    setShowHauglosk,
  } = useContext(contexto);
  const sheetData = dataSheet?.data;

  const updateValue = async (fieldName: string, value: number) => {
    if (!dataSheet || !sheetData) return;

    const dataPersist = sheetData[fieldName] ?? 0;
    if (sheetData[fieldName] === 1 && value === 1) sheetData[fieldName] = 0;
    else sheetData[fieldName] = value;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou ${namePtBr === 'Harano' || namePtBr === 'Hauglosk' ? 'o' : 'a'} ${namePtBr} do personagem ${sheetData.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${dataPersist} para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const showRageButton = !isSheetStandalone && name === 'rage' && Number(sheetData?.rage || 0) > 0;
  const showHaranoButton = !isSheetStandalone && name === 'harano';
  const showHaugloskButton = !isSheetStandalone && name === 'hauglosk';
  const renderRollButton = () => {
    if (showRageButton) {
      return (
        <button className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500" onClick={async () => setShowRageTest(true)}>
          <GiD10 />
        </button>
      );
    }

    if (showHaranoButton) {
      return (
        <button className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500" onClick={async () => setShowHarano(true)}>
          <GiD10 />
        </button>
      );
    }

    if (showHaugloskButton) {
      return (
        <button className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500" onClick={async () => setShowHauglosk(true)}>
          <GiD10 />
        </button>
      );
    }

    return null;
  };

  const renderTrack = () => {
    return (
      <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
        {Array(quant)
          .fill('')
          .map((_, index) => {
            const isFilled = Number(sheetData?.[name] || 0) >= index + 1;
            const className = isFilled
              ? name === 'rage'
                ? 'h-5 w-5 border border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)] cursor-pointer transition-colors'
                : 'h-5 w-5 border border-zinc-700 bg-transparent cursor-pointer transition-colors'
              : 'h-5 w-5 border border-zinc-700 bg-transparent cursor-pointer transition-colors';

            return (
              <button
                type="button"
                onClick={() => updateValue(name, index + 1)}
                key={index}
                className={className}
              />
            );
          })}
      </div>
    );
  };

  return (
    <section className="relative mt-2 sm:mt-5 h-full w-full overflow-hidden border border-zinc-500/30 bg-[#080c0d]/95 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.72)]">
      <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
      <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <p className="font-geist-mono text-[0.82rem] uppercase tracking-[0.28em] text-red-500/85">{namePtBr}</p>
        {renderRollButton()}
      </div>
      <div className="mx-6 border-b border-zinc-500/20" />
      <div className="flex flex-col items-center px-6 pb-3 pt-5 text-center">
        {renderTrack()}
        <div className="mt-4 min-h-[20px] font-geist-mono text-[0.58rem] uppercase tracking-[0.22em] text-zinc-500">
          {session.typeSession === 'Regras Alternativas' && name === 'rage' && Number(sheetData?.rage || 0) >= 5 ? 'FRENESI' : ''}
          {name === 'rage' && Number(sheetData?.rage || 0) === 0 ? 'PERDEU O LOBO' : ''}
        </div>
      </div>
    </section>
  );
}
