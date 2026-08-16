'use client'
import contexto from "@/context/context";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { GiD10 } from "react-icons/gi";
import { IoMdArrowDropright } from "react-icons/io";

export default function RitualsAdded(props: { ritual: any }) {
  const { ritual } = props;
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const [showData, setShowData] = useState(false);
  const { setShowRitualRoll } = useContext(contexto);

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
                {ritual.titlePtBr}
              </div>
              <div className="mt-1 font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/55">
                {ritual.type}
                {ritual.title && <span className="px-1">-</span>}
                {ritual.title}
              </div>
            </div>
          </div>
          {!isSheetStandalone && <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-white/80  hover:text-red-700/80 hover:text-white text-2xl transition-colors duration-500"
            onClick={(event) => {
              event.stopPropagation();
              setShowRitualRoll({ show: true, ritual });
            }}
          >
            <GiD10 />
          </button>}
        </div>
      </div>
      {showData && (
        <div className="space-y-1.5 px-7 pb-2 pt-1 font-geist-mono text-[10px] leading-5 text-white/78">
          <div>
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Tipo:</span>
            <span>{ritual.type}.</span>
          </div>
          {ritual.pool !== '' && (
            <div>
              <span className="pr-1 uppercase tracking-[0.08em] text-white">Checagem:</span>
              <span>{ritual.pool}.</span>
            </div>
          )}
          <div className="pt-1">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">DescriÃ§Ã£o:</span>
            <span className="whitespace-pre-wrap">{ritual.descriptionPtBr}</span>
          </div>
          {ritual.systemPtBr !== '' && (
            <div className="pt-1">
              <span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span>
              <span className="whitespace-pre-wrap">{ritual.systemPtBr}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
