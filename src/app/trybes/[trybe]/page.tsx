'use client';
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import Nav from '@/components/nav';
import Footer from "@/components/footer";
import listTrybes from '../../../data/trybes.json';
import { IArchetypes, ITrybe } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from '@/context/context';
import { useParams } from 'next/navigation';

export default function Trybe() {
  const params = useParams();
  const trybe = params?.trybe as string;
  const [isLoading, setIsLoading] = useState(true);
  const [dataTrybe, setDataTrybe] = useState<ITrybe>();
  const [alternative, setAlternative] = useState<boolean>(true);
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findTrybe: ITrybe | undefined = listTrybes
      .find((trb: ITrybe) => trybe
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
      <div className="w-full bg-ritual bg-cover bg-top relative flex flex-col items-center">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="block-item mb-2 relative px-2 py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
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
          { !alternative
            ? <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base w-full mb-10">
              <h2 className="font-bold text-xl sm:text-2xl w-full text-center">
                <span>
                  {`${dataTrybe.namePtBr} (${firstLetter(dataTrybe.nameEn)})`}
                </span>
              </h2>
              <div className="flex items-center justify-center w-full text-sm">
                <p className="mt-1 sm:mt-3 mb-10 text-center sm:w-1/2">
                  &quot;{ dataTrybe.phrase }&quot;
                </p>
              </div>
              <div>
                <span>
                  {
                    !alternative
                    ? 'O texto abaixo está no livro "Lobisomem: O Apocalipse 5th". Clique'
                    : 'O Texto abaixo é a nossa visão aprofundada sobre a tribo, criado por Bruno Gabryell e Davi Nóbrega e revisado por Viviane Silva, Maycon Serra e Gustavo Curi. Clique'
                  }
                </span>
                <span
                  onClick={ () => setAlternative(!alternative) }
                  className="px-1 underline font-bold hover:text-red-500 cursor-pointer">
                  aqui
                </span>
                <span>
                  {
                    alternative
                    ? 'para ver o texto oficial que está no livro "Lobisomem: O Apocalipse 5th"'
                    : 'para conhecer nossa visão aprofundada sobre a tribo. O texto foi criado por Bruno Gabryell e Davi Nóbrega e revisado por Viviane Silva, Maycon Serra e Gustavo Curi.'
                  }
                </span>
              </div>
              <div className="mt-5 w-full">
                <div className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Definição
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.description.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">
                        { paragraph }
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="mt-5">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Quem são os { dataTrybe.namePtBr }?
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.whoAre.map((paragraph: String, index: number) => (
                      <p className="pt-3" key={ index }>
                        { paragraph }
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="mt-3">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  <span>Espírito Padroeiro</span>
                </div>
                <div className="text-justify w-full p-2">
                  { dataTrybe.patron }
                  <div className="pt-3">
                    <span className="underline">Favor</span>
                    <span className="px-1">-</span>
                    <span>{dataTrybe.favor}</span>
                  </div>
                  <div className="pt-3">
                    <span className="underline">Interdição</span>
                    <span className="px-1">-</span>
                    <span>{dataTrybe.ban}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  <span>Arquétipos de { dataTrybe.namePtBr }</span>
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.archetypes.map((archetype: IArchetypes, index: number) => (
                      <div key={ index } className="w-full">
                        <h2 className="underline">{ archetype.title } </h2>
                        <p className="pb-5">{ archetype.description }</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            : <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base w-full mb-10">
              <h2 className="font-bold text-xl sm:text-2xl w-full text-center">
                <span>
                  {`${dataTrybe.namePtBr} - ${dataTrybe.alternativeTitle}`}
                </span>
              </h2>
              <div className="flex flex-col items-center justify-center w-full text-sm">
                {
                  dataTrybe.alternativePhrases.map((phrase: string, index: number) => 
                  <p className="mt-1 sm:mt-2 text-center sm:w-1/2">
                    &quot;{ phrase }&quot;
                  </p>
                  )
                }
              </div>
              <div className="mt-10">
                <span>
                  {
                    !alternative
                    ? 'O texto abaixo está no livro "Lobisomem: O Apocalipse 5th". Clique'
                    : 'O Texto abaixo é a nossa visão aprofundada sobre a tribo, criado por Bruno Gabryell e Davi Nóbrega e revisado por Viviane Silva, Maycon Serra e Gustavo Curi. Clique'
                  }
                </span>
                <span
                  onClick={ () => setAlternative(!alternative) }
                  className="px-1 underline font-bold hover:text-red-500 cursor-pointer">
                  aqui
                </span>
                <span>
                  {
                    alternative
                    ? 'para ver o texto oficial que está no livro "Lobisomem: O Apocalipse 5th"'
                    : 'para conhecer nossa visão aprofundada sobre a tribo. O texto foi criado por Bruno Gabryell e Davi Nóbrega e revisado por Viviane Silva, Maycon Serra e Gustavo Curi.'
                  }
                </span>
              </div>
              <div className="mt-5 w-full">
                <div className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Definição
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.alternativeDescription.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">
                        { paragraph }
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="mt-5">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Ideologia
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.alternativeIdeology.map((paragraph: String, index: number) => (
                      <p className="pt-3" key={ index }>
                        { paragraph }
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="mt-5">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Costumes
                </div>
                <div className="text-justify w-full p-2">
                  {
                    dataTrybe.alternativeCustoms.map((paragraph: String, index: number) => (
                      <p className="pt-3" key={ index }>
                        { paragraph }
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="mt-5">
                <div
                  className="text-justify w-full text-xl border border-white p-2 flex justify-between items-center cursor-pointer"
                >
                  Augúrios
                </div>
                <div className="text-justify w-full p-2">
                  <h2 className="py-3 text-lg font-bold">Ragabash</h2>
                  <hr />
                  {
                    dataTrybe.alternativeAuspices.ragabash.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">{ paragraph }</p>
                    ))
                  }
                  <h2 className="py-3 text-lg font-bold">Theurge</h2>
                  <hr />
                  {
                    dataTrybe.alternativeAuspices.theurge.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">{ paragraph }</p>
                    ))
                  }
                  <h2 className="py-3 text-lg font-bold">Philodox</h2>
                  <hr />
                  {
                    dataTrybe.alternativeAuspices.phillodox.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">{ paragraph }</p>
                    ))
                  }
                  <h2 className="py-3 text-lg font-bold">Galliard</h2>
                  <hr />
                  {
                    dataTrybe.alternativeAuspices.galliard.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">{ paragraph }</p>
                    ))
                  }
                  <h2 className="py-3 text-lg font-bold">Ahroun</h2>
                  <hr />
                  {
                    dataTrybe.alternativeAuspices.ahroun.map((paragraph: String, index: number) => (
                      <p key={ index } className="pt-3">{ paragraph }</p>
                    ))
                  }
                </div>
              </div>
            </div>
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
          <div className="flex items-center justify-center w-full">
            <button
              type="button"
              className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
              onClick={() => setShowFeedback(true) }
            >
              Enviar Feedback
            </button>
          </div>
          { showFeedback && <Feedback title={ dataTrybe.nameEn } /> }
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