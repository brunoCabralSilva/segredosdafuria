'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import contexto from '@/context/context';
import { IRitual } from '../../interface';

const ITEMS_PER_PAGE = 9;

const getRitualPreview = (text: string, totalLength = 170) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength).trimEnd()}...`;
};

export default function ListRituals() {
  const { listOfRituals } = useContext(contexto);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [listOfRituals]);

  const totalPages = Math.max(1, Math.ceil(listOfRituals.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRituals = listOfRituals.slice(startIndex, endIndex);

  const visiblePages = useMemo(() => {
    const pages = [];
    const windowStart = Math.max(1, currentPage - 2);
    const windowEnd = Math.min(totalPages, currentPage + 2);

    for (let page = windowStart; page <= windowEnd; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <section className="space-y-4">
      <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
          Total de Rituais Encontrados: <span className="text-white">{listOfRituals.length}</span>
        </p>
        {listOfRituals.length > 0 && (
          <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
            Mostrando {startIndex + 1}-{Math.min(endIndex, listOfRituals.length)}
          </p>
        )}
      </div>

      {listOfRituals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedRituals.map((item: IRitual, index: number) => {
              const cardPreview = getRitualPreview(String(item.descriptionPtBr || item.description || ''));

              return (
                <Link
                  href={`/rituals/${item.id}`}
                  key={`${item.id}-${index}`}
                  className="group relative h-full overflow-hidden border border-zinc-500/30 bg-black p-5 transition-colors hover:border-red-700"
                >
                  <div className="relative z-10 space-y-3 px-4 py-4 text-left text-white">
                    <div>
                      <p className="font-kingthings text-xl leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] group-hover:text-red-500 sm:text-2xl">
                        {item.titlePtBr}
                      </p>
                      <p className="mt-2 font-geist-mono text-[10px] uppercase leading-5 text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {item.title}
                      </p>
                    </div>

                    <div className="space-y-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      <p className="line-clamp-4 font-geist-mono text-[11px] leading-6 text-white/75 text-justify">
                        {cardPreview}
                      </p>
                      <p className="border-t border-white/10 pt-3 font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Tipo: <span className="normal-case text-white/85">{item.type}</span>
                      </p>
                      <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Parada: <span className="normal-case text-white/85">{item.pool || 'Nenhuma'}</span>
                      </p>
                      <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Fonte: <span className="normal-case text-white/85">{item.book}</span>
                      </p>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 border border-zinc-500/30 bg-black/80 p-5 text-white">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="border border-zinc-500/30 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors disabled:cursor-default disabled:opacity-40 hover:border-red-700 hover:text-red-400"
              >
                Anterior
              </button>

              {visiblePages[0] > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="border border-zinc-500/30 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:border-red-700 hover:text-red-400"
                  >
                    1
                  </button>
                  {visiblePages[0] > 2 && <span className="px-1 font-geist-mono text-white/40">...</span>}
                </>
              )}

              {visiblePages.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`border px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${page === currentPage ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                >
                  {page}
                </button>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-1 font-geist-mono text-white/40">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    className="border border-zinc-500/30 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:border-red-700 hover:text-red-400"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="border border-zinc-500/30 px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors disabled:cursor-default disabled:opacity-40 hover:border-red-700 hover:text-red-400"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
          <p className="font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
            Nenhum ritual encontrado com os filtros atuais.
          </p>
        </div>
      )}
    </section>
  );
}


