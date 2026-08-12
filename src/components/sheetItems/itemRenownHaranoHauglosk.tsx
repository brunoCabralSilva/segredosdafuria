'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { GiD10 } from "react-icons/gi";

const renownMeta = {
  glory: {
    label: 'GLÓRIA',
    textClass: 'text-white/90',
    filledClass: 'border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)]',
  },
  honor: {
    label: 'HONRA',
    textClass: 'text-white/90',
    filledClass: 'border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)]',
  },
  wisdom: {
    label: 'SABEDORIA',
    textClass: 'text-white/90',
    filledClass: 'border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)]',
  },
} as const;

export default function ItemRenownHaranoHauglosk() {
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { email, dataSheet, sheetId, session, setShowMessage, setShowHarano, setShowHauglosk } = useContext(contexto);
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
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou ${fieldName === 'harano' || fieldName === 'hauglosk' ? 'o' : 'a'} ${fieldName === 'glory' ? 'Glória' : fieldName === 'honor' ? 'Honra' : fieldName === 'wisdom' ? 'Sabedoria' : fieldName === 'harano' ? 'Harano' : 'Hauglosk'} do personagem ${sheetData.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''} de ${dataPersist} para ${value}.`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
    
  };
  const renderRenownTrack = (type: keyof typeof renownMeta) => {
    const meta = renownMeta[type];

    return (
      <div className="mt-3 flex justify-center gap-1.5">
        {Array(5)
          .fill('')
          .map((_, index) => {
            const isFilled = Number(sheetData?.[type] || 0) >= index + 1;

            return (
              <button
                type="button"
                onClick={() => updateValue(type, index + 1)}
                key={index}
                className={[
                  'h-3.5 w-3.5 rounded-full border transition-colors',
                  isFilled ? meta.filledClass : 'border-zinc-700 bg-transparent',
                ].join(' ')}
              />
            );
          })}
      </div>
    );
  };

  const renderShadowTrack = (type: 'harano' | 'hauglosk') => {
    return (
      <div className="mt-3 flex justify-center gap-2">
        {Array(5)
          .fill('')
          .map((_, index) => {
            const isFilled = Number(sheetData?.[type] || 0) >= index + 1;

            return (
              <button
                type="button"
                onClick={() => updateValue(type, index + 1)}
                key={index}
                className={[
                  'h-5 w-5 border transition-colors',
                  isFilled ? 'border-red-300/70 bg-red-700/30 shadow-[0_0_10px_rgba(185,28,28,0.18)]'
                  : 'border-zinc-700 bg-transparent',
                ].join(' ')}
              />
            );
          })}
      </div>
    );
  };

  return (
    <section className="relative mt-2 sm:mt-5 w-full overflow-hidden border border-zinc-500/30 bg-[#080c0d]/95 text-white shadow-[inset_0_0_80px_rgba(0,0,0,0.72)]">
      <span className="absolute right-0 top-0 h-px w-4 bg-red-700/85" />
      <span className="absolute right-0 top-0 h-4 w-px bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-px w-4 bg-red-700/85" />
      <span className="absolute bottom-0 left-0 h-4 w-px bg-red-700/85" />
      <div className="px-6 pb-3 pt-5">
        <p className="font-geist-mono text-[0.82rem] uppercase tracking-[0.28em] text-red-500/85">Renome ({Number(sheetData?.glory || 0) + Number(sheetData?.honor || 0) + Number(sheetData?.wisdom || 0)})</p>
      </div>
      <div className="mx-6 border-b border-zinc-500/20" />
      <div className="px-6 pb-5 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          {(Object.keys(renownMeta) as Array<keyof typeof renownMeta>).map((type) => (
            <div key={type}>
              <p className={`font-geist-mono text-[0.62rem] uppercase tracking-[0.2em] ${renownMeta[type].textClass}`}>
                {renownMeta[type].label}
              </p>
              {renderRenownTrack(type)}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-4 w-full border-b border-zinc-500/20" />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-geist-mono text-[0.62rem] uppercase tracking-[0.2em] text-white">Harano</p>
            {renderShadowTrack('harano')}
            {!isSheetStandalone && <div className="mt-3 flex justify-center">
              <button
                className="sheet-readonly-action flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500"
                onClick={async () => setShowHarano(true)}
              >
                <GiD10 />
              </button>
            </div>}
          </div>
          <div>
            <p className="font-geist-mono text-[0.62rem] uppercase tracking-[0.2em] text-white">Hauglosk</p>
            {renderShadowTrack('hauglosk')}
            {!isSheetStandalone && <div className="mt-3 flex justify-center">
              <button
                className="sheet-readonly-action flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500"
                onClick={async () => setShowHauglosk(true)}
              >
                <GiD10 />
              </button>
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}



