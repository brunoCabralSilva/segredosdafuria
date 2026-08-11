'use client';

import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import jsonTrybes from '../../data/trybes.json';
import jsonAuspices from '../../data/auspices.json';
import jsonGifts from '../../data/gifts.json';
import contexto from '@/context/context';

type FilterGiftsProps = {
  title: string;
  selectedBooks?: string[];
  setSelectedBooks?: Dispatch<SetStateAction<string[]>>;
};

export default function FilterGifts(props: FilterGiftsProps) {
  const [list, setList] = useState<Array<string | number>>([]);
  const { title, selectedBooks = [], setSelectedBooks } = props;
  const {
    globalGifts,
    setGlobalGifts,
    totalRenown,
    setTotalRenown,
    textGift,
    setTextGift,
    listOfGiftsSelected,
    setListOfGiftsSelected,
  } = useContext(contexto);

  useEffect(() => {
    if (title === 'Tribos') setList(jsonTrybes.map((element) => element.namePtBr));
    else if (title === 'Augúrios') setList(jsonAuspices.map((auspice) => auspice.name));
    else if (title === 'Livros') {
      const books = Array.from(
        new Set(
          jsonGifts
            .map((gift) => String(gift.book).trim())
            .filter((book) => book !== '')
        )
      ).sort((a, b) => a.localeCompare(b, 'pt-BR'));
      setList(books);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGift = (gift: string | number) => {
    const findItem = listOfGiftsSelected.find((item: any) => gift === item);
    if (!findItem) setListOfGiftsSelected([...listOfGiftsSelected, gift]);
    else setListOfGiftsSelected(listOfGiftsSelected.filter((item: any) => gift !== item));
  };

  const addBook = (book: string | number) => {
    if (!setSelectedBooks || typeof book !== 'string') return;

    const findItem = selectedBooks.find((item) => item === book);
    if (!findItem) setSelectedBooks([...selectedBooks, book]);
    else setSelectedBooks(selectedBooks.filter((item) => item !== book));
  };

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextGift(sanitizedValue);
  };

  if (title === 'Tribos' || title === 'Augúrios') {
    return (
      <section className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl">
          {`Selecione ${title === 'Tribos' ? 'uma ou mais' : 'um ou mais'} ${title}`}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {list.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`border px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${listOfGiftsSelected.includes(item) ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 bg-black text-white/75 hover:border-red-700 hover:text-red-400'}`}
              onClick={() => addGift(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (title === 'Livros') {
    return (
      <section className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl">
          Selecione um ou mais livros
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {list.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`border px-4 py-2 font-geist-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${selectedBooks.includes(String(item)) ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 bg-black text-white/75 hover:border-red-700 hover:text-red-400'}`}
              onClick={() => addBook(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (title === 'Renome e/ou Dons Nativos') {
    return (
      <section className="border border-zinc-500/30 bg-black/80 p-5 text-white">
        <p className="font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl">
          Selecione Renome e/ou Dons Nativos
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <select
            id="renown"
            value={String(totalRenown)}
            className="border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.12em] text-white outline-none transition-colors"
            onChange={(e) => setTotalRenown(Number(e.target.value))}
          >
            <option value={0}>Sem filtro de Renome</option>
            {Array.from({ length: 9 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Renome Total {index + 1}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`border px-4 py-3 text-left font-geist-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${globalGifts ? 'border-red-700 bg-[#7a0000] text-white' : 'border-zinc-500/30 bg-black text-white/75 hover:border-red-700 hover:text-red-400'}`}
            onClick={() => setGlobalGifts(!globalGifts)}
          >
            {`Clique aqui para ${!globalGifts ? 'incluir' : 'remover'} Dons Nativos na Busca`}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-zinc-500/30 bg-black/80 p-5 text-white">
      <p className="font-kingthings text-2xl uppercase leading-none text-white sm:text-3xl">
        Digite o nome ou um trecho do Dom
      </p>

      <input
        className="mt-5 w-full border border-zinc-500/30 bg-black px-4 py-3 font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-700"
        value={textGift}
        placeholder="Digite aqui"
        onChange={(e) => typeText(e)}
      />
    </section>
  );
}

