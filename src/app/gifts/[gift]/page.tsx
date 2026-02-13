'use client';
import { useContext, useEffect, useState } from "react";
import Image from 'next/image';
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import listGifts from '../../../data/gifts.json';
import { IGift, ITypeGift } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useParams } from "next/navigation";

export default function Gift() {
  const params = useParams();
  const gift = params?.gift as string;
  const [dataGift, setDataGift] = useState<IGift>();
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findGift: IGift | undefined = listGifts
      .find((gft: IGift) => gift === gft.id);
    setDataGift(findGift);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataGift) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="relative min-h-screen">
          <div className="pt-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
            <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white">
              <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
                <div className="relative text-white flex sm:hidden w-full justify-center pb-5">
                  { 
                    dataGift.belonging.map((trybe: ITypeGift, index: number) => (
                      <Image
                        key={ index }
                        src={ `/images/gifts/${capitalizeFirstLetter(trybe.type)}.png` }
                        alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
                        className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
                        width={ 1200 }
                        height={ 800 }
                      />
                    ))
                  }
                </div>
                <h1 className="font-bold text-lg text-center sm:text-left w-full">
                  {`${ dataGift.giftPtBr } (${ dataGift.gift }) - ${ dataGift.renown }`}
                </h1>
                <hr className="w-10/12 my-4 sm:my-2" />
              </div>
              <p>
                <span className="font-bold pr-1">Pertencente a:</span>
                { 
                  dataGift.belonging.map((trybe: ITypeGift, index: number) => (
                    <span key={ index }>
                      { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                      { index === dataGift.belonging.length -1 ? '.' : ', ' }
                    </span>
                  ))
                }
              </p>
              <p className="pt-1">
                <span className="font-bold pr-1">Fonte:</span>
                { dataGift.book }, pg. { dataGift.page }.
              </p>
              <p className="pt-1">
                <span className="font-bold pr-1">Custo:</span>
                { dataGift.cost }.
              </p>
              <p className="pt-1">
                <span className="font-bold pr-1">Ação:</span>
                { dataGift.action }.
              </p>
              { dataGift.pool !== "" &&
                <p className="pt-1">
                  <span className="font-bold pr-1">Parada de Dados:</span>
                  { dataGift.pool }.
                </p>
              }
              { dataGift.duration !== "" &&
                <p className="pt-1">
                  <span className="font-bold pr-1">Duração:</span>
                  { dataGift.duration }.
                </p>
              }
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">Descrição:</span>
                { dataGift.descriptionPtBr }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">Sistema:</span>
                { dataGift.systemPtBr }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">Description (original):</span>
                { dataGift.description }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">System (original):</span>
                { dataGift.system }
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between">
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
              <button
                type="button"
                className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
                onClick={() => setShowFeedback(true) }
              >
                Enviar Feedback
              </button>
              {
                showFeedback && <Feedback title={ dataGift.gift } /> 
              }
              </div>
            </article>
          </div>
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