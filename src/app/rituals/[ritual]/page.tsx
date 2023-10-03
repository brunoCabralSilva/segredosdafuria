'use client';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Simplify from "@/components/simplify";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import listRituals from '../../../data/rituals.json';
import { IRitual } from "../../../../interface";
import Feedback from "@/components/feedback";


export default function Gift({ params } : { params: { ritual: String } }) {
  const [dataRitual, setDataRitual] = useState<IRitual>();
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    const findRitual: IRitual | undefined = listRituals
      .find((rtl: IRitual) => params.ritual.replace(/-/g, ' ') === rtl.title.toLowerCase());
    setDataRitual(findRitual);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataRitual) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
        <Simplify />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
            <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white overflow-y-auto">
              <div className="flex flex-col justify-center items-center sm:items-start">
                <h1 className="font-bold text-lg text-center sm:text-left w-full">
                  {`${ dataRitual.titlePtBr } (${ dataRitual.title }) - ${ dataRitual.type === 'social' ? "Social" : 'Comum' }`}
                </h1>
                <hr className="w-10/12 my-4 sm:my-2" />
              </div>
              <p className="pt-1">
                <span className="font-bold pr-1">Fonte:</span>
                { dataRitual.book }, pg. { dataRitual.page }.
              </p>
              { dataRitual.pool !== "" &&
                <p className="pt-1">
                  <span className="font-bold pr-1">Parada de Dados:</span>
                  { dataRitual.pool }.
                </p>
              }
              <p className="pt-3 text-justify">
                <span className="font-bold pr-1">Descrição:</span>
                { dataRitual.descriptionPtBr }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">Sistema:</span>
                { dataRitual.systemPtBr }
              </p>
              <p className="pt-3 text-justify">
                <span className="font-bold pr-1">Description (original):</span>
                { dataRitual.description }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">System (original):</span>
                { dataRitual.system }
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between">
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
              <button
                type="button"
                className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
                onClick={() => dispatch(actionFeedback({ show: true, message: dataRitual.title })) }
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