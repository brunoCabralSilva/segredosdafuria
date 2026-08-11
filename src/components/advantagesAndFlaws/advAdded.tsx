'use client'
import { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";

export default function AdvAdded(props: { item: any }) {
  const { item } = props;
  const [showData, setShowData] = useState(false);

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
          {item.name} - {item.cost}
        </div>
      </div>
      {showData && (
        <div>
          <p className="px-5 pb-1 pt-2 text-justify font-geist-mono text-[10px] font-normal leading-5 text-white/78">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}