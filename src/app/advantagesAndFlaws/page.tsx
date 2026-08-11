'use client';

import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import contexto from '@/context/context';
import jsonAdvantagesAndFlaws from '../../data/advantagesAndFlaws.json';
import { IAdOrFlaws } from '@/interface';
import Simplify from '@/components/simplify';

const ITEMS_PER_PAGE = 9;

const toggleSelection = (currentList: string[], value: string) => {
  if (currentList.includes(value)) return currentList.filter((item) => item !== value);
  return [...currentList, value];
};


const sortAdvantagesAndFlaws = (list: IAdOrFlaws[]) => (
  [...list].sort((a, b) => String(a.name).localeCompare(String(b.name), 'pt-BR'))
);

const getRelatedBooks = (item: IAdOrFlaws) => {
  const books = [
    ...(item.advantages || []).map((advantage) => String(advantage.font).trim()),
    ...(item.flaws || []).map((flaw) => String(flaw.font).trim()),
  ].filter((book) => book !== '');

  return Array.from(new Set(books)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
};

const getPreview = (text: string, totalLength = 220) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength).trimEnd()}...`;
};

export default function AdvantagesAndFlaws() {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [textAdvantageOrFlaw, setTextAdvantageOrFlaw] = useState('');
  const [results, setResults] = useState<IAdOrFlaws[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { resetPopups, simplify } = useContext(contexto);


  const itemBooks = useMemo(() => {
    const books = jsonAdvantagesAndFlaws.flatMap((item) => getRelatedBooks(item as IAdOrFlaws));
    return Array.from(new Set(books)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, []);

  useEffect(() => {
    resetPopups();
    setResults(sortAdvantagesAndFlaws(jsonAdvantagesAndFlaws as IAdOrFlaws[]));
    setTextAdvantageOrFlaw('');
    setSelectedBooks([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextAdvantageOrFlaw(sanitizedValue);
  };

  const returnFilterPhrase = () => {
    const data = [...selectedBooks];

    if (textAdvantageOrFlaw.trim() !== '') {
      data.push(`Vantagens e defeitos contendo o trecho "${textAdvantageOrFlaw}"`);
    }

    return data.join(', ');
  };

  const search = () => {
    const filteredItems = sortAdvantagesAndFlaws(jsonAdvantagesAndFlaws as IAdOrFlaws[]).filter((item) => {
      const relatedBooks = getRelatedBooks(item);
      const relatedTexts = [
        String(item.name),
        String(item.description),
        ...(item.advantages || []).flatMap((advantage) => [String(advantage.title), String(advantage.description)]),
        ...(item.flaws || []).flatMap((flaw) => [String(flaw.title), String(flaw.description)]),
      ].join(' ').toLowerCase();

      const matchesBook = selectedBooks.length === 0 || selectedBooks.some((book) => relatedBooks.includes(book));
      const matchesText = textAdvantageOrFlaw.trim() === '' || relatedTexts.includes(textAdvantageOrFlaw.toLowerCase());

      return matchesBook && matchesText;
    });

    setResults(filteredItems);
    setTextAdvantageOrFlaw('');
    setSelectedBooks([]);
  };

  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

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
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="h-full w-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />
        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="relative overflow-hidden text-white">
            <div className="relative px-5 pb-8 sm:px-8">
              <div className="grid gap-8">
                <div>
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Vantagens e Defeitos</h1>
                  <hr className="mt-5" />

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    <p>
                      Além dos Atríbutos exclusivos e das Habilidades diferenciadas, os personagens garous, recém-criados têm várias Vantagens, seja uma facilidade com idiomas ou uma tropa de arruaceiros armados com tacos de beisebol sempre à disposição. Como tudo o mais, medimos as Vantagens com pontos, geralmente variando de um a cinco. Não há penalidade por se ter zero ponto em uma Vantagem - esse é o padrão. Poucas rolagens envolvem Vantagens, se bem que o Narrador poderia pedir Inteligência + Linguística para decifrar os diários de couro esfarrapados de um ancião garou já falecido, ou Subterfúgio + Contatos para plantar um boato a respeito daquela maldita Presa de Prata na zona do baixo meretrício.
                    </p>
                    <p>
                      As Vantagens são divididas em Qualidades e Antecedentes. O outro lado das Vantagens, os Defeitos causam problemas contínuos aos personagens. Observe que o Narrador pode proibir ou limitar as Vantagens que entram em conflito com o cenário da crônica.
                    </p>
                  </div>

                  <div className="mt-8 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Como utilizar o filtro de busca</h2>
                    <hr className="mt-4 border-white/10" />

                    <ol className="mt-5 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>Não selecionar nenhum filtro retornará uma lista com todas as vantagens e defeitos existentes.</li>

                      <li>Selecionar um ou mais livros restringirá o resultado aos itens que possuem opções publicadas nessas fontes.</li>
                      <li>O campo de texto procura trechos do nome, da descrição e também dos títulos internos de vantagens e defeitos.</li>
                      <li>Ao selecionar algum filtro, ele aparecerá dentro do bloco de busca até a pesquisa ser executada.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Selecione um ou mais livros</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {itemBooks.map((itemBook) => {
                      const isActive = selectedBooks.includes(itemBook);

                      return (
                        <button
                          key={itemBook}
                          type="button"
                          onClick={() => setSelectedBooks((currentList) => toggleSelection(currentList, itemBook))}
                          className={`border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${isActive ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                        >
                          {itemBook}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Digite o nome ou um trecho relacionado à vantagem ou defeito</p>
                  <input
                    className="mt-4 w-full border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-700"
                    value={textAdvantageOrFlaw}
                    placeholder="Digite aqui"
                    onChange={typeText}
                  />
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <button
                    type="button"
                    onClick={search}
                    className="inline-flex border border-red-700 bg-[#7a0000] px-5 py-3 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
                  >
                    Buscar Vantagens e Defeitos
                  </button>

                  {returnFilterPhrase() !== '' && (
                    <p className="mt-4 font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
                      Filtros atuais: {returnFilterPhrase()}
                    </p>
                  )}
                </div>

                <section className="space-y-4">
                  <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                    <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">
                      Total de Vantagens e Defeitos Encontrados: <span className="text-white">{results.length}</span>
                    </p>
                    {results.length > 0 && (
                      <p className="mt-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, results.length)}
                      </p>
                    )}
                  </div>

                  {results.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {paginatedResults.map((item) => {
                          const relatedBooks = getRelatedBooks(item);
                          const preview = getPreview(String(item.description || ''));
                          const advantagesCount = item.advantages?.length || 0;
                          const flawsCount = item.flaws?.length || 0;

                          return (
                            <Link
                              href={`/advantagesAndFlaws/${item.id}`}
                              key={`${item.id}-${item.name}`}
                              className="group relative h-full overflow-hidden border border-zinc-500/30 bg-black p-5 transition-colors hover:border-red-700"
                            >
                              <div className="relative z-10 space-y-3 px-4 py-4 text-left text-white">
                                <div>
                                  <p className="font-geist-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                    {item.type}
                                  </p>
                                  <p className="mt-2 font-kingthings text-xl leading-none text-white transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] group-hover:text-red-500 sm:text-2xl">
                                    {item.name}
                                  </p>
                                </div>

                                <div className="space-y-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                  <p className="font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                                    {advantagesCount} vantagens • {flawsCount} defeitos
                                  </p>
                                  <p className="line-clamp-4 font-geist-mono text-[11px] leading-6 text-white/75 text-justify">
                                    {preview}
                                  </p>
                                  {relatedBooks.length > 0 && (
                                    <p className="border-t border-white/10 pt-3 font-geist-mono text-[10px] uppercase leading-5 text-white/60">
                                      Fontes: <span className="normal-case text-white/85">{relatedBooks.join(' • ')}</span>
                                    </p>
                                  )}
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
                        Nenhuma vantagem ou defeito encontrado com os filtros atuais.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}



