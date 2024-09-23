import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/firebase/players';
import { useContext } from "react";

export default function AdvOfFlaw(props: { type: string }) {
  const { type } = props;
  const {
    email,
    dataSheet,
    sessionId,
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
    if (advOfFlaw === 'flaw') newList = dataSheet.advantagesAndFlaws.flaws;
    else newList = dataSheet.advantagesAndFlaws.advantages;
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
    if (advOfFlaw === 'flaw') dataSheet.advantagesAndFlaws.flaws = newList;
    else dataSheet.advantagesAndFlaws.advantages = newList;
    await updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
  }

  return (
    <div>
       {
        type === 'advantage' &&
        dataAdvAndFlaws &&
        dataAdvAndFlaws
          .filter((dataItem) => dataItem.advantages.length > 0)
          .map((item: any, index: number) => (
          <div key={index} className="p-5 bg-gray-whats">
            <p className="capitalize text-xl pb-3 font-bold">{ item.name }</p>
            <p>{ item.description }</p>
            {
              item.advantages.map((adv: any, index2: number) => (
                <div
                  key={index2}
                  onClick={() => {
                    updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'advantage') 
                  }}
                  className={`${dataSheet.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description) ? 'bg-black' : ''} mt-3 pt-3 border-2 border-white p-4 cursor-pointer`}
                >
                  <p>Custo { adv.cost } - { adv.description }</p>
                </div>
              ))
            }
          </div>
        ))
      }
      {
        type === 'flaw' &&
        dataAdvAndFlaws &&
        dataAdvAndFlaws
          .filter((dataItem) => dataItem.flaws.length > 0)
          .map((item: any, index: number) => (
            <div key={index} className="p-5 bg-gray-whats">
              <p className="capitalize text-xl pb-3 font-bold">{ item.name }</p>
              <p>{ item.description }</p>
              {
                item.flaws.map((adv: any, index2: number) => (
                  <div
                    key={index2}
                    onClick={() => {
                      updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'flaw')
                    }}
                    className={`${dataSheet.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description) ? 'bg-black' : ''} mt-3 pt-3 border-2 border-white p-4 cursor-pointer`}
                  >
                    <p>Custo { adv.cost } - { adv.description }</p>
                  </div>
                ))
              }
            </div>
          ))
      }
    </div>
  );
}