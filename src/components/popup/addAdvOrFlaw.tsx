'use client'
import { useContext, useState } from "react";
import contexto from "@/context/context";
import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import dataTalens from '../../data/talismans.json';
import dataLoresheets from '../../data/loresheets.json';
import ItemLoresheet from "../sheetItems/itemLoresheets";
import ItemTalisman from "../sheetItems/itemTalisman";
import ItemAdvantage from "../sheetItems/itemAdvantage";
import { ILoresheet } from "@/interface";
import AdvOrFlawAdded from "../advantagesAndFlaws/advOrFlawAdded";
import ManageCollectionFrame from "./manageCollectionFrame";

export default function AddAdvOrFlaw(props: { type: string }) {
  const [selectOption, setSelectOption] = useState('merits');
  const { type } = props;
  const { dataSheet, setShowAllAdvantages, setShowAllFlaws } = useContext(contexto);

  const closePopup = () => {
    setShowAllAdvantages(false);
    setShowAllFlaws(false);
  };

  const returnSumOfAdvantages = (list: { cost?: number; value?: number }[]) => {
    return list.reduce((total, item) => total + (item.cost ?? item.value ?? 0), 0);
  };

  const tabButtonClassName = (value: string) => {
    const active = selectOption === value;
    return active
      ? 'inline-flex items-center gap-3 border border-red-950 bg-red-950 px-3 py-2 font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors'
      : 'inline-flex items-center gap-3 border border-white/10 bg-black/40 px-3 py-2 font-geist-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-red-900 hover:bg-red-950/30 hover:text-white';
  };

  const badgeClassName = 'inline-flex min-w-[1.7rem] items-center justify-center border border-white/10 bg-black/45 px-1.5 py-1 text-[10px] font-bold text-white';

  const renderCollection = () => {
    if (type === 'flaw' || selectOption === 'flaws') {
      return dataAdvAndFlaws
        .filter((adv: any) => adv.flaws?.length > 0)
        .map((item: any, index: number) => (
          <div key={`${item.name}-${index}`} className="pb-2">
            <ItemAdvantage type="flaw" item={item} />
          </div>
        ));
    }

    if (selectOption === 'talens') {
      return dataTalens.map((item: any, index: number) => (
        <div key={`${item.titlePtBr}-${index}`} className="pb-2">
          <ItemTalisman item={item} />
        </div>
      ));
    }

    if (selectOption === 'loresheets') {
      return (
        <div>
          {dataLoresheets
            .filter((loresheet: ILoresheet) => !loresheet.custom)
            .map((item: any, index: number) => (
              <div key={`${item.titlePtBr}-${index}`} className="pb-2">
                <ItemLoresheet item={item} />
              </div>
            ))}
          <div className="mb-3 mt-4 border-b border-white/10 pb-2 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
            Loresheets não oficiais
          </div>
          {dataLoresheets
            .filter((loresheet: ILoresheet) => loresheet.custom)
            .map((item: any, index: number) => (
              <div key={`${item.titlePtBr}-custom-${index}`} className="pb-2">
                <ItemLoresheet item={item} />
              </div>
            ))}
        </div>
      );
    }

    return dataAdvAndFlaws
      .filter((adv: any) => adv.advantages?.length > 0)
      .map((item: any, index: number) => (
        <div key={`${item.name}-${index}`} className="pb-2">
          <ItemAdvantage type="advantage" item={item} />
        </div>
      ));
  };

  return (
    <ManageCollectionFrame
      title="Vantagens e Defeitos"
      description={type === 'advantage'
        ? 'Gerencie méritos, backgrounds, talismãs, loresheets e defeitos da ficha ativa.'
        : 'Gerencie os defeitos da ficha ativa.'}
      onClose={closePopup}
      sidebar={(
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-4 pb-10">
          <div className="space-y-4 pb-10">
            <AdvOrFlawAdded type="advantage" />
            <AdvOrFlawAdded type="flaw" />
          </div>
        </div>
      )}
    >
      <div className="grid h-full min-h-0 grid-rows-[auto,minmax(0,1fr)] gap-4 overflow-hidden">
        <div className="border border-white/10 bg-black/45 px-4 py-3">
          {type === 'advantage' ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={tabButtonClassName('merits')} onClick={() => setSelectOption('merits')}>
                <span>Méritos e Backgrounds</span>
                {dataSheet.data.advantagesAndFlaws.advantages.length > 0 && <span className={badgeClassName}>{returnSumOfAdvantages(dataSheet.data.advantagesAndFlaws.advantages)}</span>}
              </button>
              <button type="button" className={tabButtonClassName('talens')} onClick={() => setSelectOption('talens')}>
                <span>Talismãs</span>
                {dataSheet.data.advantagesAndFlaws.talens.length > 0 && <span className={badgeClassName}>{returnSumOfAdvantages(dataSheet.data.advantagesAndFlaws.talens)}</span>}
              </button>
              <button type="button" className={tabButtonClassName('loresheets')} onClick={() => setSelectOption('loresheets')}>
                <span>Loresheets</span>
                {dataSheet.data.advantagesAndFlaws.loresheets.length > 0 && <span className={badgeClassName}>{returnSumOfAdvantages(dataSheet.data.advantagesAndFlaws.loresheets)}</span>}
              </button>
              <button type="button" className={tabButtonClassName('flaws')} onClick={() => setSelectOption('flaws')}>
                <span>Defeitos</span>
                {dataSheet.data.advantagesAndFlaws.flaws.length > 0 && <span className={badgeClassName}>{returnSumOfAdvantages(dataSheet.data.advantagesAndFlaws.flaws)}</span>}
              </button>
            </div>
          ) : (
            <div>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/55">Seleção atual</p>
              <p className="mt-1 font-kingthings text-[0.88rem] uppercase tracking-[0.18em] text-white">Defeitos</p>
            </div>
          )}
        </div>
        <div className="principles-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden border border-white/10 bg-black/55 p-3 pb-10 sm:p-4 sm:pb-10">
          {renderCollection()}
        </div>
      </div>
    </ManageCollectionFrame>
  );
}