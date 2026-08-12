'use client'
import { useContext } from 'react';
import contexto from '@/context/context';
import ItemAtr from '../sheetItems/itemAtr';
import { usePathname } from 'next/navigation';

export default function Attributes() {
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { dataSheet } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const sheetAttributes = sheetData?.attributes;
  const advantages = sheetData?.advantagesAndFlaws?.advantages ?? [];

  const hasResilienciaDeLuna = advantages.some(
    (advantage: { title: string }) => advantage.title === 'Resiliência de Luna'
  );

  const getSheetStandalonePhysicalValue = (name: 'strength' | 'dexterity' | 'stamina') => {
    const currentValue = Number(sheetAttributes?.[name] || 0);

    if (!isSheetStandalone) return currentValue;

    if (sheetData?.form === 'Crinos') {
      return Math.max(0, currentValue - 4);
    }

    if (sheetData?.form === 'Hispo' || sheetData?.form === 'Glabro') {
      return Math.max(0, currentValue - (hasResilienciaDeLuna ? 4 : 2));
    }

    return currentValue;
  };

  const physicalQuant = isSheetStandalone ? 6 : sheetData?.form === 'Crinos' ? 10 : 6;
  const titleClass = 'px-6 pb-3 pt-5 font-kingthings text-[0.82rem] uppercase tracking-[0.28em] text-red-500/85';
  const bodyClass = 'px-6 pb-5 pt-2';

  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:gap-5 xl:grid-cols-3">
      <section className="relative mt-2 sm:mt-5 w-full overflow-hidden border border-white/10 bg-gradient-to-br from-black to-zinc-950 text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div>
          <p className={titleClass}>Atributos Físicos</p>
          <div className="mx-6 border-b border-zinc-500/20" />
          <div className={bodyClass}>
            <ItemAtr value={getSheetStandalonePhysicalValue('strength')} namePtBr="Força" name="strength" quant={physicalQuant} />
            <ItemAtr value={getSheetStandalonePhysicalValue('dexterity')} name="dexterity" namePtBr="Destreza" quant={physicalQuant} />
            <ItemAtr value={getSheetStandalonePhysicalValue('stamina')} name="stamina" namePtBr="Vigor" quant={physicalQuant} />
          </div>
        </div>
      </section>
      <section className="relative sm:mt-5 w-full overflow-hidden border border-white/10 bg-gradient-to-br from-black to-zinc-950 text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div>
          <p className={titleClass}>Atributos Sociais</p>
          <div className="mx-6 border-b border-zinc-500/20" />
          <div className={bodyClass}>
            <ItemAtr value={Number(sheetAttributes?.charisma || 0)} name="charisma" namePtBr="Carisma" quant={6} />
            <ItemAtr value={Number(sheetAttributes?.manipulation || 0)} name="manipulation" namePtBr="Manipulação" quant={6} />
            <ItemAtr value={Number(sheetAttributes?.composure || 0)} name="composure" namePtBr="Autocontrole" quant={6} />
          </div>
        </div>
      </section>
      <section className="relative sm:mt-5 w-full overflow-hidden border border-white/10 bg-gradient-to-br from-black to-zinc-950 text-white shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div>
          <p className={titleClass}>Atributos Mentais</p>
          <div className="mx-6 border-b border-zinc-500/20" />
          <div className={bodyClass}>
            <ItemAtr value={Number(sheetAttributes?.intelligence || 0)} name="intelligence" namePtBr="Inteligência" quant={6} />
            <ItemAtr value={Number(sheetAttributes?.wits || 0)} name="wits" namePtBr="Raciocínio" quant={6} />
            <ItemAtr value={Number(sheetAttributes?.resolve || 0)} name="resolve" namePtBr="Determinação" quant={6} />
          </div>
        </div>
      </section>
    </div>
  );
}