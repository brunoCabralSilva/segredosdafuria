'use client';

import Image from 'next/image';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import listTrybes from '../../data/trybes.json';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import contexto from '@/context/context';
import Simplify from '@/components/simplify';
import DiscoverTrybePopup from '@/components/popup/discoverTrybe';
import TrybeQuizResultsPopup from '@/components/popup/trybeQuizResults';

const introParagraphs = [
  'As tribos são grupos de lobisomens unidos por um propósito espiritual comum e afinidades compartilhadas. Cada tribo é associada a um Espírito Patrono, e os Garou que fazem parte dela prometem seguir os valores desse espírito, criando uma relação profunda de compromisso espiritual.',
  'As tribos também representam comunidade, visão de mundo e identidade. Mesmo quando há discordâncias internas, elas seguem moldando a cultura dos Garou, suas aptidões e a maneira como se relacionam com Gaia, com a natureza e com o próprio Apocalipse.',
];

const sortedTrybes = [...listTrybes].sort((a, b) =>
  a.namePtBr.localeCompare(b.namePtBr, 'pt-BR')
);

const getTrybePreview = (text: string, totalLength = 65) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength).trimEnd()}...`;
};

export default function Trybes() {
  const { resetPopups, simplify } = useContext(contexto);
  const [showDiscoverTrybe, setShowDiscoverTrybe] = useState(false);
  const [showTrybeResults, setShowTrybeResults] = useState(false);

  useEffect(() => {
    resetPopups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="w-full h-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />
        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="relative overflow-hidden text-white">
            <div className="relative px-5 pb-8 sm:px-8">
              <div className="grid gap-8">
                <div>
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Tribos</h1>
                  <hr className="mt-5" />
                  <p className="mt-4 w-full font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
                    Conheça as tribos Garou, seus espíritos patronos e os caminhos que moldam suas identidades dentro da Nação.
                  </p>

                  <div className="mt-6 space-y-4 text-sm leading-7 text-white/82 sm:text-[15px]">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 border border-zinc-500/30 bg-black/45 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
                          NÃO SABE QUAL SUA TRIBO?
                        </p>
                        <p className="mt-2 max-w-2xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
                          Responda 11 situações inspiradas no material das tribos e descubra qual delas mais ecoa com seu jeito de agir.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setShowDiscoverTrybe(true)}
                          className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-5 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                        >
                          Descubra sua tribo
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTrybeResults(true)}
                          className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-5 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
                        >
                          Veja os resultados
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedTrybes.map((trybe) => {
                  const cardPreview = getTrybePreview(String(trybe.alternativeDescription?.[0] || trybe.description?.[0] || ''));

                  return (
                    <Link
                      href={`/trybes/${trybe.nameEn.toLowerCase().replace(/ /g, '-')}`}
                      key={trybe.nameEn}
                      className="group relative h-full overflow-hidden border border-zinc-500/30 bg-black p-5 transition-colors"
                    >
                      <div className="absolute inset-0 pointer-events-none">
                        <Image
                          src={`/images/trybes/${trybe.namePtBr} - wallpaper.jpg`}
                          alt=""
                          className="w-full h-full object-cover object-top opacity-20"
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>

                      <div className="relative z-10 space-y-3 px-4 py-4 text-left text-white">
                        <div className="flex justify-start">
                          <Image
                            src={`/images/trybes/${trybe.namePtBr}.png`}
                            alt={`Glifo da tribo ${trybe.namePtBr}`}
                            className="block h-16 w-16 origin-left transform-gpu object-contain transition-transform duration-300 ease-out scale-1 hover:scale-[1.5] sm:h-20 sm:w-20"
                            width={200}
                            height={200}
                          />
                        </div>

                        <div className="font-geist-mono text-[10px] uppercase text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                          <p className="mt-1 text-[11px] text-white">{trybe.renown}</p>
                        </div>

                        <div>
                          <p className="font-kingthings text-xl sm:text-2xl uppercase leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                            {trybe.namePtBr}
                          </p>
                          <p className="mt-2 font-geist-mono text-[10px] uppercase leading-5 text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                            {Array.isArray(trybe.verbs) ? trybe.verbs.join(' - ') : ''}
                          </p>
                        </div>

                        <div className="space-y-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                          <p className="line-clamp-3 font-geist-mono text-[11px] leading-6 text-white/75">
                            {cardPreview}
                          </p>
                          <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60 border-t border-white/10 pt-3">
                            Padroeiro: <span className="text-white/85">{trybe.patronName || 'Não informado'}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      {showDiscoverTrybe && <DiscoverTrybePopup onClose={() => setShowDiscoverTrybe(false)} />}
      {showTrybeResults && <TrybeQuizResultsPopup onClose={() => setShowTrybeResults(false)} />}
    </div>
  );
}
