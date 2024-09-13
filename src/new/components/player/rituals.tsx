import contexto from "@/context/context";
import { useContext } from "react";
import { IoAdd } from "react-icons/io5";
import AddGift from "../popup/addGift";
import RitualsAdded from "./ritualsAdded";
import AddRitual from "../popup/addRitual";

export default function Rituals() {
  const { dataSheet, showRitualsToAdd, setShowRitualsToAdd } = useContext(contexto);
	return(
    <div className="flex flex-col w-full overflow-y-auto h-full mb-3">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold">
        <div className="w-full mb-2 flex items-center justify-between font-bold">
          <p className="w-full mt-5 mb-3">Rituals</p>
          <button
            type="button"
            className="p-1 border-2 border-white bg-white right-3"
            onClick={ () => setShowRitualsToAdd(true) }
          >
            <IoAdd className="text-black text-xl" />
          </button>
        </div>
        <div>
          {
            dataSheet.rituals.map((item: any, index: number) => (
              <RitualsAdded key={ index } ritual={ item } />
            ))
          }
        </div>
      { showRitualsToAdd && <AddRitual />}
      </div>
    </div>
	)
}


      