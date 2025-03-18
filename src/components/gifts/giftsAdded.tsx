'use client'
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Image from "next/image";
import { useContext, useState } from "react";
import { GiD10 } from "react-icons/gi";

export default function GiftsAdded(props: { gift: any }) {
  const { gift } = props;
  const [showData, setShowData] = useState(false);
  const { setShowGiftRoll } = useContext(contexto);
  return(
    <div className="flex flex-col gap-3 border border-white pl-2 p-2 mb-2 items-center text-justify font-normal">
      <div
        className={`w-full flex flex-col items-center cursor-pointer justify-between relative ${showData && 'pl-4 transition-all'}`}
        onClick={() => setShowData(!showData)}
      >
        <div className="flex justify-center items-center mb-2">
          {
            gift.belonging.map((belong: any, index: number) => (
              <Image
                key={index}
                src={`/images/gifts/${capitalizeFirstLetter(belong.type)}.png`}
                alt={`Glifo dos ${capitalizeFirstLetter(belong.type)}`}
                className="h-8 relative object-contain"
                width={35}
                height={400}
              />
            ))
          }
        </div>
        <div className="font-bold">{ gift.giftPtBr }</div>
        <div className={`flex items-center gap-2 ${showData && 'absolute top-2 right-2'}`}>
          {
            showData &&
            <button
              type="button"
              className={`cursor-pointer`}
              onClick={ () => setShowGiftRoll({ show: true, gift }) }
            >
              <GiD10 className="text-3xl text-white" />
            </button>
          }
        </div>
      </div>
        {
          showData &&
          <div className="px-4 pb-4">
            <div>
              <span className="pr-1 font-bold">Pertence à:</span>
              { 
                gift.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
                  <span key={ index } className="capitalize">
                    { capitalizeFirstLetter(belong.type) } ({ belong.totalRenown })
                    { index === gift.belonging.length - 1 ? '' : ', ' }
                  </span>
                ))
              }
            </div>
            <div>
              <span className="pr-1 font-bold">Ação:</span>
              <span className="font-normal">{ gift.action }.</span>
            </div>
            <div>
              <span className="pr-1 font-bold">Renome:</span>
              <span className="font-normal">{ gift.renown }.</span>
            </div>
            <div>
              <span className="pr-1 font-bold">Custo:</span>
              <span className="font-normal">{ gift.cost }.</span>
            </div>
            {
              gift.pool !== '' &&
              <div>
                <span className="pr-1 font-bold">Teste:</span>
                <span className="font-normal">{ gift.pool }.</span>
              </div>
            }
            <div className="pt-2">
              <span className="pr-1 font-bold">Descrição:</span>
              <span className="font-normal">{ gift.descriptionPtBr }</span>
            </div>
            <div className="pt-2">
              <span className="pr-1 font-bold">Sistema:</span>
              <span className="font-normal">{ gift.systemPtBr }</span>
            </div>
            {
              gift.duration !== '' &&
              <div className="pt-2">
                <span className="pr-1 font-bold">Duração:</span>
                <span className="font-normal">{ gift.duration }.</span>
              </div>
            }
          </div>
        }
    </div>
  );
}