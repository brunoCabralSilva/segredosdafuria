'use client';
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import Nav from '@/components/nav';
import Footer from "@/components/footer";
import listTrybes from '../../../data/trybes.json';
import { IArchetypes, ITrybe } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from '@/context/context';

export default function Trybe({ params } : { params: { trybe: String } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataTrybe, setDataTrybe] = useState<ITrybe>();
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto)

  useEffect(() => {
    resetPopups();
    const findTrybe: ITrybe | undefined = listTrybes
      .find((trb: ITrybe) => params.trybe
      .replace(/-/g, ' ') === trb.nameEn
    );
    setDataTrybe(findTrybe);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function firstLetter(frase: String) {
    const palavras = frase.split(' ');
  
    const FirstUperCase = palavras.map((palavra) => {
      if (palavra.length > 0) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      } else {
        return palavra;
      }
    });
    const phrase = FirstUperCase.join(' ');
    return phrase;
  };

  if (dataTrybe) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="mb-2 relative px-2">
          <div className="py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
            <div className="flex items-center justify-center w-full relative h-full">
              <div className="absolute h-full w-full sm:w-5/12 flex items-center justify-center">
                { isLoading && <span className="loader z-50" /> }
              </div>
              <Image
                src={`/images/trybes/${dataTrybe.namePtBr} - representation.png`}
                alt={`Representação dos ${dataTrybe.namePtBr}`}
                className="w-full mobile:w-8/12 sm:w-5/12 relative px-6"
                width={800}
                height={400}
                onLoad={() => setIsLoading(false)}
              />
            </div>
            <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base">
              <h2 className=" font-bold text-xl sm:text-2xl w-full text-center">
                <span>
                  {`${dataTrybe.namePtBr} (${firstLetter(dataTrybe.nameEn)})`}
                </span>
              </h2>
              <div className="flex items-center justify-center w-full text-sm">
                <p className="mt-1 sm:mt-3 mb-10 text-center sm:w-1/2">
                  &quot;{ dataTrybe.phrase }&quot;
                </p>
              </div>
              {
                dataTrybe.description.map((paragraph: String, index: number) => (
                  <p key={ index }>
                    { paragraph }
                  </p>
                ))
              }
              <div className="flex items-center justify-center w-full">
                <Image
                  src={`/images/trybes/${dataTrybe.namePtBr}.png`}
                  alt={`Glifo dos ${dataTrybe.namePtBr}`}
                  className="w-20 sm:w-38 my-2"
                  width={800}
                  height={400}
                />
              </div>
              <h2 className="text-center sm:text-left w-full text-xl">
                Quem são
              </h2>
              <hr className="w-10/12 my-2" />
              {
                dataTrybe.whoAre.map((paragraph: String, index: number) => (
                  <p key={ index }>
                    { paragraph }
                  </p>
                ))
              }
              
              <h2 className="text-center sm:text-left w-full pt-8 text-xl">
                Patrono Espiritual
              </h2>
              <hr className="w-10/12 my-2" />
              <p>{dataTrybe.patron}</p>
              
              <div>
                <span className="underline">Favor</span>
                <span className="px-1">-</span>
                <span>{dataTrybe.favor}</span>
              </div>
              <div>
                <span className="underline">Proibição</span>
                <span className="px-1">-</span>
                <span>{dataTrybe.ban}</span>
              </div>
              
              <h2 className="text-center sm:text-left w-full pt-8 text-xl">
                Arquétipos
              </h2>
              <hr className="w-10/12 mt-2 mb-5" />
              <div>
                {
                  dataTrybe.archetypes.map((archetype: IArchetypes, index: number) => (
                    <div key={ index }>
                      <h2 className="underline">{ archetype.title } </h2>
                      <p className="pb-5">{ archetype.description }</p>
                    </div>
                  ))
                }
              </div>
          </div>
        </div>
        <button
          type="button"
          className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ dataTrybe.nameEn } /> 
        }
        </section>
        <Footer />
      </div>
    );
  } return (
    <div className="w-full bg-ritual bg-cover bg-top relative h-screen">
      <div className="absolute w-full h-full bg-black/80" />
      <Nav />
      <span className="loader z-50" />
    </div>
  );
}