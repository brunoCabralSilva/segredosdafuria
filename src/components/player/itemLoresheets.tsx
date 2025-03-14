import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function ItemLoresheet(props: { item: any }) {
  const { item } = props;
  const [showLoresheet, setShowLoresheet] = useState(false);
  const { dataSheet, sheetId, setShowMessage } = useContext(contexto);

  const updateLoresheet = async(
    name: string,
    description: string,
    cost: number,
    skill: string,
  )  => {
    const obj = { name, cost, description, skill };
    let newList = dataSheet.data.advantagesAndFlaws.loresheets;
    const equal = newList.find((item: any) => item.skill === skill);
    const different = newList.find((item: any) => item.name !== name);
    if (equal) newList = newList.filter((item: any) => item.skill !== skill);
    else if (different) {
      newList = newList.filter((item: any) => item.name === name);
      newList.push(obj);
    } else newList.push(obj);
    dataSheet.data.advantagesAndFlaws.loresheets = newList;
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
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