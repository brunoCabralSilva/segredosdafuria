'use client'
import { useContext, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import Footer from '@/components/footer';
import listAuspices from '../../data/auspices.json';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';
import Nav from '@/components/nav';

export default function Auspices() {
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);
  useEffect(() => resetPopups(), []);
  return (
    <div className="w-full bg-ritual bg-cover bg-top relative">
      <div className="absolute w-full h-full bg-black/80" />
      <Nav />
      <section className="mb-2 relative px-2">
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Augúrios</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            A lua e sua jornada pelo céu têm uma grande influência sobre os Garou, conferindo a eles o favor de Luna no momento de seu nascimento. De fato, a lua em si é um símbolo do que diferencia os lobisomens do mundo dos lobos e dos humanos, um presságio da parte que desempenham em um mundo conduzido ao Apocalipse.
          </p>
          <p className="pb-2">
          O augúrio de um lobisomem pode ser refletido em sua personalidade e influencia significativamente o papel que desempenham na matilha e na sociedade Garou em geral. Na verdade, nenhum lobisomem, apesar de sua lenda, pode ser todas as coisas para os Garou como um povo. Os augúrios fazem parte da razão pela qual a cultura de matilha existe entre os Garou - cada augúrio fortalece a matilha quando age em conjunto.
          </p>
          <p className="pb-2">
            
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full relative text-white px-4 pb-4 bg-black/90">
          {
            listAuspices.sort((a, b) => {
              const nomeA = a.name.toLowerCase();
              const nomeB = b.name.toLowerCase();
              return nomeA.localeCompare(nomeB);
            }).map((auspice, index) => (
              <Link
                key={ index }
                href={`/auspices/${auspice.name.toLowerCase()}`}
                className="border-white border-2 p-3 flex items-center justify-center flex-col bg-trybes-background bg-center bg-opacity-10 relative cursor-pointer"
              >
                <div className="absolute w-full h-full bg-black/80" />
                <Image
                  src={`/images/auspices/${auspice.name}.png`}
                  alt={`Glifo do Augúrio ${auspice.name}`}
                  className="w-20 relative"
                  width={800}
                  height={400}
                />
                <p className="relative font-bold text-center">
                  { auspice.name }
                </p>
              </Link>
            ))
          }
        </div>
        <button
          type="button"
          className="px-6 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ 'Página Augúrios' } /> 
        }
      </section>
      <Footer />
    </div>
  );
}