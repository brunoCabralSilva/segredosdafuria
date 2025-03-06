import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/firebase/players';
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export default function ItemAdvantage(props: { item: any, type: string }) {
  const { type, item } = props;
  const [showAdvantage, setShowAdvantage] = useState(false);
  const {
    sheetId,
    dataSheet,
    setShowMessage,
  } = useContext(contexto);

  const updateAdvantageOrFlaw = async (
    name: string,
    cost: string,
    type: string,
    description: string,
    title: string,
    advOfFlaw: string,
  ) => {
    const obj = { name, cost, description, type, title };
    let newList: any = [];
    if (advOfFlaw === 'flaw') newList = dataSheet.data.advantagesAndFlaws.flaws;
    else newList = dataSheet.data.advantagesAndFlaws.advantages;
    if (newList.length === 0) newList.push(obj);
    else {
      const sameName = newList.filter((item: any) => item.name === name);
      if (sameName.length > 0) {
        const equal = newList.find((item: any) => item.description === description);
        if (equal) {
          newList = newList.filter((item: any) => item.description !== description);
        } else {
          if (type === 'radio') {
            newList = newList.filter((item: any) => item.name !== name || (item.name === name && type !== 'radio'));
            newList.push(obj);
          } else newList.push(obj);
        }
      } else newList.push(obj);
    }
    if (advOfFlaw === 'flaw') dataSheet.data.advantagesAndFlaws.flaws = newList;
    else dataSheet.data.advantagesAndFlaws.advantages = newList;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
  }

  const verifySelected = () => {
    if (type === 'flaw') {
      return item.flaws.find((adv: any) => {
        return dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description)
      });
    }
    return item.advantages.find((adv: any) => {
      return dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description)
    });
  }

  return (
    <div>
      {
        type === 'advantage' &&
        dataAdvAndFlaws &&
          <div className={`${verifySelected() && !showAdvantage ? 'bg-black border-2 border-red-500' : 'bg-gray-whats-dark border-2 border-white'} `}>
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
                item.advantages.map((adv: any, index2: number) => (
                  <div
                    key={index2}
                    onClick={() => {
                      updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'advantage') 
                    }}
                    className={`${dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description) ? 'bg-black border-2 border-red-500' : 'border-2 border-white'} mt-3 pt-3 p-4 cursor-pointer`}
                  >
                    <p>Custo { adv.cost } - { adv.description }</p>
                  </div>
                ))
              }
              </div>
            }
          </div>
        }
        {
          type === 'flaw' &&
          dataAdvAndFlaws &&
          <div className={`${verifySelected() && !showAdvantage ? 'bg-black border-2 border-red-500' : 'border-2 border-white bg-gray-whats-dark'}`}>
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
                  item.flaws.map((adv: any, index2: number) => (
                    <div
                      key={index2}
                      onClick={() => {
                        updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'flaw')
                      }}
                      className={`${dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description) ? 'bg-black border-2 border-red-500' : 'border-2 border-white'} mt-3 pt-3 p-4 cursor-pointer`}
                    >
                      <p>Custo { adv.cost } - { adv.description }</p>
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