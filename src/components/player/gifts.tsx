import contexto from "@/context/context";
import { useContext } from "react";
import { IoAdd } from "react-icons/io5";
import AddGift from "../popup/addGift";
import GiftsAdded from "./giftsAdded";

export default function Gifts() {
  const { dataSheet, showGiftsToAdd, setShowGiftsToAdd, setShowMessage } = useContext(contexto);
	return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold">
        <div className="w-full mb-2 flex items-center justify-between font-bold">
        <p className="w-full mt-5 mb-3">Dons</p>
          <button
            type="button"
            className="p-1 border-2 border-white bg-white right-3"
            onClick={ () => {
              const totalRenown = Number(dataSheet.data.glory) + Number(dataSheet.data.wisdom) + Number(dataSheet.data.honor);
              if (dataSheet.data.trybe !== '' && dataSheet.data.auspice !== '' && totalRenown >= 3) {
                setShowGiftsToAdd(true);
              } else {
                setShowMessage({ show: true, text: 'Antes de adicionar um dom, é necessário preencher uma Tribo, um Augúrio e pelo menos três pontos em Renomes' });
              }
            }}
          >
            <IoAdd className="text-black text-xl" />
          </button>
        </div>
      <div className="pb-5">
        {
          dataSheet.data.gifts.map((item: any, index: number) => (
            <GiftsAdded key={ index } gift={ item } />
          ))
        }
      </div>
      { showGiftsToAdd && <AddGift />}
		  </div>
    </div>
	)
}