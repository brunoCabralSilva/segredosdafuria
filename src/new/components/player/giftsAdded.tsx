'use client'
import { capitalizeFirstLetter } from "@/new/firebase/utilities";
import { useState } from "react";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { GiD10 } from "react-icons/gi";

export default function GiftsAdded(props: { gift: any }) {
  const { gift } = props;
  const [showData, setShowData] = useState(false);
  return(
    <div className="flex flex-col gap-3 border border-white pl-2 p-2 mb-2 items-center text-justify">
      <div
        className={`w-full flex items-center justify-between ${showData && 'pl-4 transition-all'}`}
        onClick={() => {}}
      >
        <span className="font-bold">
          { gift.giftPtBr } ({ gift.gift })
        </span>
        <div className="flex items-center gap-2">
          {
            showData &&
            <button
              type="button"
              className="cursor-pointer"
            >
              <GiD10 className="text-3xl text-white" />
            </button>
          }
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowData(!showData) }
          >
            {
            !showData
              ? <CiCircleChevDown className="text-4xl" />
              : <CiCircleChevUp className="text-4xl" />
            }
          </button>
        </div>
      </div>
        {
          showData &&
          <div className="px-4 pb-4">
            <p>
              <span className="pr-1 font-bold">Pertence à:</span>
              { 
                gift.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
                  <span key={ index } className="capitalize">
                    { capitalizeFirstLetter(belong.type) } ({ belong.totalRenown })
                    { index === gift.belonging.length - 1 ? '' : ', ' }
                  </span>
                ))
              }
            </p>
            <p>
            <span className="pr-1 font-bold">Ação:</span>
              { gift.action }.
            </p>
            <p>
              <span className="pr-1 font-bold">Renome:</span>
              { gift.renown }.
            </p>
            <p>
              <span className="pr-1 font-bold">Custo:</span>
              { gift.cost }.
            </p>
            {
              gift.pool !== '' &&
              <p>
                <span className="pr-1 font-bold">Teste:</span>
                { gift.pool }.
              </p>
            }
            <p className="pt-2">
              <span className="pr-1 font-bold">Descrição:</span>
              { gift.descriptionPtBr }
            </p>
            <p className="pt-2">
              <span className="pr-1 font-bold">Sistema:</span>
              { gift.systemPtBr }
            </p>
            {
              gift.duration !== '' &&
              <p className="pt-2">
                <span className="pr-1 font-bold">Duração:</span>
                { gift.duration }.
              </p>
            }
          </div>
        }
    </div>
  );
}