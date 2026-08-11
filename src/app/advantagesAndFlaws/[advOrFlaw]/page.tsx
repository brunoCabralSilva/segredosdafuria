'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Simplify from '@/components/simplify';
import contexto from '@/context/context';
import listAdvantagesOrFlaws from '../../../data/advantagesAndFlaws.json';
import { IAdOrFlaws } from '@/interface';


const returnDots = (value: number) => '●'.repeat(value);

const getRelatedBooks = (item: IAdOrFlaws) => {
  const books = [
    ...(item.advantages || []).map((advantage) => String(advantage.font).trim()),
    ...(item.flaws || []).map((flaw) => String(flaw.font).trim()),
  ].filter((book) => book !== '');

  return Array.from(new Set(books)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
};

export default function AdvOrFlaw() {
  const params = useParams();
  const advOrFlaw = params?.advOrFlaw as string;
  const [dataAdvOrFlaw, setDataAdvOrFlaw] = useState<IAdOrFlaws>();
  const { resetPopups, simplify } = useContext(contexto);

  useEffect(() => {
    resetPopups();

    const findAdvOrFlaw = (listAdvantagesOrFlaws as IAdOrFlaws[]).find(
      (item) => String(item.id) === advOrFlaw,
    );

    setDataAdvOrFlaw(findAdvOrFlaw);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advOrFlaw]);

  const relatedBooks = useMemo(() => {
    if (!dataAdvOrFlaw) return [];
    return getRelatedBooks(dataAdvOrFlaw);
  }, [dataAdvOrFlaw]);

  const sortedAdvantages = useMemo(() => {
    if (!dataAdvOrFlaw?.advantages) return [];
    return [...dataAdvOrFlaw.advantages].sort((a, b) => a.cost - b.cost);
  }, [dataAdvOrFlaw]);

  const sortedFlaws = useMemo(() => {
    if (!dataAdvOrFlaw?.flaws) return [];
    return [...dataAdvOrFlaw.flaws].sort((a, b) => a.cost - b.cost);
  }, [dataAdvOrFlaw]);

  if (!dataAdvOrFlaw) {
    return (
      <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
        <div className="h-full w-full bg-black/80">
          <Simplify />
          <div className="absolute inset-0 bg-black/85" />
          <Nav />
          <main className="relative z-10 mx-auto flex min-h-[60vh] w-full max-w-[1200px] items-center justify-center px-4 py-10 text-white sm:px-8">
            <div className="border border-zinc-500/30 bg-black/80 px-6 py-8 text-center">
              <p className="font-geist-mono text-xs uppercase tracking-[0.12em] text-white/65">Vantagem ou defeito</p>
              <h1 className="mt-3 font-kingthings text-3xl text-white">Não encontrado</h1>
              <p className="mt-4 font-geist-mono text-sm leading-6 text-white/75">
                Não foi possível localizar este item no momento.
              </p>
              <Link
                href="/advantagesAndFlaws"
                className="mt-6 inline-flex border border-zinc-500/30 bg-[#7a0000] px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
              >
                Ver todas as opções
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
                {String(dataAdvOrFlaw.name).charAt(0)}
              </p>
            </div>

            <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10">
              <Link
                href="/advantagesAndFlaws"
                className="inline-flex border border-zinc-500/30 bg-black/70 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-red-700 hover:text-white"
              >
                Voltar para vantagens e defeitos
              </Link>

              <div className="mt-6">
                <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
                  {dataAdvOrFlaw.type}
                </p>
                <h1 className="mt-3 font-kingthings text-2xl leading-none text-white sm:text-3xl lg:text-4xl">
                  {dataAdvOrFlaw.name}
                </h1>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                  <span className="text-white">VANTAGENS DISPONÍVEIS:</span> {sortedAdvantages.length}
                </p>
                <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                  <span className="text-white">DEFEITOS DISPONÍVEIS:</span> {sortedFlaws.length}
                </p>
                {relatedBooks.length > 0 && (
                  <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                    <span className="text-white">FONTES:</span> {relatedBooks.join(' • ')}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-6 border-t border-white/10 pt-6">
                <div>
                  <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Descrição</h2>
                  <p className="mt-4 text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                    {dataAdvOrFlaw.description}
                  </p>
                </div>

                {sortedAdvantages.length > 0 && (
                  <div>
                    <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Vantagens</h2>
                    <div className="mt-4 space-y-4">
                      {sortedAdvantages.map((advantage) => (
                        <article
                          key={`${dataAdvOrFlaw.name}-$({returnDots(advantage.cost)}) {advantage.title}-${advantage.cost}`}
                          className="border border-zinc-500/30 bg-black/40 p-4"
                        >
                          <h3 className="font-kingthings text-xl leading-none text-white sm:text-2xl">
                            {advantage.title} ({returnDots(advantage.cost)})
                          </h3>
                          <p className="mt-4 text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                            {advantage.description}
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                              <span className="text-white">FONTE:</span> {advantage.font}, pg. {advantage.page}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {sortedFlaws.length > 0 && (
                  <div>
                    <h2 className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white sm:text-xs">Defeitos</h2>
                    <div className="mt-4 space-y-4">
                      {sortedFlaws.map((flaw) => (
                        <article
                          key={`${dataAdvOrFlaw.name}-$({returnDots(flaw.cost)}) {flaw.title}-${flaw.cost}`}
                          className="border border-zinc-500/30 bg-black/40 p-4"
                        >
                          <h3 className="font-kingthings text-xl leading-none text-white sm:text-2xl">
                            {flaw.title} ({returnDots(flaw.cost)})
                          </h3>
                          <p className="mt-4 text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                            {flaw.description}
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-justify font-geist-mono text-[11px] leading-7 text-white/75 sm:text-xs">
                              <span className="text-white">FONTE:</span> {flaw.font}, pg. {flaw.page}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
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


