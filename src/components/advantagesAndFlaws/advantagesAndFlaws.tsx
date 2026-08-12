'use client'
import { useContext } from 'react';
import contexto from '@/context/context';
import AddAdvOrFlaw from '../popup/addAdvOrFlaw';
import AdvAdded from './advAdded';
import AdvTalensAdded from './advTalensAdded';
import AdvLoresheetsAdded from './advLoresheetsAdded';

export default function AdvantagesAndFlaws() {
  const {
    dataSheet,
    showAllFlaws,
    showAllAdvantages, setShowAllAdvantages,
  } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const advantagesAndFlaws = sheetData?.advantagesAndFlaws;
  const advantages = Array.isArray(advantagesAndFlaws?.advantages) ? advantagesAndFlaws.advantages : [];
  const talens = Array.isArray(advantagesAndFlaws?.talens) ? advantagesAndFlaws.talens : [];
  const loresheets = Array.isArray(advantagesAndFlaws?.loresheets) ? advantagesAndFlaws.loresheets : [];
  const flaws = Array.isArray(advantagesAndFlaws?.flaws) ? advantagesAndFlaws.flaws : [];

  const sumAllAdvantagesAndFlaws = () => {
    let advantageSum = 0;
    let flawSum = 0;
    advantages.forEach((item: any) => advantageSum += item.cost);
    talens.forEach((item: any) => advantageSum += item.value);
    loresheets.forEach((item: any) => advantageSum += item.cost);
    flaws.forEach((item: any) => flawSum += item.cost);
    const textAdvantage = advantageSum + ' / 7';
    const textFlaw = flawSum + ' / 2';

    return (
      <div className="space-y-1.5 px-5 pt-3 font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/70">
        <div className={`${advantageSum > 7 ? 'text-red-700' : advantageSum === 7 ? 'text-[#77a77e]' : 'text-white/70'} flex items-center justify-between gap-3 border-b border-white/5 pb-1.5`}>
          <span>Total em Vantagens</span>
          <span>{textAdvantage}</span>
        </div>
        <div className={`${flawSum > 2 ? 'text-red-700' : flawSum === 2 ? 'text-[#77a77e]' : 'text-white/70'} flex items-center justify-between gap-3 pb-0.5`}>
          <span>Total em Defeitos</span>
          <span>{textFlaw}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="visage-card relative md:mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-slate-300 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <p className="font-kingthings text-[0.82rem] uppercase tracking-[0.26em] text-red-500/85">Vantagens</p>
        <button
          type="button"
          onClick={() => setShowAllAdvantages(true)}
          className="sheet-readonly-action inline-flex p-2 font-geist-mono text-[9px] items-center justify-center border border-red-950 bg-red-950 text-white transition-colors hover:bg-red-900 uppercase"
          aria-label="Gerenciar Vantagens e Defeitos"
        >
          Gerenciar
        </button>
      </div>
      <div className="mx-6 border-b border-white/10" />
      <div className="pb-4">
        {sumAllAdvantagesAndFlaws()}
        <div className="mb-2 mt-3 flex h-full w-full flex-col items-start justify-center px-5 font-bold">
          {advantages.length > 0 && (
            <div className="w-full">
              <div className="mb-2 mt-4 border-b border-white/10 pb-1 font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/55">MÉRITOS E BACKGROUNDS</div>
              <div className="space-y-2.5">
                {advantages.map((item: any, index: number) => (
                  <AdvAdded key={index} item={item} />
                ))}
              </div>
            </div>
          )}
          {talens.length > 0 && (
            <div className="w-full">
              <div className="mb-2 mt-4 border-b border-white/10 pb-1 font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/55">TALISMÃS</div>
              <div className="space-y-2.5">
                {talens.map((item: any, index: number) => (
                  <AdvTalensAdded key={index} item={item} />
                ))}
              </div>
            </div>
          )}
          {loresheets.length > 0 && (
            <div className="w-full">
              <div className="mb-2 mt-4 border-b border-white/10 pb-1 font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/55">LORESHEETS</div>
              <div className="space-y-2.5">
                {loresheets.map((item: any, index: number) => (
                  <AdvLoresheetsAdded key={index} item={item} />
                ))}
              </div>
            </div>
          )}
          {flaws.length > 0 && (
            <div className="w-full">
              <div className="mb-2 mt-4 border-b border-white/10 pb-1 font-geist-mono text-[9px] uppercase tracking-[0.14em] text-white/55">DEFEITOS</div>
              <div className="space-y-2.5">
                {flaws.map((item: any, index: number) => (
                  <AdvAdded key={index} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
        {showAllAdvantages && <AddAdvOrFlaw type="advantage" />}
        {showAllFlaws && <AddAdvOrFlaw type="flaw" />}
      </div>
    </section>
  );
}