'use client';
import { useContext, useEffect, useState } from "react";
import Nav from '@/components/nav';
import Footer from "@/components/footer";
import listLoresheets from '../../../data/loresheets.json';
import { IHabilities, ILoresheet } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from "@/context/context";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function Loresheet() {
  const params = useParams();
  const loresheet = params?.loresheet as string;
  const [dataLoresheet, setDataLoresheet] = useState<ILoresheet>();
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findLoresheet: ILoresheet | undefined = listLoresheets
      .find((lrsht: ILoresheet) => Number(loresheet) === lrsht.id);
    setDataLoresheet(findLoresheet);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnDot = (index: number) => {
    const dots = ['● ', '●● ', '●●● ', '●●●● ', '●●●●● '];
    return dots[index];
  };

  if (dataLoresheet) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className="absolute w-full h-full bg-black/90" />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
          <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <Image
                src={ `/images/loresheets/${dataLoresheet.titlePtBr}.png` }
                alt={dataLoresheet.title}
                className="w-full md:w-50vw object-cover object-center"
                width={ 3000 }
                height={ 3000 }
              />
              <div>
                <div className="flex flex-col justify-center items-center sm:items-start">
                  <h1 className="font-bold text-lg text-center sm:text-left w-full">
                    {`${ dataLoresheet.titlePtBr } (${ dataLoresheet.title })`}
                  </h1>
                  <hr className="w-10/12 my-4 sm:my-2" />
                </div>
                <p className="pt-1">
                  <span className="font-bold pr-1">Fonte:</span>
                  { dataLoresheet.book }, pg. { dataLoresheet.page }.
                </p>
                <p className="pt-3 text-justify">
                  <span className="font-bold pr-1">Descrição:</span>
                  { dataLoresheet.descriptionPtBr }
                </p>
              </div>
            </div>
            <ul className="pt-3 sm:justify-between">
              {
                dataLoresheet.habilities.map((hability: IHabilities, index: number) => (
                  <div className="pt-2 text-justify flex" key={ index }>
                    {returnDot(index) }{hability.skillPtBr}
                  </div>
                ))
              }
            </ul>
            {/* <p className="pt-3 text-justify">
              <span className="font-bold pr-1">Description (original):</span>
              { dataLoresheet.description }
            </p>
            <ul className="list-disc lex flex-col sm:justify-between">
            {
                dataLoresheet.habilities.map((hability: IHabilities, index: number) => (
                  <div className="pt-2 text-justify flex" key={ index }>
                    {returnDot(index) }{hability.skill}
                  </div>
                ))
              }
            </ul> */}
            <div className="flex flex-col sm:flex-row sm:justify-between">
            <button
                type="button"
                className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
                onClick={() => setShowFeedback(true) }
              >
                Enviar Feedback
              </button>
              {
                showFeedback && <Feedback title={ dataLoresheet.title } /> 
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