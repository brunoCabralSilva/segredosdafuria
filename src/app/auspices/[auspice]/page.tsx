'use client';
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import listAuspices from '../../../data/auspices.json';
import Footer from "@/components/footer";
import { IAuspice } from "../../../interface";
import Feedback from "@/components/feedback";
import contexto from '@/context/context';
import Nav from '@/components/nav';
import { useParams } from 'next/navigation';

export default function Auspice() {
  const params = useParams();
  const auspice = params?.auspice as string;
  const [isLoading, setIsLoading] = useState(true);
  const [dataAuspice, setDataAuspice] = useState<IAuspice>();
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    const findAuspice: IAuspice | undefined = listAuspices
      .find((ausp: IAuspice) => auspice === ausp.name.toLowerCase()
    );
    setDataAuspice(findAuspice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataAuspice) {
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
            className="px-6 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
            onClick={() => setShowFeedback(true) }
          >
            Enviar Feedback
          </button>
          {
            showFeedback && <Feedback title={ dataAuspice.name } /> 
          }
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