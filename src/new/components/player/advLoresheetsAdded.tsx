'use client'
import { useEffect, useState } from "react";
import dataTalens from '../../../data/talismans.json';
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";

export default function AdvLoresheetsAdded(props: { item: any }) {
  const { item } = props;
  const [showData, setShowData] = useState(false);
  return(
    <div className="flex flex-col gap-3 border border-white pl-2 p-2 mb-2 items-center">
      <div
        className="w-full flex items-center justify-between"
        onClick={() => {}}
      >
        <span className="font-bold pl-3" id={`advantages-${item.name}`}>
          {item.name} - { item.cost }
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
              { item.description }
            </p>
            <p className="text-base text-justify font-normal px-3 mb-3">
              <span className="pr-1 font-bold">Benefício:</span>
              { item.skill }
            </p>
          </div>
        }
    </div>
  );
}