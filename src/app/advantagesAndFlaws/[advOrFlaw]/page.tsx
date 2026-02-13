'use client'
import contexto from "@/context/context";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import listAdvantagesOrFlaws from '../../../data/advantagesAndFlaws.json';
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { IAdOrFlaws } from "@/interface";

export default function AdvOrFlaw() {
  const params = useParams();
  const advOrFlaw = params?.advOrFlaw as string;
  const [dataAdvOrFlaw, setDataAdvOrFlaw] = useState<IAdOrFlaws>({
    id: '',
    advantages: [],
    flaws: [],
    name: '',
    type: '',
    description: '',
  });
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);

  const returnDot = (value: number) => {
    let text = '';
    for (let i = 0; i < value; i += 1) {
      text += '●';
    }
    return text + ' ';
  };

  useEffect(() => {
    resetPopups();
    const findAdvOrFlaw: IAdOrFlaws | undefined = listAdvantagesOrFlaws
      .find((adv: IAdOrFlaws) => advOrFlaw === adv.id);
      if (findAdvOrFlaw) setDataAdvOrFlaw(findAdvOrFlaw);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataAdvOrFlaw) {
      return(
        <div className="w-full bg-ritual bg-cover bg-top relative">
          <div className="absolute w-full h-full bg-black/90" />
          <Nav />
          <section className="relative h-screen">
            <div className="pt-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify overflow-y-auto h-screen">
              <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-black/90 text-white">
                <div className="px-4 w-full">
                  <h1 className="font-bold text-lg text-center sm:text-left w-full">
                    { dataAdvOrFlaw.name }
                  </h1>
                  <hr className="w-10/12 my-4 sm:my-2" />
                </div>
                <div className="px-4 pb-4">
                  <p>{ dataAdvOrFlaw.description }</p>
                  {
                    dataAdvOrFlaw.advantages && dataAdvOrFlaw.advantages.length > 0 &&
                    <div className="w-full">
                      <p className="pt-3 font-bold">Vantagens:</p>
                      {
                        dataAdvOrFlaw.advantages
                        .sort((a: any, b: any) => a.cost - b.cost)
                        .map((adv: any, index2: number) => (
                          <div
                            key={index2}
                            className="border-2 border-white'} mt-3 pt-3 p-4"
                          >
                            <p>{ returnDot(adv.cost) }{ adv.description }</p>
                          </div>
                        ))
                      }
                    </div>
                  }
                  {
                    dataAdvOrFlaw.flaws && dataAdvOrFlaw.flaws.length > 0 &&
                    <div className="w-full">
                      <p className="pt-3 font-bold">Defeitos</p>
                      {
                        dataAdvOrFlaw.flaws
                        .sort((a: any, b: any) => a.cost - b.cost)
                        .map((adv: any, index2: number) => (
                          <div
                            key={index2}
                            className="border-2 border-white'} mt-3 pt-3 p-4"
                          >
                            <p>{ returnDot(adv.cost) }{ adv.description }</p>
                          </div>
                        ))
                      }
                    </div>
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