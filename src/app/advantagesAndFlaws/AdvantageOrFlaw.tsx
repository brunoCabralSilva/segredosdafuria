'use client'
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function AdvantageOrFlaw(props: { item: any }) {
  const { item } = props;
  const [showAdvantage, setShowAdvantage] = useState(false);
  
  const returnDot = (value: number) => {
    let text = '';
    for (let i = 0; i < value; i += 1) {
      text += '●';
    }
    return text + ' ';
  };

  return(
    <div className="border-2 border-white my-2 bg-black">
      <button
        type="button"
        onClick={ () => setShowAdvantage(!showAdvantage)}
        className="capitalize p-4 font-bold flex w-full justify-between items-center "
      >
        <p className="text-base sm:text-lg w-full text-left">{ item.name }</p>
        { showAdvantage
          ? <IoIosArrowUp  />
          : <IoIosArrowDown />
        }
      </button>
      {
        showAdvantage &&
        <div className="px-4 pb-4">
          <p>{ item.description }</p>
          {
            item.advantages.length > 0 &&
            <div className="w-full">
              <p className="pt-3 font-bold">Vantagens:</p>
              {
                item.advantages
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
            item.flaws.length > 0 &&
            <div className="w-full">
              <p className="pt-3 font-bold">Defeitos</p>
              {
                item.flaws
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
      }
    </div>
  );
}