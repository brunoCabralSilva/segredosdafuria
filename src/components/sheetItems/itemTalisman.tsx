import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from '@/firebase/players';
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ItemTalisman(props: { item: any }) {
  const { item } = props;
  const [showTalisman, setShowTalisman] = useState(false);
  const {
    email,
    session,
    sheetId,
    dataSheet,
    setShowMessage,
  } = useContext(contexto);

  const updateTalen = async (
    name: string,
    description: string,
    value: number,
    type: string,
  ) => {
    const obj = { name, value, description, type };
    let newList = dataSheet.data.advantagesAndFlaws.talens;
    const findTls = dataSheet.data.advantagesAndFlaws.talens.filter((flaw: any) => flaw.name === name);
    const dataPersist = findTls
      .map((flaw: any) => `"${flaw.type} (${flaw.value})"`)
      .join(', ')
      .replace(/, ([^,]+)$/, ' e $1');
    if (newList.length === 0) newList.push(obj);
    else {
      const sameName = newList.filter((item: any) => item.name === name);
      if (sameName.length > 0) {
        const equal = newList.find((item: any) => item.name === name && item.value === value && item.type === type);
        if (equal) newList = newList.filter((item: any) => item.name !== name || (item.name === name && item.value !== value));
        else newList.push(obj);
      } else newList.push(obj);
    }
    dataSheet.data.advantagesAndFlaws.talens = newList;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);

    const findTalen = dataSheet.data.advantagesAndFlaws.talens.filter((flaw: any) => flaw.name === name);
    const newPersist = findTalen
      .map((flaw: any) => `"${flaw.type} (${flaw.value})"`)
      .join(', ')
      .replace(/, ([^,]+)$/, ' e $1');

    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o Talismã ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${findTls.length === 0 ? "''" : dataPersist} para ${findTalen.length === 0 ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
  }

  const verifySelected = () => {
    return item.cost.find((adv: any) => {
      return dataSheet.data.advantagesAndFlaws.talens.find((item2: any) => item2.name === item.titlePtBr && item2.type === adv.type && item2.value === adv.value)
    });
  }

  return (
    <div className={`${verifySelected() && !showTalisman ? 'bg-black border-2 border-red-500' : 'bg-gray-whats-dark border-2 border-white'} `}>
      <button
        type="button"
        onClick={ () => setShowTalisman(!showTalisman)}
        className="capitalize p-4 font-bold flex w-full justify-between items-center "
      >
        <p className="text-base sm:text-lg w-full text-left">{ item.titlePtBr }</p>
        { showTalisman
          ? <IoIosArrowUp  />
          : <IoIosArrowDown />
        }
      </button>
      {
        showTalisman &&
        <div className="px-4 pb-4 bg-gray-whats">
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
              className={`${dataSheet.data.advantagesAndFlaws.talens.find((item2: any) => item2.name === item.titlePtBr && item2.type === adv.type && item2.value === adv.value) ? 'bg-black border-red-500' : 'border-white '} mt-3 pt-3 border-2 p-4 cursor-pointer`}
            >
              <p>Custo do { adv.type } - { adv.value }</p>
            </div>
          ))
        }
        </div>
      }
    </div>
  );
}