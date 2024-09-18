import dataTalens from '../../data/talismans.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/firebase/players';
import { useContext } from "react";

export default function AdvTalens() {
  const {
    email,
    dataSheet,
    sessionId,
    returnSheetValues,
    setShowMessage,
  } = useContext(contexto);

  const updateTalen = async (
    name: string,
    description: string,
    value: number,
    type: string,
  ) => {
    const obj = { name, value, description, type };
    console.log(obj);
    let newList = dataSheet.advantagesAndFlaws.talens;
    if (newList.length === 0) newList.push(obj);
    else {
      const sameName = newList.filter((item: any) => item.name === name);
      if (sameName.length > 0) {
        const equal = newList.find((item: any) => item.name === name && item.value === value && item.type === type);
        if (equal) newList = newList.filter((item: any) => item.name !== name || (item.name === name && item.value !== value));
        else newList.push(obj);
      } else newList.push(obj);
    }
    console.log(newList);
    dataSheet.advantagesAndFlaws.talens = newList;
    await updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
    returnSheetValues();
  }

  return (
    <div>
       {
        dataTalens.map((item: any, index: number) => (
          <div key={index} className="p-5 bg-gray-whats">
            <p className="capitalize text-xl pb-3 font-bold">{ item.titlePtBr }</p>
            <p>{ item.descriptionPtBr }</p>
            <p>{ item.systemPtBr }</p>
            <p>{ item.backgroundCostPtBr }</p>
            {
              item.cost.map((adv: any, index2: number) => (
                <div
                  key={index2}
                  onClick={() => {
                    updateTalen(item.titlePtBr, item.descriptionPtBr, adv.value, adv.type) 
                  }}
                  className={`${dataSheet.advantagesAndFlaws.talens.find((item2: any) => item2.name === item.titlePtBr && item2.type === adv.type && item2.value === adv.value) ? 'bg-black' : ''} mt-3 pt-3 border-2 border-white p-4 cursor-pointer`}
                >
                  <p>Custo do { adv.type } - { adv.value }</p>
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}