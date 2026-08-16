'use client';

import listTrybes from '@/data/trybes.json';
import { getTrybeQuizScoreboard, type TrybeQuizScoreboardItem } from '@/firebase/trybeQuiz';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function TrybeQuizResultsPopup(props: { onClose: () => void }) {
  const { onClose } = props;
  const [scoreboard, setScoreboard] = useState<TrybeQuizScoreboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const rankedScoreboard = useMemo(() => {
    return [...scoreboard]
      .map((item) => ({
        ...item,
        trybe: listTrybes.find((trybe) => trybe.nameEn === item.trybeId) || null,
      }))
      .sort((first, second) => {
        if (second.total !== first.total) return second.total - first.total;
        return String(first.trybe?.namePtBr || first.trybeId).localeCompare(
          String(second.trybe?.namePtBr || second.trybeId),
          'pt-BR',
        );
      });
  }, [scoreboard]);

  const totalResults = useMemo(() => {
    return scoreboard.reduce((total, item) => total + Number(item.total || 0), 0);
  }, [scoreboard]);

  useEffect(() => {
    let ignore = false;

    const loadScoreboard = async () => {
      try {
        setLoading(true);
        const nextScoreboard = await getTrybeQuizScoreboard();
        if (ignore) return;
        setScoreboard(nextScoreboard);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadScoreboard();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-y-auto border border-zinc-500/40 bg-black/90">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/95.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar resultados das tribos"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Veja Os Resultados</h2>
          <p className="mt-2 max-w-3xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Acompanhe o placar persistido do teste de tribos e veja quais caminhos têm aparecido com mais força entre os resultados já concluídos.
          </p>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="principles-scrollbar relative min-h-0 flex-1 border border-zinc-500/30 bg-black/45 [direction:rtl] px-2 pb-0 pt-2 pr-2 sm:px-2 sm:pb-0 sm:pt-2 sm:pr-2">
            <div className="w-full [direction:ltr]">
              <div className="border border-white/10 bg-black/60 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-geist-mono text-[11px] uppercase tracking-[0.14em] text-white/55">
                      Placar das tribos
                    </p>
                    <p className="mt-1 font-geist-mono text-xs leading-6 text-white/74 sm:text-[13px]">
                      {loading ? 'Carregando resultados persistidos...' : `${totalResults} resultados registrados até agora.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 pb-2">
                {rankedScoreboard.map((item, index) => (
                  <div
                    key={item.trybeId}
                    className={`grid gap-4 border p-4 sm:grid-cols-[72px_minmax(0,1fr)_96px] sm:items-center ${
                      index === 0 ? 'border-red-700/70 bg-red-950/20' : 'border-zinc-500/30 bg-black/55'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/10 bg-black/70 sm:h-16 sm:w-16">
                        {item.trybe && (
                          <Image
                            src={`/images/trybes/${item.trybe.namePtBr}.png`}
                            alt={`Glifo da tribo ${item.trybe.namePtBr}`}
                            className="h-full w-full object-contain p-2"
                            fill
                            sizes="64px"
                          />
                        )}
                      </div>
                      <span className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/40 sm:hidden">
                        #{index + 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="hidden font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/40 sm:inline">
                          #{index + 1}
                        </span>
                        <p className="font-kingthings text-xl leading-none text-white sm:text-2xl">
                          {item.trybe?.namePtBr || item.trybeId}
                        </p>
                      </div>
                      <p className="mt-2 font-geist-mono text-[10px] uppercase tracking-[0.12em] text-white/58">
                        {item.trybe?.alternativeTitle || 'Tribo'}
                      </p>
                      <p className="mt-2 font-geist-mono text-xs leading-6 text-white/72 sm:text-[13px]">
                        {item.trybe?.patronName ? `Padroeiro: ${item.trybe.patronName}` : 'Sem dados complementares.'}
                      </p>
                    </div>

                    <div className="border border-white/10 bg-black/60 px-4 py-3 text-left sm:text-center">
                      <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                        Vitórias
                      </p>
                      <p className="mt-2 font-geist-mono text-2xl font-bold text-white">
                        {item.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
            >
              Fechar
            </button>
            <Link
              href="/trybes"
              className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            >
              Ver Tribos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
