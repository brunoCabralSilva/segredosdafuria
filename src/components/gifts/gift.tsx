import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, normalizeGiftId, serializeGiftEntries } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Gift(props: { gift: any; index: number; length: number }) {
  const [showGift, setShowGift] = useState(false);
  const { gift } = props;
  const { dataSheet, email, session, sheetId, setDataSheet, setShowMessage } = useContext(contexto);

  const registerGift = async (currentGift: any) => {
    const currentGiftIds = Array.isArray(dataSheet?.data?.gifts)
      ? serializeGiftEntries(dataSheet.data.gifts)
      : [];
    const currentGiftId = normalizeGiftId(currentGift);
    const findGift = currentGiftIds.includes(currentGiftId);
    const updatedGiftIds = findGift
      ? currentGiftIds.filter((giftId) => giftId !== currentGiftId)
      : [...currentGiftIds, currentGiftId];

    const updatedSheet = {
      ...dataSheet,
      data: {
        ...dataSheet.data,
        gifts: updatedGiftIds,
      },
    };

    setDataSheet(updatedSheet);
    await updateDataPlayer(sheetId, updatedSheet, setShowMessage);
    await registerHistory(
      session.id,
      {
        message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} ${findGift ? ' removeu' : ' adicionou'} o dom ${currentGift.giftPtBr} ${findGift ? 'do' : 'ao'} personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.' }`,
        type: 'notification',
      },
      null,
      setShowMessage,
    );
  };

  const currentGiftIds = Array.isArray(dataSheet?.data?.gifts)
    ? serializeGiftEntries(dataSheet.data.gifts)
    : [];
  const isSelected = currentGiftIds.includes(normalizeGiftId(gift));

  return (
    <div className={`${isSelected ? 'border-red-600 bg-black/85 shadow-[0_0_0_1px_rgba(248,113,113,0.42),0_0_22px_rgba(127,29,29,0.24)]' : 'border-white/10 bg-black/40'} overflow-hidden border transition-colors`}>
      <button
        type="button"
        onClick={() => setShowGift(!showGift)}
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-white/5"
      >
        <div className="min-w-0 flex-1">
          <p className="font-kingthings text-[0.86rem] uppercase tracking-[0.18em] text-white">{gift.giftPtBr}</p>
          <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">{gift.gift}</p>
          <p className="mt-2 font-geist-mono text-[10px] leading-5 text-white/72">
            {gift.belonging.map((belong: { type: string; totalRenown: number }, index: number) => (
              <span key={`${gift.gift}-${belong.type}-${index}`}>
                {capitalizeFirstLetter(belong.type)} ({belong.totalRenown})
                {index === gift.belonging.length - 1 ? '' : ', '}
              </span>
            ))}
          </p>
        </div>
        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/50 text-white/75">
          {showGift ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}
        </span>
      </button>
      {showGift && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-2.5 font-geist-mono text-[11px] leading-5 text-white/75">
            <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Ação:</span><span>{gift.action}.</span></div>
            <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Renome:</span><span>{gift.renown}.</span></div>
            <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Custo:</span><span>{gift.cost}.</span></div>
            {gift.pool !== '' && <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Checagem:</span><span>{gift.pool}.</span></div>}
            <div className="border-t border-white/10 pt-2"><span className="pr-1 uppercase tracking-[0.08em] text-white">Descrição:</span><span className="whitespace-pre-wrap">{gift.descriptionPtBr}</span></div>
            <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span><span className="whitespace-pre-wrap">{gift.systemPtBr}</span></div>
            {gift.duration !== '' && <div><span className="pr-1 uppercase tracking-[0.08em] text-white">Duração:</span><span>{gift.duration}.</span></div>}
          </div>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            onClick={() => { registerGift(gift); }}
          >
            {isSelected ? 'Remover' : 'Adicionar'}
          </button>
        </div>
      )}
    </div>
  );
}
