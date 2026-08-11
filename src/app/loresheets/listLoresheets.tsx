'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ILoresheet } from '../../interface';

type ListLoresheetsProps = {
  loresheets: ILoresheet[];
};

const ITEMS_PER_PAGE = 9;

const getLoresheetPreview = (text: string, totalLength = 170) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength).trimEnd()}...`;
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages = [];
  const windowStart = Math.max(1, currentPage - 2);
  const windowEnd = Math.min(totalPages, currentPage + 2);

  for (let page = windowStart; page <= windowEnd; page += 1) {
    pages.push(page);
  }

  return pages;
};

type LoresheetSectionProps = {
  currentPage: number;
  emptyMessage: string;
  items: ILoresheet[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  title: string;
};

function LoresheetSection({ currentPage, emptyMessage, items, setCurrentPage, title }: LoresheetSectionProps) {
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLoresheets = items.slice(startIndex, endIndex);
  const visiblePages = useMemo(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <section className="space-y-4">
      <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-kingthings text-2xl leading-none text-white sm:text-3xl">{title}</p>
        <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
          Total encontrado: <span className="text-white">{items.length}</span>
        </p>
        {items.length > 0 && (
          <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
            Mostrando {startIndex + 1}-{Math.min(endIndex, items.length)}
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedLoresheets.map((item, index) => {
              const cardPreview = getLoresheetPreview(String(item.descriptionPtBr || item.description || ''));

              return (
                <Link
                  href={`/loresheets/${item.id}`}
                  key={`${item.id}-${index}`}
                  className="group relative h-full overflow-hidden border border-zinc-500/30 bg-black p-5 transition-colors hover:border-red-700"
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <Image
                      src={`/loresheets/${item.titlePtBr}.png`}
                      alt=""
                      className="h-full w-full object-cover object-center opacity-10"
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/55 pointer-events-none" />

                  <div className="relative z-10 space-y-3 px-4 py-4 text-left text-white">
                    <div>
                      <div className="mb-4 flex justify-center">
                        <div className="relative h-20 overflow-hidden border border-zinc-500/40 sm:h-52 w-full">
                          <Image
                            src={`/images/loresheets/${item.titlePtBr}.png`}
                            alt={String(item.titlePtBr)}
                            className="h-full w-full object-cover object-top"
                            fill
                            sizes="1000px"
                          />
                        </div>
                      </div>
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
            {emptyMessage}
          </p>
        </div>
      )}
    </section>
  );
}

export default function ListLoresheets({ loresheets }: ListLoresheetsProps) {
  const [officialPage, setOfficialPage] = useState(1);
  const [communityPage, setCommunityPage] = useState(1);

  const officialLoresheets = useMemo(
    () => loresheets.filter((item) => !item.custom),
    [loresheets],
  );

  const communityLoresheets = useMemo(
    () => loresheets.filter((item) => item.custom),
    [loresheets],
  );

  useEffect(() => {
    setOfficialPage(1);
    setCommunityPage(1);
  }, [loresheets]);

  return (
    <div className="space-y-8">
      <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
          Total de Loresheets Encontradas: <span className="text-white">{loresheets.length}</span>
        </p>
      </div>

      <LoresheetSection
        currentPage={officialPage}
        emptyMessage="Nenhuma loresheet oficial encontrada com os filtros atuais."
        items={officialLoresheets}
        setCurrentPage={setOfficialPage}
        title="Loresheets Oficiais"
      />

      <LoresheetSection
        currentPage={communityPage}
        emptyMessage="Nenhuma loresheet da comunidade encontrada com os filtros atuais."
        items={communityLoresheets}
        setCurrentPage={setCommunityPage}
        title="Loresheets criadas por Bruno Cabral"
      />
    </div>
  );
}







