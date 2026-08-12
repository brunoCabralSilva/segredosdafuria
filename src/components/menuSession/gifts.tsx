import contexto from "@/context/context";
import { useContext } from "react";
import AddGift from "../popup/addGift";
import GiftsAdded from "../gifts/giftsAdded";

export default function Gifts() {
  const { dataSheet, showGiftsToAdd, setShowGiftsToAdd, setShowMessage } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const gifts = Array.isArray(sheetData?.gifts) ? sheetData.gifts : [];

  return (
    <section className="visage-card relative mt-2 sm:mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-slate-300 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.26em] text-red-500/85">Dons</p>
        <button
          type="button"
          onClick={() => {
            if (!sheetData) return;

            const totalRenown = Number(sheetData.glory || 0) + Number(sheetData.wisdom || 0) + Number(sheetData.honor || 0);
            if (sheetData.trybe !== '' && sheetData.auspice !== '' && totalRenown >= 3) {
              setShowGiftsToAdd(true);
            } else {
              setShowMessage({ show: true, text: 'Antes de adicionar um dom, é necessário preencher uma Tribo, um Augúrio e pelo menos três pontos em Renomes' });
            }
          }}
          className="sheet-readonly-action inline-flex p-2 font-geist-mono text-[9px] items-center justify-center border border-red-950 bg-red-950 text-white transition-colors hover:bg-red-900 uppercase"
          aria-label="Gerenciar Dons"
        >
          Gerenciar
        </button>
      </div>
      <div className="mx-6 border-b border-white/10" />
      <div className="pb-4 pt-2">
        {gifts.map((item: any, index: number) => (
          <GiftsAdded key={index} gift={item} />
        ))}
      </div>
      {showGiftsToAdd && <AddGift />}
    </section>
  );
}