'use client'
import { useContext, useMemo } from "react";
import dataGifts from '../../data/gifts.json';
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Gift from "../gifts/gift";
import ManageCollectionFrame from "./manageCollectionFrame";

export default function AddGift() {
  const { dataSheet, setShowGiftsToAdd } = useContext(contexto);

  const availableGifts = useMemo(() => {
    const sumRenown = Number(dataSheet.data.glory) + Number(dataSheet.data.wisdom) + Number(dataSheet.data.honor);

    return dataGifts.filter((gift: any) => gift.belonging.some((belong: any) => {
      return (belong.type === 'global' || belong.type === dataSheet.data.trybe || belong.type === dataSheet.data.auspice)
        && belong.totalRenown <= sumRenown;
    }));
  }, [dataSheet.data.auspice, dataSheet.data.glory, dataSheet.data.honor, dataSheet.data.trybe, dataSheet.data.wisdom]);

  const selectedGifts = Array.isArray(dataSheet?.data?.gifts) ? dataSheet.data.gifts : [];
  const totalRenown = Number(dataSheet.data.glory) + Number(dataSheet.data.wisdom) + Number(dataSheet.data.honor);

  return (
    <ManageCollectionFrame
      title="Dons"
      description="Gerencie os dons disponíveis para a tribo, o augúrio e o total de renome do personagem ativo."
      onClose={() => setShowGiftsToAdd(false)}
      sidebar={(
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-4 pb-10">
          <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="font-kingthings text-base uppercase tracking-[0.18em] text-white">Dons Adicionados</p>
              <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
                Itens atualmente vinculados à ficha
              </p>
            </div>
            <span className="border border-red-950 bg-red-950 px-2 py-1 font-geist-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              {selectedGifts.length}
            </span>
          </div>
          <div className="mt-4 space-y-2.5 pb-10">
            {selectedGifts.length === 0 ? (
              <div className="border border-white/10 bg-black/45 px-4 py-5 text-center font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
                Nenhum dom adicionado.
              </div>
            ) : (
              selectedGifts.map((item: any, index: number) => (
                <div key={`${item.gift}-${index}`} className="border border-red-700/60 bg-black/55 px-4 py-3 shadow-[0_0_20px_rgba(127,29,29,0.16)]">
                  <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">{item.giftPtBr}</p>
                  <p className="mt-1 font-geist-mono text-[10px] uppercase tracking-[0.1em] text-white/55">{item.gift}</p>
                  <p className="mt-2 font-geist-mono text-[10px] leading-5 text-white/72">
                    {item.belonging.map((belong: { type: string; totalRenown: number }, belongIndex: number) => (
                      <span key={`${item.gift}-${belong.type}-${belongIndex}`}>
                        {capitalizeFirstLetter(belong.type)} ({belong.totalRenown})
                        {belongIndex === item.belonging.length - 1 ? '' : ', '}
                      </span>
                    ))}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    >
      <div className="grid h-full grid-rows-[auto,minmax(0,1fr)] gap-4 overflow-hidden">
        <div className="border border-white/10 bg-black/45 px-4 py-3 ">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Tribo</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">
                {dataSheet.data.trybe ? capitalizeFirstLetter(dataSheet.data.trybe) : 'Não definida'}
              </p>
            </div>
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Augúrio</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">
                {dataSheet.data.auspice ? capitalizeFirstLetter(dataSheet.data.auspice) : 'Não definido'}
              </p>
            </div>
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Renome Total</p>
              <p className="mt-1 font-kingthings text-[0.82rem] uppercase tracking-[0.16em] text-white">{totalRenown}</p>
            </div>
          </div>
        </div>
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-3 pb-10 sm:p-4 sm:pb-10">
          {availableGifts.length === 0 ? (
            <div className="border border-white/10 bg-black/45 px-4 py-6 text-center font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
              Nenhum dom disponível para os critérios atuais.
            </div>
          ) : (
            <div className="space-y-3 pb-10">
              {availableGifts.map((gift: any, index: number) => (
                <div key={`${gift.gift}-${index}`} className=""><Gift gift={gift} index={index} length={availableGifts.length} /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ManageCollectionFrame>
  );
}