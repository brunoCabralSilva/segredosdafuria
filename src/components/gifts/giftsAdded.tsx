'use client'
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { GiD10 } from "react-icons/gi";
import { IoMdArrowDropright } from "react-icons/io";

export default function GiftsAdded(props: { gift: any }) {
  const { gift } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const [showData, setShowData] = useState(false);
  const { setShowGiftRoll } = useContext(contexto);

  return (
    <div className="mx-4 flex flex-col gap-2 border-b border-white/[0.07] px-2 pb-3 pt-2 text-justify font-normal last:border-b-0 last:pb-1">
      <div
        className="relative flex w-full cursor-pointer flex-col items-center justify-between"
        onClick={() => setShowData(!showData)}
      >
        <div className="flex w-full items-start justify-between gap-3 px-2 text-left">
          <div className="flex min-w-0 gap-1.5">
            <div className="flex pt-[2px] text-white/65">
              <IoMdArrowDropright className={`${showData ? 'rotate-90' : ''} text-base transition-all`} />
            </div>
            <div className="min-w-0">
              <div className="font-kingthings text-sm uppercase tracking-[0.08em] text-white">
                {gift.giftPtBr}
              </div>
              <div className="mt-1 font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/55">
                {gift.belonging.map((belong: any, index: number) => (
                  <span key={index}>
                    {capitalizeFirstLetter(belong.type)}
                    {index !== gift.belonging.length - 1 && <span className="px-1">-</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {!isSheetStandalone && <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500"
            onClick={(event) => { event.stopPropagation(); setShowGiftRoll({ show: true, gift }); }}
          >
            <GiD10 />
          </button>}
        </div>
      </div>
      {showData && (
        <div className="space-y-1.5 px-7 pb-2 pt-1 font-geist-mono text-[10px] leading-5 text-white/78">
          <div>
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Pertence à :</span>
            {gift.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
              <span key={index} className="capitalize">
                {capitalizeFirstLetter(belong.type)} ({belong.totalRenown})
                {index === gift.belonging.length - 1 ? '' : ', '}
              </span>
            ))}
          </div>
          <div>
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Ação:</span>
            <span>{gift.action}.</span>
          </div>
          <div>
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Renome:</span>
            <span>{gift.renown}.</span>
          </div>
          <div>
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Custo:</span>
            <span>{gift.cost}.</span>
          </div>
          {gift.pool !== '' && (
            <div>
              <span className="pr-1 uppercase tracking-[0.08em] text-white">Teste:</span>
              <span>{gift.pool}.</span>
            </div>
          )}
          <div className="pt-1">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Descrição:</span>
            <span>{gift.descriptionPtBr}</span>
          </div>
          <div className="pt-1">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span>
            <span>{gift.systemPtBr}</span>
          </div>
          {gift.duration !== '' && (
            <div className="pt-1">
              <span className="pr-1 uppercase tracking-[0.08em] text-white">Duração:</span>
              <span>{gift.duration}.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
