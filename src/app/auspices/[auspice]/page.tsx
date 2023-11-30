'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import listAuspices from '../../../data/auspices.json';
import Simplify from "@/components/simplify";
import Nav from "@/components/nav";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Footer from "@/components/footer";
import { IAuspice } from "../../../interface";
import Feedback from "@/components/feedback";

export default function Auspice({ params } : { params: { auspice: String } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataAuspice, setDataAuspice] = useState<IAuspice>();
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    const findAuspice: IAuspice | undefined = listAuspices
      .find((ausp: IAuspice) => params.auspice === ausp.name.toLowerCase()
    );
    setDataAuspice(findAuspice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataAuspice) {
    return(
      <div className="w-full bg-ritual bg-cover bg-top relative">
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
        <Simplify />
        <Nav />
        <section className="mb-2 relative px-2">
        <div className="py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
          <div className="flex items-center justify-center w-full relative h-full">
            <div className="absolute h-full w-full sm:w-5/12 flex items-center justify-center">
              { isLoading && <span className="loader z-50" /> }
            </div>
            <Image
              src={`/images/auspices/${dataAuspice.name} - referencia.png`}
              alt={`Representação dos ${dataAuspice.name}`}
              className="object-contain h-50vh dataAuspice-contain mobile:w-8/12 sm:w-5/12 relative px-6"
              width={800}
              height={400}
              onLoad={() => setIsLoading(false)}
            />
          </div>
          <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base">
            <h2 className=" font-bold text-xl sm:text-2xl w-full text-center">
              { dataAuspice.name }
            </h2>
            <div className="flex items-center justify-center w-full text-sm">
              <p className="mt-1 sm:mt-3 text-center sm:w-1/2">
                &quot;{ dataAuspice.phrase }&quot;
              </p>
            </div>
            <div className="w-full flex items-center justify-center my-5">
              <Image
                src={`/images/auspices/${dataAuspice.name}.png`}
                alt={`Glifo dos ${dataAuspice.name}`}
                className="w-20 sm:w-38 my-2"
                width={800}
                height={400}
              />
            </div>
            {
              dataAuspice.description.map((paragraph: String, index: number) => (
                <p key={ index }>
                  { paragraph }
                </p>
              ))
            }
          </div>
          <button
            type="button"
            className={`px-6 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
            onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
          >
            Enviar Feedback
          </button>
          {
            slice.feedback.show && <Feedback title={ dataAuspice.name } /> 
          }
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