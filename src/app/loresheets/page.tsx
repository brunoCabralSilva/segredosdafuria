'use client';

import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import contexto from '@/context/context';
import listLoresheets from '../../data/loresheets.json';
import ListLoresheets from './listLoresheets';
import Simplify from '@/components/simplify';
import { ILoresheet } from '../../interface';

const toggleSelection = (currentList: string[], value: string) => {
  if (currentList.includes(value)) return currentList.filter((item) => item !== value);
  return [...currentList, value];
};

const sortLoresheets = (list: ILoresheet[]) => (
  [...list].sort((a, b) => Number(a.id) - Number(b.id))
);

export default function Loresheets() {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [textLoresheet, setTextLoresheet] = useState('');
  const [filteredLoresheets, setFilteredLoresheets] = useState<ILoresheet[]>([]);
  const { resetPopups, simplify } = useContext(contexto);

  const loresheetBooks = useMemo(
    () => Array.from(new Set(listLoresheets.map((item) => String(item.book).trim()).filter((item) => item !== '')))
      .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [],
  );

  useEffect(() => {
    resetPopups();
    setFilteredLoresheets(sortLoresheets(listLoresheets as ILoresheet[]));
    setTextLoresheet('');
    setSelectedBooks([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextLoresheet(sanitizedValue);
  };

  const returnFilterPhrase = () => {
    const data = [...selectedBooks];

    if (textLoresheet.trim() !== '') {
      data.push(`Loresheets contendo o trecho "${textLoresheet}"`);
    }

    return data.join(', ');
  };

  const search = () => {
    const filteredItems = sortLoresheets(listLoresheets as ILoresheet[]).filter((item) => {
      const matchesBook = selectedBooks.length === 0 || selectedBooks.includes(String(item.book));
      const matchesText = textLoresheet.trim() === ''
        || String(item.title).toLowerCase().includes(textLoresheet.toLowerCase())
        || String(item.titlePtBr).toLowerCase().includes(textLoresheet.toLowerCase());

      return matchesBook && matchesText;
    });

    setFilteredLoresheets(filteredItems);
    setTextLoresheet('');
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
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Loresheets</h1>
                  <hr className="mt-5" />

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    <p>
                      As Loresheets representam ligações com diversos acontecimentos ou facções específicas que são importantes para a sociedade Garou. Para ter esta Vantagem, você precisará adquirir uma Característica específica de uma Loresheet e integrar a narrativa correspondente ao histórico e às relações do seu personagem. Pode ser que algumas Loresheets tenham pré-requisitos específicos, como tribo, augúrio ou coisas assim.
                    </p>
                    <p>
                      Cada nível de uma dada Loresheet é independente dos demais e deve ser comprado à parte. Ele não contém automaticamente os níveis mais baixos da sua Loresheet.
                    </p>
                    <p>
                      Um personagem não pode ter Características de mais de uma Loresheet. Naturalmente, o Narrador pode ficar à vontade para revogar essa regra ou, dependendo da crônica, proibir que os personagens tenham certas Loresheets.
                    </p>
                  </div>

                  <div className="mt-8 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Como utilizar o filtro de busca</h2>
                    <hr className="mt-4 border-white/10" />

                    <ol className="mt-5 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>Não selecionar nenhum filtro retornará uma lista com todas as loresheets existentes.</li>
                      <li>Selecionar um ou mais livros restringirá o resultado às loresheets publicadas nessas fontes.</li>
                      <li>O campo de texto procura trechos do nome da loresheet em português ou em inglês, aplicando os demais filtros antes dessa busca.</li>
                      <li>Ao selecionar algum filtro, ele aparecerá dentro do bloco de busca até a pesquisa ser executada.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Selecione um ou mais livros</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {loresheetBooks.map((loresheetBook) => {
                      const isActive = selectedBooks.includes(loresheetBook);

                      return (
                        <button
                          key={loresheetBook}
                          type="button"
                          onClick={() => setSelectedBooks((currentList) => toggleSelection(currentList, loresheetBook))}
                          className={`border px-4 py-2 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${isActive ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 text-white hover:border-red-700 hover:text-red-400'}`}
                        >
                          {loresheetBook}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <p className="font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white/72">Digite o nome ou um trecho do nome da loresheet</p>
                  <input
                    className="mt-4 w-full border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-700"
                    value={textLoresheet}
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
                    Buscar Loresheets
                  </button>

                  {returnFilterPhrase() !== '' && (
                    <p className="mt-4 font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
                      Filtros atuais: {returnFilterPhrase()}
                    </p>
                  )}
                </div>

                <ListLoresheets loresheets={filteredLoresheets} />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}



