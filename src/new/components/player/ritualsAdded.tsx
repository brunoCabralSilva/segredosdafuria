'use client'
import contexto from "@/context/context";
import { useContext, useState } from "react";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { GiD10 } from "react-icons/gi";

export default function RitualsAdded(props: { ritual: any }) {
  const { ritual } = props;
  const [showData, setShowData] = useState(false);
  const { setShowRitualRoll } = useContext(contexto);
  return(
    <div className="flex flex-col gap-3 border border-white pl-2 p-2 mb-2 items-center text-justify">
      <div
        className={`w-full flex items-center justify-between ${showData && 'pl-4 transition-all'}`}
        onClick={() => {}}
      >
        <span className="font-bold">
          { ritual.titlePtBr }
        </span>
        <div className="flex items-center gap-2">
          {
            showData &&
            <button
              type="button"
              className="cursor-pointer"
              onClick={ () => setShowRitualRoll({ show: true, ritual }) }
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
            { 
              ritual.pool !== '' &&
              <p>
                <span className="pr-1 font-bold">Teste:</span>
                { ritual.pool }.
              </p>
            }
            <p className="pt-2">
              <span className="pr-1 font-bold">Descrição:</span>
              { ritual.descriptionPtBr }
            </p>
            { 
              ritual.pool !== '' &&
              <p className="pt-2">
                <span className="pr-1 font-bold">Sistema:</span>
                { ritual.systemPtBr }
              </p>
            }
          </div>
        }
    </div>
  );
}