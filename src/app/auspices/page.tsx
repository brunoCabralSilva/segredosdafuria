'use client';

import { useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer';
import listAuspices from '../../data/auspices.json';
import contexto from '@/context/context';
import Nav from '@/components/nav';
import Simplify from '@/components/simplify';

const auspiceMeta: Record<string, { moon: string; role: string; glow: string }> = {
  Ragabash: {
    moon: 'Lua Nova',
    role: 'Trapaceiro',
    glow: 'from-amber-300/20 via-orange-500/10 to-transparent',
  },
  Theurge: {
    moon: 'Lua Crescente',
    role: 'Místico',
    glow: 'from-cyan-300/20 via-sky-500/10 to-transparent',
  },
  Philodox: {
    moon: 'Meia-Lua',
    role: 'Juiz',
    glow: 'from-zinc-200/20 via-zinc-500/10 to-transparent',
  },
  Galliard: {
    moon: 'Lua Gibosa',
    role: 'Cronista',
    glow: 'from-yellow-300/20 via-red-500/10 to-transparent',
  },
  Ahroun: {
    moon: 'Lua Cheia',
    role: 'Guerreiro',
    glow: 'from-red-400/25 via-red-700/10 to-transparent',
  },
};

const introParagraphs = [
  'A lua marca o destino de cada Garou desde o primeiro uivo. Cada fase entrega um temperamento, uma responsabilidade e uma maneira própria de sustentar a matilha diante do Apocalipse.',
  'Nenhum lobisomem precisa carregar sozinho toda a história do povo Garou. Os augúrios existem para dividir peso, visão e fúria, fazendo com que a matilha sobreviva porque age em conjunto.',
];

const auspiceOrder = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];

const sortedAuspices = [...listAuspices].sort(
  (a, b) => auspiceOrder.indexOf(a.name) - auspiceOrder.indexOf(b.name)
);

export default function Auspices() {
  const { resetPopups, simplify } = useContext(contexto);

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
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Augúrios</h1>
                  <hr className="mt-5" />
                  <p className="mt-4 w-full font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px] text-justify">
                    Entenda como cada fase da lua molda o papel de um Garou dentro da matilha, da sociedade e da guerra contra a Wyrm.
                  </p>

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {sortedAuspices.map((auspice) => {
                  const meta = auspiceMeta[auspice.name] || {
                    moon: 'Fase Lunar',
                    role: 'Augúrio',
                    glow: 'from-white/15 via-transparent to-transparent',
                  };

                  return (
                    <Link
                      key={auspice.name}
                      href={`/auspices/${auspice.name.toLowerCase()}`}
                      className="group relative overflow-hidden border border-gray-900 bg-black/75 p-5 text-white text-justify transition-colors cursor-default sm:p-6"
                    >
                      <div className="relative z-10 flex h-full flex-col text-justify">
                        <div className="flex items-center gap-4">
                          <Image
                            src={`/images/auspices/${auspice.name}.png`}
                            alt={`Glifo do augúrio ${auspice.name}`}
                            className="h-16 w-16 shrink-0 object-contain transition-all duration-300 group-hover:scale-105 sm:h-20 sm:w-20"
                            width={200}
                            height={200}
                          />
                          <div>
                            <p className="font-geist-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                              {meta.moon}
                            </p>
                            <h3 className="mt-2 font-kingthings text-2xl transition-colors group-hover:text-red-500">
                              {auspice.name}
                            </h3>
                          </div>
                        </div>

                        <p className="mt-2 font-geist-mono text-xs italic leading-6 text-white/60">
                          &quot;{auspice.phrase}&quot;
                        </p>

                        <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
                          {auspice.description.map((paragraph, index) => (
                            <p
                              key={`${auspice.name}-${index}`}
                              className="font-geist-mono text-[11px] leading-6 text-white/68 sm:text-xs"
                            >
                              {paragraph}
                            </p>
                          ))}
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
    </div>
  );
}








