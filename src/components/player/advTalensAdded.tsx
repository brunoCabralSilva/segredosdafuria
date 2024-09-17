'use client'
import { useEffect, useState } from "react";
import dataTalens from '../../data/talismans.json';
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";

export default function TalensAdded(props: { item: any }) {
  const { item } = props;
  const [showData, setShowData] = useState(false);
  const [talen, setTalen] = useState<any>({});

  useEffect(() => {
    setTalen(dataTalens.find((item2: any) => item2.titlePtBr === item.name));
  }, []);
  return(
    <div className="flex flex-col gap-3 border border-white pl-2 p-2 mb-2 items-center">
      <div
        className="w-full flex items-center justify-between"
        onClick={() => {}}
      >
        <span className="font-bold pl-3" id={`advantages-${item.name}`}>
          {item.name} - { item.value } - { item.type }
        </span>
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
        {
          showData &&
          <div>
            <p className="text-base text-justify font-normal px-3 mb-3">
              <span className="pr-1 font-bold">Descrição:</span>
              { talen.descriptionPtBr && talen.descriptionPtBr }
            </p>
            <p className="text-base text-justify font-normal px-3 mb-3">
              <span className="pr-1 font-bold">Sistema:</span>
              { talen.systemPtBr && talen.systemPtBr }
            </p>
          </div>
        }
    </div>
  );
}