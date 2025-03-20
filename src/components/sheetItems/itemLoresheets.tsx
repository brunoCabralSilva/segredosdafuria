import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ItemLoresheet(props: { item: any }) {
  const { item } = props;
  const [showLoresheet, setShowLoresheet] = useState(false);
  const { dataSheet, sheetId, session, email, setShowMessage } = useContext(contexto);

  const updateLoresheet = async(
    name: string,
    description: string,
    cost: number,
    skill: string,
  )  => {
    const obj = { name, cost, description, skill };
    let newList = dataSheet.data.advantagesAndFlaws.loresheets;
    const findLoresheet = dataSheet.data.advantagesAndFlaws.loresheets.filter((flaw: any) => flaw.name === name);
    const dataPersist = findLoresheet
      .map((flaw: any) => {
        let label = flaw.skill.split(':')[0].trim();
        return `"${label} (${flaw.cost})"`;
      })
      .join(', ')
      .replace(/, ([^,]+)$/, ' e $1');

    const equal = newList.find((item: any) => item.skill === skill);
    const different = newList.find((item: any) => item.name !== name);
    if (equal) newList = newList.filter((item: any) => item.skill !== skill);
    else if (different) {
      newList = newList.filter((item: any) => item.name === name);
      newList.push(obj);
    } else newList.push(obj);
    dataSheet.data.advantagesAndFlaws.loresheets = newList;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);

    const findLrsheet = dataSheet.data.advantagesAndFlaws.loresheets.filter((flaw: any) => flaw.name === name);
    const newPersist = findLrsheet
      .map((flaw: any) => {
        let label = flaw.skill.split(':')[0].trim();
        return `"${label} (${flaw.cost})"`;
      })
      .join(', ')
      .replace(/, ([^,]+)$/, ' e $1');

    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Loresheet ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${findLoresheet.length === 0 ? "''" : dataPersist} para ${findLrsheet.length === 0 ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
  }

  const verifySelected = () => {
    return item.habilities.find((adv: any) => {
      return dataSheet.data.advantagesAndFlaws.loresheets.find((item2: any) => item2.skill === adv.skillPtBr)
    });
  }

  return(
    <div className={`${verifySelected() && !showLoresheet ? 'bg-black border-2 border-red-500' : 'bg-gray-whats-dark border-2 border-white'}`}>
      <button
        type="button"
        onClick={ () => setShowLoresheet(!showLoresheet)}
        className="capitalize p-4 font-bold flex w-full justify-between items-center "
      >
        <p className="text-base sm:text-lg w-full text-left">{ item.titlePtBr }</p>
        { showLoresheet
          ? <IoIosArrowUp  />
          : <IoIosArrowDown />
        }
      </button>
      {
        showLoresheet &&
        <div>
          <p className="px-4 pb-4">{ item.descriptionPtBr }</p>
          <div className="px-4">
          {
            item.habilities.map((adv: any, index2: number) => (
              <div
                key={index2}
                onClick={() => {
                  updateLoresheet(item.titlePtBr, item.descriptionPtBr, adv.cost, adv.skillPtBr) 
                }}
                className={`${dataSheet.data.advantagesAndFlaws.loresheets.find((item2: any) => item2.skill === adv.skillPtBr) ? 'bg-black border-2 border-red-500' : 'border-2 border-white'} mb-3 pt-3  p-4 cursor-pointer`}
              >
                <p>Custo { adv.cost } - { adv.skillPtBr }</p>
              </div>
            ))
          }
          </div>
        </div>
      }
    </div>
  );
}