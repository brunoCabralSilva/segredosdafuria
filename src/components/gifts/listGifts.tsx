'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { capitalizeFirstLetter } from '@/firebase/utilities';
import contexto from '@/context/context';
import { IGift, ITypeGift } from '../../interface';

const ITEMS_PER_PAGE = 9;

const getGiftPreview = (text: string, totalLength = 140) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength).trimEnd()}...`;
};

export default function ListGifts() {
  const { listOfGift } = useContext(contexto);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [listOfGift]);

  const totalPages = Math.max(1, Math.ceil(listOfGift.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedGifts = listOfGift.slice(startIndex, endIndex);

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
          Total de Dons Encontrados: <span className="text-white">{listOfGift.length}</span>
        </p>
        {listOfGift.length > 0 && (
          <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
            Mostrando {startIndex + 1}-{Math.min(endIndex, listOfGift.length)}
          </p>
        )}
      </div>

      {listOfGift.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedGifts.map((item: IGift, index: number) => {
              const cardPreview = getGiftPreview(String(item.descriptionPtBr || item.description || ''));

              return (
                <Link
                  href={`/gifts/${item.id}`}
                  key={`${item.id}-${index}`}
                  className="group relative h-full overflow-hidden border border-zinc-500/30 bg-black p-5 transition-colors hover:border-red-700"
                >
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 pointer-events-none opacity-10">
                    {item.belonging.slice(0, 2).map((giftType: ITypeGift, backgroundIndex: number) => (
                      <div
                        key={`${item.id}-background-${backgroundIndex}`}
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

                  <div className="relative z-10 space-y-3 px-4 py-4 text-left text-white">
                    <div>
                      <p className="font-kingthings text-xl leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] group-hover:text-red-500 sm:text-2xl">
                        {item.giftPtBr}
                      </p>
                      <p className="mt-2 font-geist-mono text-[10px] uppercase leading-5 text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {item.gift}
                      </p>
                    </div>

                    <div className="space-y-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      <p className="line-clamp-4 font-geist-mono text-[11px] leading-6 text-white/75 text-justify">
                        {cardPreview}
                      </p>
                      <p className="border-t border-white/10 pt-3 font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Pertence a:{' '}
                        <span className="text-white/85">
                          {item.belonging.map((giftType: ITypeGift, giftIndex: number) => (
                            <span key={`${item.id}-belonging-${giftIndex}`}>
                              {capitalizeFirstLetter(giftType.type)} ({giftType.totalRenown})
                              {giftIndex === item.belonging.length - 1 ? '' : ', '}
                            </span>
                          ))}
                        </span>
                      </p>
                      <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Custo: <span className="normal-case text-white/85">{item.cost || 'Não informado'}</span>
                      </p>
                      <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                        Renome: <span className="normal-case text-white/85">{item.renown}</span>
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
            Nenhum dom encontrado com os filtros atuais.
          </p>
        </div>
      )}
    </section>
  );
}

