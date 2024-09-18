'use client';
import { useContext, useEffect, useState } from "react";
import Nav from '@/components/nav';
import Footer from "@/components/footer";
import listTalismans from '../../../data/talismans.json';
import { ITalisman } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from "@/context/context";

export default function Talisman({ params } : { params: { talisman: String } }) {
  const [dataTalisman, setDataTalisman] = useState<ITalisman>();
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findTalisman: ITalisman | undefined = listTalismans
      .find((tlsmn: ITalisman) => params.talisman.replace(/-/g, ' ') === tlsmn.title.toLowerCase());
    setDataTalisman(findTalisman);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataTalisman) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
            <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white overflow-y-auto">
              <div className="flex flex-col justify-center items-center sm:items-start">
                <h1 className="font-bold text-lg text-center sm:text-left w-full">
                  {`${ dataTalisman.titlePtBr } (${ dataTalisman.title })`}
                </h1>
                <hr className="w-10/12 my-4 sm:my-2" />
              </div>
              <p className="pt-1">
                <span className="font-bold pr-1">Fonte:</span>
                { dataTalisman.book }, pg. { dataTalisman.page }.
              </p>
              {
                <p className="pt-1">
                  <span className="font-bold pr-1">Custo:</span>
                  { dataTalisman.backgroundCostPtBr }.
                </p>
              }
              {
                <p className="pt-1">
                  <span className="font-bold pr-1">Cost:</span>
                  { dataTalisman.backgroundCost }.
                </p>
              }
              <p className="pt-3 text-justify">
                <span className="font-bold pr-1">Descrição:</span>
                { dataTalisman.descriptionPtBr }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">Sistema:</span>
                { dataTalisman.systemPtBr }
              </p>
              <p className="pt-3 text-justify">
                <span className="font-bold pr-1">Description (original):</span>
                { dataTalisman.description }
              </p>
              <p className="pt-1 text-justify">
                <span className="font-bold pr-1">System (original):</span>
                { dataTalisman.system }
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
                showFeedback && <Feedback title={ dataTalisman.title } /> 
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