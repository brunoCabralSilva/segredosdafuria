'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { actionType, useSlice } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import listLoresheets from '../../data/loresheets.json';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ILoresheet } from '../../../interface';

export default function Loresheets() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    dispatch(actionType({ show: false, talisman: '', gift: '', ritual: '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-ritual bg-cover bg-top relative text-white">
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
      <Simplify />
      <Nav />
      <section className="mb-2 relative px-2">
        {
          !slice.simplify &&
          <div className="h-40vh relative flex bg-white items-end text-black">
            <Image
              src={ "/images/25.jpg" }
              alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
              className="absolute w-full h-40vh object-cover object-center"
              width={ 1200 }
              height={ 800 }
            />
          </div>
        }
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Loresheets</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            As Loresheets ajudam a vincular os personagens da sua crônica ao amplo Mundo das Trevas, conectando-os a eventos e organizações que afetam o cenário de Lobisomem. Em geral, elas oferecem um benefício ligeiramente mais significativo do que seu nível e custo de Vantagem sugerem, mas geralmente também têm amarras ou riscos adicionais associados.
          </p>
          <p className="pb-2">
            Em geral, os jogadores devem trabalhar com seu Narrador para esclarecer alguns dos detalhes de seus Traços de Loresheet, para que possam ter uma aparência coerente na história. No entanto, alguns Traços de Loresheet provavelmente são melhores mantidos em segredo pelos personagens de outros jogadores...
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
          {
            listLoresheets.map((loresheet: ILoresheet, index: number) => (
              <Link
                href={`/loresheets/${loresheet.title.toLowerCase().replace(/ /g, '-')}`}
                key={ index }
                className={`w-full bg-02 bg-cover h-30vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}
              >
                <Image
                  src={ `/images/loresheets/${loresheet.titlePtBr}.png` }
                  alt=""
                  className="absolute w-full h-full object-cover object-top"
                  width={ 1200 }
                  height={ 800 }
                />
                <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/60'}`} />
                <div className="text-left relative w-full font-bold text-base px-3 p-2">
                  <p>{ loresheet.titlePtBr }</p>
                  <p>({ loresheet.title })</p>
                </div>
              </Link>
            ))
          }
        </div>
      </section>
      <Footer />
    </div>
  );
}