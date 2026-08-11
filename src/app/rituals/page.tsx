'use client';

import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import contexto from '@/context/context';
import jsonRituals from '../../data/rituals.json';
import ListRituals from './listRituals';
import Simplify from '@/components/simplify';

const toggleSelection = (currentList: string[], value: string) => {
  if (currentList.includes(value)) return currentList.filter((item) => item !== value);
  return [...currentList, value];
};

const sortRituals = (list: typeof jsonRituals) => (
  [...list].sort((a, b) => String(a.titlePtBr).localeCompare(String(b.titlePtBr), 'pt-BR'))
);

export default function Rituals() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const {
    textRitual,
    setTextRitual,
    setListOfRituais,
    resetPopups,
    simplify,
  } = useContext(contexto);

  const ritualTypes = useMemo(
    () => Array.from(new Set(jsonRituals.map((item) => String(item.type).trim()).filter((item) => item !== '')))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [],
  );

  const ritualBooks = useMemo(
    () => Array.from(new Set(jsonRituals.map((item) => String(item.book).trim()).filter((item) => item !== '')))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [],
  );

  useEffect(() => {
    resetPopups();
    setListOfRituais(sortRituals(jsonRituals));
    setTextRitual('');
    setSelectedTypes([]);
    setSelectedBooks([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextRitual(sanitizedValue);
  };

  const returnFilterPhrase = () => {
    const data = [...selectedTypes, ...selectedBooks];

    if (textRitual.trim() !== '') {
      data.push(`Rituais contendo o trecho "${textRitual}"`);
    }

    return data.join(', ');
  };

  const search = () => {
    const filteredItems = sortRituals(jsonRituals).filter((item) => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(String(item.type));
      const matchesBook = selectedBooks.length === 0 || selectedBooks.includes(String(item.book));
      const matchesText = textRitual.trim() === ''
        || String(item.title).toLowerCase().includes(textRitual.toLowerCase())
        || String(item.titlePtBr).toLowerCase().includes(textRitual.toLowerCase());

      return matchesType && matchesBook && matchesText;
    });

    setListOfRituais(filteredItems);
    setTextRitual('');
    setSelectedTypes([]);
    setSelectedBooks([]);
  };

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
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Rituais</h1>
                  <hr className="mt-5" />

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    <p>
                      Os Garou, impulsionados por sua Fúria, enfrentam tensões devido à sua natureza orgulhosa e agressiva, bem como à busca incessante por Renome. Os Ritos desempenham um papel fundamental na coesão da sociedade Garou, ritualizando todos os aspectos da vida social, desde formalidades como a concessão do título de Garou aos Parentes até práticas para repreender outros, tudo dentro dos limites dos Ritos. Alguns Ritos têm efeitos além do aspecto mental e sua importância na cultura Garou é indiscutível. Além disso, os Ritos permitem que matilhas e seitas desenvolvam suas próprias interpretações únicas, demonstrando a diversidade e flexibilidade dessas práticas na cultura Garou.
                    </p>
                  </div>

                  <div className="mt-8 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Sistema</h2>
                    <hr className="mt-4 border-white/10" />

                    <div className="mt-5 space-y-4 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <p>
                        Para realizar um Rito, um Garou precisa conhecê-lo, geralmente aprendendo com um Garou mais experiente. Se vários Garou que conhecem o Rito participarem, um atua como mestre do Rito, sendo automaticamente designado se apenas um Garou o realizar. O mestre do Rito cria um conjunto de dados com atributos específicos e faz um teste com dificuldade definida.
                      </p>
                      <p>
                        Os dados de Fúria são incluídos, e falhas brutais são possíveis, com efeitos especiais em alguns Ritos. Outros Garou podem participar, adicionando dados se conhecerem o Rito. A realização de um Rito leva uma cena, podendo variar em duração. Se falhar, o mestre do Rito não pode liderar o mesmo antes do próximo dia.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Resumo dos Ritos</h2>
                    <hr className="mt-4 border-white/10" />

                    <ul className="mt-5 list-disc space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>Um Rito deve ser liderado por um mestre do Rito, que deve conhecer o Rito.</li>
                      <li>Cada participante, incluindo o mestre do Rito, deve ter pelo menos um ponto de Fúria.</li>
                      <li>Os atributos do conjunto de dados são mencionados no Rito e são os do mestre do Rito.</li>
                      <li>Cada outro participante contribui com um dado de Fúria.</li>
                      <li>Cada outro participante que conhece o Rito também contribui com um dado regular.</li>
                    </ul>
                  </div>

                  <div className="mt-4 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Como utilizar o filtro de busca</h2>
                    <hr className="mt-4 border-white/10" />

                    <ol className="mt-5 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>Não selecionar nenhum filtro retornará uma lista com todos os rituais existentes.</li>
                      <li>Selecionar um ou mais tipos retornará qualquer ritual que pertença a pelo menos um dos tipos escolhidos.</li>
                      <li>Selecionar um ou mais livros restringirá o resultado aos rituais publicados nesses livros.</li>
                      <li>O campo de texto procura trechos do nome do ritual em português ou em inglês, aplicando os demais filtros antes dessa busca.</li>
                      <li>Ao selecionar algum filtro, ele aparecerá dentro do bloco de busca até a pesquisa ser executada.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Selecione um ou mais tipos</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ritualTypes.map((ritualType) => {
                      const isActive = selectedTypes.includes(ritualType);

                      return (
                        <button
                          key={ritualType}
                          type="button"
                          onClick={() => setSelectedTypes((currentList) => toggleSelection(currentList, ritualType))}
                          className={`border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${isActive ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                        >
                          {ritualType}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Selecione um ou mais livros</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ritualBooks.map((ritualBook) => {
                      const isActive = selectedBooks.includes(ritualBook);

                      return (
                        <button
                          key={ritualBook}
                          type="button"
                          onClick={() => setSelectedBooks((currentList) => toggleSelection(currentList, ritualBook))}
                          className={`border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${isActive ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                        >
                          {ritualBook}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Digite o nome ou um trecho do nome do ritual</p>
                  <input
                    className="mt-4 w-full border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-700"
                    value={textRitual}
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
                    Buscar Rituais
                  </button>

                  {returnFilterPhrase() !== '' && (
                    <p className="mt-4 font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
                      Filtros atuais: {returnFilterPhrase()}
                    </p>
                  )}
                </div>

                <ListRituals />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

