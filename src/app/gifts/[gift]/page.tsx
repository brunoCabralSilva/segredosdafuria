'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

import Simplify from '@/components/simplify';
import contexto from '@/context/context';
import listGifts from '../../../data/gifts.json';
import { IGift, ITypeGift } from '../../../interface';
import { capitalizeFirstLetter } from '@/firebase/utilities';

function getBelongingLabel(item: ITypeGift) {
  return `${capitalizeFirstLetter(item.type)} (${item.totalRenown})`;
}

export default function Gift() {
  const params = useParams();
  const gift = params?.gift as string;
  const [dataGift, setDataGift] = useState<IGift>();
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();

    const findGift = listGifts.find((gft: IGift) => gift === gft.id);
    setDataGift(findGift);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gift]);

  const belongingLabels = useMemo(() => {
    if (!dataGift) return '';
    return dataGift.belonging.map((item) => getBelongingLabel(item)).join(', ');
  }, [dataGift]);

  if (!dataGift) {
    return (
      <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
        <div className="w-full h-full bg-black/80">
          <Simplify />
          <div className="absolute inset-0 bg-black/85" />
          <Nav />
          <main className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-4 py-10 text-white sm:px-8">
            <div className="border border-zinc-500/30 bg-black/80 px-6 py-8 text-center">
              <p className="font-geist-mono text-xs uppercase tracking-[0.12em] text-white/65">Dom</p>
              <h1 className="mt-3 font-kingthings text-3xl text-white">Não encontrado</h1>
              <p className="mt-4 font-geist-mono text-sm leading-6 text-white/75">
                Não foi possível localizar este dom no momento.
              </p>
              <Link
                href="/gifts"
                className="mt-6 inline-flex border border-zinc-500/30 bg-[#7a0000] px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
              >
                Ver todos os dons
              </Link>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="w-full h-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />

        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="group relative overflow-hidden border border-zinc-500/30 bg-black text-white">
            <div className="absolute bottom-4 right-4 flex pointer-events-none flex-col items-end gap-1 opacity-10">
              {dataGift.belonging.slice(0, 2).map((giftType: ITypeGift, index: number) => (
                <div
                  key={`${dataGift.id}-background-${index}`}
                  className="flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
                >
                  <Image
                    src={`/images/gifts/${capitalizeFirstLetter(giftType.type)}.png`}
                    alt=""
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10">
              <Link
                href="/gifts"
                className="inline-flex border border-zinc-500/30 bg-black/70 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-red-700 hover:text-white"
              >
                Voltar para dons
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {dataGift.belonging.map((giftType: ITypeGift, index: number) => (
                  <Image
                    key={`${dataGift.id}-type-${index}`}
                    src={`/images/gifts/${capitalizeFirstLetter(giftType.type)}.png`}
                    alt={`Glifo ${capitalizeFirstLetter(giftType.type)}`}
                    width={80}
                    height={80}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                ))}
              </div>

              <div className="mt-6">
                <h1 className="font-kingthings text-2xl leading-none text-white sm:text-3xl lg:text-4xl">
                  {dataGift.giftPtBr}
                </h1>
                <p className="mt-3 font-geist-mono text-[11px] uppercase leading-6 text-white/70">
                  {dataGift.gift}
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                  <span className="text-white">PERTENCE A:</span> {belongingLabels}
                </p>
                <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                  <span className="text-white">RENOME:</span> {dataGift.renown}
                </p>
                <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                  <span className="text-white">CUSTO:</span> {dataGift.cost || 'Nenhum'}
                </p>
                <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                  <span className="text-white">AÇÃO:</span> {dataGift.action || 'Nenhuma'}
                </p>
                {dataGift.pool !== '' && (
                  <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                    <span className="text-white">PARADA:</span> {dataGift.pool}
                  </p>
                )}
                {dataGift.duration !== '' && (
                  <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                    <span className="text-white">DURAÇÃO:</span> {dataGift.duration}
                  </p>
                )}
                <p className="font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                  <span className="text-white">FONTE:</span> {dataGift.book}, pg. {dataGift.page}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6 space-y-6">
                <div>
                  <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Descrição</h2>
                  <p className="mt-4 font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                    {dataGift.descriptionPtBr}
                  </p>
                </div>

                <div>
                  <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Sistema</h2>
                  <p className="mt-4 font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs text-justify">
                    {dataGift.systemPtBr}
                  </p>
                </div>
              </div>


            </div>
          </section>


        </main>
      </div>
      <Footer />
    </div>
  );
}







