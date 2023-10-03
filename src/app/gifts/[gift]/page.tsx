'use client';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Image from "next/image";
import Simplify from "@/components/simplify";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import listGifts from '../../../data/gifts.json';
import { IGift, ITypeGift } from "../../../../interface";
import Feedback from "@/components/feedback";

export default function Gift({ params } : { params: { gift: String } }) {
  const [dataGift, setDataGift] = useState<IGift>();
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    const findGift: IGift | undefined = listGifts
      .find((gft: IGift) => params.gift.replace(/-/g, ' ') === gft.gift.toLowerCase());
    setDataGift(findGift);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guarda do Cervo';
      case 'ghost council': return 'Conselho Fantasma';
      case 'galestalkers': return 'Perseguidores da Tempestade';
      case 'glass walkers': return 'Andarilhos do Asfalto';
      case 'bone gnawers': return 'Roedores de Ossos';
      case 'shadow lords': return 'Senhores das Sombras';
      case 'children of gaia': return 'Filhos de Gaia';
      case 'red talons': return 'Garras Vermelhas';
      default: return str.charAt(0).toUpperCase() + str.slice(1);;
    }
  };

  if (dataGift) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
        <Simplify />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
            <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white">
              <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
                <div className="relative text-white flex sm:hidden w-full justify-center pb-5">
                  { 
                    dataGift.belonging.map((trybe: ITypeGift, index: number) => (
                      <Image
                        key={ index }
                        src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
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
                className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
                onClick={() => dispatch(actionFeedback({ show: true, message: dataGift.gift })) }
              >
                Enviar Feedback
              </button>
              </div>
              { slice.feedback.show && <Feedback title={ slice.feedback.title } /> }
            </article>
          </div>
        </section>
      <Footer />
    </div>
  );
} return (
    <div className="w-full bg-ritual bg-cover bg-top relative h-screen">
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
      <Simplify />
      <Nav />
      <span className="loader z-50" />
    </div>
  );
}