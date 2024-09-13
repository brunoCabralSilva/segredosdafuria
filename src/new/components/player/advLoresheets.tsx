import dataLoresheets from '../../../data/loresheets.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/new/firebase/players';
import { useContext } from "react";

export default function AdvLoresheets() {
  const {
    email,
    dataSheet,
    sessionId,
    returnSheetValues,
  } = useContext(contexto);

  const updateLoresheet = async(
    name: string,
    description: string,
    cost: number,
    skill: string,
  )  => {
    const obj = { name, cost, description, skill };
    let newList = dataSheet.advantagesAndFlaws.loresheets;
    const sameName = newList.filter((item: any) => item.name === name);
    if (sameName.length > 0) {
      const equal = newList.find((item: any) => item.skill === skill);
      if (equal) newList = newList.filter((item: any) => item.skill !== skill);
      else newList.push(obj);
    } else newList.push(obj);
    dataSheet.advantagesAndFlaws.loresheets = newList;
    await updateDataPlayer(sessionId, email, dataSheet);
    returnSheetValues();
  }

  return (
    <div>
      {
        dataLoresheets.map((item: any, index: number) => (
          <div key={index} className="p-5 bg-gray-whats">
            <p className="capitalize text-xl pb-3 font-bold">{ item.titlePtBr }</p>
            <p>{ item.descriptionPtBr }</p>
            {
              item.habilities.map((adv: any, index2: number) => (
                <div
                  key={index2}
                  onClick={() => {
                    updateLoresheet(item.titlePtBr, item.descriptionPtBr, adv.cost, adv.skillPtBr) 
                  }}
                  className={`${dataSheet.advantagesAndFlaws.loresheets.find((item2: any) => item2.skill === adv.skillPtBr) ? 'bg-black' : ''} mt-3 pt-3 border-2 border-white p-4 cursor-pointer`}
                >
                  <p>Custo { adv.cost } - { adv.skillPtBr }</p>
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}