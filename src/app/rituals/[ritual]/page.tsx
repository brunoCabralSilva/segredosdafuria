'use client';
import { useContext, useEffect, useState } from "react";
import Nav from '@/components/nav';
import Footer from "@/components/footer";
import listRituals from '../../../data/rituals.json';
import { IRitual } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from "@/context/context";
import { useParams } from "next/navigation";


export default function Ritual() {
  const params = useParams();
  const ritual = params?.ritual as string;
  const [dataRitual, setDataRitual] = useState<IRitual>();
  const { showFeedback, setShowFeedback, setListOfRituais, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findRitual: any | undefined = listRituals
      .find((rtl: any) => ritual === rtl.id);
    setDataRitual(findRitual);
    setListOfRituais(listRituals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataRitual) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
            <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white overflow-y-auto">
              <div className="flex flex-col justify-center items-center sm:items-start">
                <h1 className="font-bold text-lg text-center sm:text-left w-full">
                  {`${ dataRitual.titlePtBr } (${ dataRitual.title }) - ${ dataRitual.type}`}
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
              {
                dataRitual.systemPtBr !== '' &&
                <p className="pt-1 text-justify">
                  <span className="font-bold pr-1">Sistema:</span>
                  { dataRitual.systemPtBr }
                </p>
              }
              <p className="pt-3 text-justify">
                <span className="font-bold pr-1">Description (original):</span>
                { dataRitual.description }
              </p>
              {
                dataRitual.system !== '' &&
                <p className="pt-1 text-justify">
                  <span className="font-bold pr-1">System (original):</span>
                  { dataRitual.system }
                </p>
              }
              <div className="flex flex-col sm:flex-row sm:justify-between">
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
              <button
                type="button"
                className="text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
                onClick={() => setShowFeedback(true) }
              >
                Enviar Feedback
              </button>
              </div>
              { showFeedback && <Feedback title={ dataRitual.title } /> }
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