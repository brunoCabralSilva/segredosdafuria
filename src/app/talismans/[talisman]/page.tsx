'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Simplify from '@/components/simplify';
import contexto from '@/context/context';
import listTalismans from '../../../data/talismans.json';
import { ITalisman } from '../../../interface';

export default function Talisman() {
  const params = useParams();
  const talisman = params?.talisman as string;
  const [dataTalisman, setDataTalisman] = useState<ITalisman>();
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();

    const findTalisman = listTalismans.find((item: ITalisman) => talisman === item.id);
    setDataTalisman(findTalisman);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talisman]);

  if (!dataTalisman) {
    return (
      <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
        <div className="h-full w-full bg-black/80">
          <Simplify />
          <div className="absolute inset-0 bg-black/85" />
          <Nav />
          <main className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-4 py-10 text-white sm:px-8">
            <div className="border border-zinc-500/30 bg-black/80 px-6 py-8 text-center">
              <p className="font-geist-mono text-xs uppercase tracking-[0.12em] text-white/65">Talismã</p>
              <h1 className="mt-3 font-kingthings text-3xl text-white">Não encontrado</h1>
              <p className="mt-4 font-geist-mono text-sm leading-6 text-white/75">
                Não foi possível localizar este talismã no momento.
              </p>
              <Link
                href="/talismans"
                className="mt-6 inline-flex border border-zinc-500/30 bg-[#7a0000] px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
              >
                Ver todos os talismãs
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
      <div className="h-full w-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />

        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="group relative overflow-hidden border border-zinc-500/30 bg-black text-white">
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-[0.08]">
              <p className="font-kingthings text-[120px] leading-none text-white sm:text-[160px]">
                T
              </p>
            </div>

            <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10">
              <Link
                href="/talismans"
                className="inline-flex border border-zinc-500/30 bg-black/70 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-red-700 hover:text-white"
              >
                Voltar para talismãs
              </Link>

              <div className="mt-6">
                <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
                  Talismã
                </p>
                <h1 className="mt-3 font-kingthings text-2xl leading-none text-white sm:text-3xl lg:text-4xl">
                  {dataTalisman.titlePtBr}
                </h1>
                <p className="mt-3 font-geist-mono text-[11px] uppercase leading-6 text-white/70">
                  {dataTalisman.title}
                </p>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                  <span className="text-white">CUSTO:</span> {dataTalisman.backgroundCostPtBr}
                </p>
                <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                  <span className="text-white">FONTE:</span> {dataTalisman.book}, pg. {dataTalisman.page}
                </p>
              </div>

              <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
                <div>
                  <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Descrição</h2>
                  <p className="mt-4 text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                    {dataTalisman.descriptionPtBr}
                  </p>
                </div>

                {String(dataTalisman.systemPtBr).trim() !== '' && (
                  <div>
                    <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Sistema</h2>
                    <p className="mt-4 text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                      {dataTalisman.systemPtBr}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

