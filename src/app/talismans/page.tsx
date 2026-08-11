'use client';

import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import contexto from '@/context/context';
import jsonTalismans from '../../data/talismans.json';
import ListTalismans from './listTalismans';
import Simplify from '@/components/simplify';

const toggleSelection = (currentList: string[], value: string) => {
  if (currentList.includes(value)) return currentList.filter((item) => item !== value);
  return [...currentList, value];
};

const sortTalismans = (list: typeof jsonTalismans) => (
  [...list].sort((a, b) => String(a.titlePtBr).localeCompare(String(b.titlePtBr), 'pt-BR'))
);

export default function Talismans() {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const {
    textTalisman,
    setTextTalisman,
    resetPopups,
    setListOfTalismans,
    simplify,
  } = useContext(contexto);

  const talismanBooks = useMemo(
    () => Array.from(new Set(jsonTalismans.map((item) => String(item.book).trim()).filter((item) => item !== '')))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [],
  );

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextTalisman(sanitizedValue);
  };

  useEffect(() => {
    resetPopups();
    setListOfTalismans(sortTalismans(jsonTalismans));
    setTextTalisman('');
    setSelectedBooks([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnFilterPhrase = () => {
    const data = [...selectedBooks];

    if (textTalisman.trim() !== '') {
      data.push(`Talismãs contendo o trecho "${textTalisman}"`);
    }

    return data.join(', ');
  };

  const search = () => {
    const filteredItems = sortTalismans(jsonTalismans).filter((item) => {
      const matchesBook = selectedBooks.length === 0 || selectedBooks.includes(String(item.book));
      const matchesText = textTalisman.trim() === ''
        || String(item.title).toLowerCase().includes(textTalisman.toLowerCase())
        || String(item.titlePtBr).toLowerCase().includes(textTalisman.toLowerCase());

      return matchesBook && matchesText;
    });

    setListOfTalismans(filteredItems);
    setTextTalisman('');
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
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Talismãs</h1>
                  <hr className="mt-5" />

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    <p>
                      Alguns Garou possuem um talismã: um objeto especial, frequentemente habitado por um espírito, embora nem sempre. Um talismã Garou tem sua própria função única, muitas vezes relacionada à perspectiva animista dos lobisomens. Os talismãs podem ser armas, ferramentas ou objetos que ajudam o lobisomem a se concentrar; eles podem ter propósitos espirituais ou físicos. Seja qual for o caso, são objetos especiais capazes de realizar alguma função sobrenatural ou auxiliar em uma função mundana com poder espiritual. Garou pertencentes a culturas específicas com tradições mágicas ou ocultas muitas vezes têm seus próprios nomes para talismãs.
                    </p>
                    <p>
                      Se os jogadores escolheram o Antecedente Talismã, as descrições a seguir também incluem quanto poderia custar um desses itens durante a criação de personagens. Os Contadores de Histórias são incentivados a criar os seus próprios, e os jogadores a sugerirem, para melhor demonstrar os valores da sociedade Garou em suas crônicas específicas. A maioria dos talismãs tem versões de uso único, conhecidas como talens. Um talen apanhador de espíritos se desfaz após o uso único, incapaz de capturar outro espírito, enquanto um talen klaive se estilhaça após um ataque bem-sucedido, causando seu dano e quebrando na ferida como uma garra esfacelada. Se escolhido como um Antecedente, presume-se que o personagem tenha uma maneira de adquirir os talens, e o personagem recebe um novo no início de uma história se o anterior tiver sido usado.
                    </p>
                  </div>

                  <div className="mt-8 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Como utilizar o filtro de busca</h2>
                    <hr className="mt-4 border-white/10" />

                    <ol className="mt-5 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>Não selecionar nenhum filtro retornará uma lista com todos os talismãs existentes.</li>
                      <li>Selecionar um ou mais livros restringirá o resultado aos talismãs publicados nesses livros.</li>
                      <li>O campo de texto procura trechos do nome do talismã em português ou em inglês, aplicando os demais filtros antes dessa busca.</li>
                      <li>Ao selecionar algum filtro, ele aparecerá dentro do bloco de busca até a pesquisa ser executada.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Selecione um ou mais livros</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {talismanBooks.map((talismanBook) => {
                      const isActive = selectedBooks.includes(talismanBook);

                      return (
                        <button
                          key={talismanBook}
                          type="button"
                          onClick={() => setSelectedBooks((currentList) => toggleSelection(currentList, talismanBook))}
                          className={`border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${isActive ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                        >
                          {talismanBook}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Digite o nome ou um trecho do nome do talismã</p>
                  <input
                    className="mt-4 w-full border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-700"
                    value={textTalisman}
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
                    Buscar Talismãs
                  </button>

                  {returnFilterPhrase() !== '' && (
                    <p className="mt-4 font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
                      Filtros atuais: {returnFilterPhrase()}
                    </p>
                  )}
                </div>

                <ListTalismans />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
