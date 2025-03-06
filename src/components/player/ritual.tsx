import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Ritual(props: { ritual: any, index: number, length: number }) {
  const [showRitual, setShowRitual] = useState(false);
  const { ritual, index, length } = props;
  const { dataSheet, sheetId, setShowMessage } = useContext(contexto);
  const registerRitual = async () => {
    if (dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr))
      dataSheet.data.rituals = dataSheet.data.rituals.filter((item: any) => item.titlePtBr !== ritual.titlePtBr)
    else dataSheet.data.rituals.push(ritual);
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
  }

  return(
    <div className={`${dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr) ? 'bg-black border-red-500': 'bg-gray-whats-dark border-white'} border-2 ${ index === length - 1 ? '' : 'mb-3'} font-normal`}>
      <button
        type="button"
        onClick={ () => setShowRitual(!showRitual) }
        className={`w-full flex items-start justify-between px-4 pt-4 ${!showRitual && 'pb-4'}`}
      >
        <div className="capitalize text-base sm:text-lg font-bold flex flex-col w-full text-left">
          <span>
            { ritual.titlePtBr } - { ritual.type }
          </span>
        </div>
        <div>
          { 
            showRitual
            ? <IoIosArrowUp className="text-xl"  />
            : <IoIosArrowDown className="text-xl" />
          }
        </div>
      </button>
      {
        showRitual &&
        <div className="px-4 pb-4">
          <span className="text-lg">({ ritual.title }) </span>
          <div className="pt-2">
            <span className="pr-1 font-bold">Teste:</span>
            { ritual.pool }
          </div>
          <div className="pt-2">
            <span className="pr-1 font-bold">Descrição:</span>
            { ritual.descriptionPtBr }
          </div>
          <div className="pt-2">
            <span className="pr-1 font-bold">Sistema:</span>
            { ritual.systemPtBr }
          </div>
          <button
            type="button"
            className="mt-4 px-2 p-1 border-2 border-white bg-white hover:bg-black hover:border-red-500 hover:text-white transition-colors duration-500 right-3 text-black font-bold"
            onClick={ () => { registerRitual()}}
            >
            {
              dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr)
              ? 'Remover'
              : 'Adicionar'
            }
          </button>
        </div>
      }
    </div>
  );
}