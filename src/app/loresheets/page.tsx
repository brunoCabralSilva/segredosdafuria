'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import listLoresheets from '../../data/loresheets.json';
import { useContext, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ILoresheet } from '../../interface';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';

export default function Loresheets() {
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);
  useEffect(() => resetPopups(), []);
  return (
    <div className="w-full bg-ritual bg-cover bg-top relative text-white">
      <div className="absolute w-full h-fullbg-black/80" />
      <Nav />
      <section className="mb-2 relative px-2">
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
        <div  className="bg-black/90 pb-6 px-5">
          <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
            {
              listLoresheets
                .filter((loresheet: ILoresheet) => !loresheet.custom)
                .map((loresheet: ILoresheet, index: number) => (
                <Link
                  href={`/loresheets/${loresheet.id}`}
                  key={ index }
                  className="w-full p-2 rounded bg-black text-white flex relative cursor-pointer items-center border border-white/20"
                >
                  <Image
                    src={ `/images/loresheets/${loresheet.titlePtBr}.png` }
                    alt=""
                    className="w-20 h-20 object-cover object-top rounded-full"
                    width={ 1200 }
                    height={ 800 }
                  />
                  <div className="text-left relative w-full text-base px-3 p-2">
                    <p className="font-bold">{ loresheet.titlePtBr }</p>
                    <p>({ loresheet.title })</p>
                  </div>
                </Link>
              ))
            }
          </div>
          <div className="py-5 text-center sm:text-left">Loresheets não oficiais (Criadas pela comunidade)</div>
          <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
            {
              listLoresheets
                .filter((loresheet: ILoresheet) => loresheet.custom)
                .map((loresheet: ILoresheet, index: number) => (
                <Link
                  href={`/loresheets/${loresheet.id}`}
                  key={ index }
                  className="w-full p-2 rounded bg-black text-white flex relative cursor-pointer items-center border border-white/20"
                >
                  <Image
                    src={ `/images/loresheets/${loresheet.titlePtBr}.png` }
                    alt=""
                    className="w-20 h-20 object-cover object-top rounded-full"
                    width={ 1200 }
                    height={ 800 }
                  />
                  <div className="text-left relative w-full text-base px-3 p-2">
                    <p className="font-bold">{ loresheet.titlePtBr }</p>
                    <p>({ loresheet.title })</p>
                  </div>
                </Link>
              ))
            }
          </div>
          <button
            type="button"
            className="w-full text-center pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
            onClick={() => setShowFeedback(true) }
          >
            Enviar Feedback
          </button>
        </div>
        {
          showFeedback && <Feedback title={ 'Página "Loresheets"' } /> 
        }
      </section>
      <Footer />
    </div>
  );
}