'use client';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Simplify from "@/components/simplify";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import listLoresheets from '../../../data/loresheets.json';
import { IHabilities, ILoresheet } from "../../../../interface";
import Feedback from "@/components/feedback";

export default function Loresheet({ params } : { params: { loresheet: String } }) {
  const [dataLoresheet, setDataLoresheet] = useState<ILoresheet>();
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    const findLoresheet: ILoresheet | undefined = listLoresheets
      .find((lrsht: ILoresheet) => params.loresheet.replace(/-/g, ' ') === lrsht.title.toLowerCase());
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
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
        <Simplify />
        <Nav />
        <section className="mb-2 relative px-2 min-h-screen">
          <div className="py-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto">
          <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/70 text-white overflow-y-auto">
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
            <ul className="pt-3 sm:justify-between">
              {
                dataLoresheet.habilities.map((hability: IHabilities, index: number) => (
                  <div className="pt-2 text-justify flex" key={ index }>
                    {returnDot(index) }{hability.skillPtBr}
                  </div>
                ))
              }
            </ul>
            <p className="pt-3 text-justify">
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
            </ul>
            <div className="flex flex-col sm:flex-row sm:justify-between">
            <button
                type="button"
                className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
                onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
              >
                Enviar Feedback
              </button>
              {
                slice.feedback.show && <Feedback title={ dataLoresheet.title } /> 
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
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
      <Simplify />
      <Nav />
      <span className="loader z-50" />
    </div>
  );
}