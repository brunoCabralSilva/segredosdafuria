'use client';

import listTrybes from '@/data/trybes.json';
import { getTrybeQuizScoreboard, type TrybeQuizScoreboardItem } from '@/firebase/trybeQuiz';
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
      <div className="principles-scrollbar relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-y-auto overflow-x-hidden border border-zinc-500/40 bg-black/90">
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

        <div className="relative z-10 px-5 pb-4 pt-6 sm:px-8 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Veja Os Resultados</h2>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="border border-white/10 bg-black/60 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                Placar das tribos
              </p>
              <p className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                {loading ? 'Carregando resultados...' : `${totalResults} votos registrados`}
              </p>
            </div>
          </div>

          <div className="principles-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden border border-zinc-500/30 bg-black/45 [direction:rtl] px-2 pb-0 pt-2 pr-2">
            <div className="w-full [direction:ltr]">
              <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-x-3 gap-y-2 pb-2">
                {rankedScoreboard.map((item, index) => (
                  <div key={item.trybeId} className="contents">
                    <div
                      className={`flex items-center gap-3 border px-3 py-2 ${
                        index === 0 ? 'border-red-700/70 bg-red-950/20' : 'border-zinc-500/30 bg-black/55'
                      }`}
                    >
                      <span className="w-6 shrink-0 font-geist-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                        #{index + 1}
                      </span>
                      <span className="truncate font-geist-mono text-xs text-white/82 sm:text-[13px]">
                        {item.trybe?.namePtBr || item.trybeId}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-center border px-3 py-2 ${
                        index === 0 ? 'border-red-700/70 bg-red-950/20' : 'border-zinc-500/30 bg-black/55'
                      }`}
                    >
                      <span className="font-geist-mono text-xs font-bold text-white sm:text-[13px]">
                        {item.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}