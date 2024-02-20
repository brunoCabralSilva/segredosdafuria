import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { rollRage } from "../functionGifts";

export default function SimplesRageTest() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    await rollRage(slice);
    dispatch(actionShowMenuSession(''));
    dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
  }
  return(
    <div className="w-full">
      <div className="flex w-full gap-2"> 
        <button
          type="button"
          onClick={ rollDice }
          className="text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4"
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}