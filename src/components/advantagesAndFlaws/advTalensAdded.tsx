'use client'
import { useEffect, useState } from "react";
import dataTalens from '../../data/talismans.json';
import { IoMdArrowDropright } from "react-icons/io";

export default function TalensAdded(props: { item: any }) {
  const { item } = props;
  const [showData, setShowData] = useState(false);
  const [talen, setTalen] = useState<any>({});

  useEffect(() => {
    setTalen(dataTalens.find((item2: any) => item2.titlePtBr === item.name));
  }, []);

  return (
    <div className="w-full border-b border-white/[0.07] pb-2 text-left last:border-b-0">
      <div className="flex items-start gap-1.5">
        <div className="flex pt-[2px] text-white/65">
          <IoMdArrowDropright
            onClick={() => setShowData(!showData)}
            className={`${showData ? 'rotate-90' : ''} cursor-pointer text-base transition-all`}
          />
        </div>
        <div className="font-geist-mono text-[11px] uppercase tracking-[0.08em] text-white">
          {item.name} - {item.value} - {item.type}
        </div>
      </div>
      {showData && (
        <div className="space-y-1.5 px-5 pb-1 pt-2 font-geist-mono text-[10px] font-normal leading-5 text-white/78">
          <p className="text-justify">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Descrição:</span>
            {talen.descriptionPtBr && talen.descriptionPtBr}
          </p>
          <p className="text-justify">
            <span className="pr-1 uppercase tracking-[0.08em] text-white">Sistema:</span>
            {talen.systemPtBr && talen.systemPtBr}
          </p>
        </div>
      )}
    </div>
  );
}