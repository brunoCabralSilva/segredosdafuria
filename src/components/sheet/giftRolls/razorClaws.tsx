import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { verifyRage } from "../functionGifts";
import { sendMessage } from "@/firebase/chatbot";
import { returnRageCheck } from "@/firebase/checks";

export default function RazorClaws() {
  const [reflex, setReflexa] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    if (reflex) {
      await sendMessage({
        roll: 'false',
        gift: slice.showPopupGiftRoll.gift.data.gift,
        giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
        cost: slice.showPopupGiftRoll.gift.data.cost,
        action: slice.showPopupGiftRoll.gift.data.action,
        duration: slice.showPopupGiftRoll.gift.data.duration,
        pool: 'Nenhuma',
        system: slice.showPopupGiftRoll.gift.data.systemPtBr,
      }, slice.showPopupGiftRoll.gift.session);
    } else {
        const rage = await verifyRage(slice.showPopupGiftRoll.gift.session);
        if (rage) {
          await returnRageCheck(1, 'manual', slice.showPopupGiftRoll.gift.session);
          await sendMessage({
            roll: 'false',
            gift: slice.showPopupGiftRoll.gift.data.gift,
            giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
            cost: slice.showPopupGiftRoll.gift.data.cost,
            action: slice.showPopupGiftRoll.gift.data.action,
            duration: slice.showPopupGiftRoll.gift.data.duration,
            pool: 'Nenhuma',
            system: slice.showPopupGiftRoll.gift.data.systemPtBr,
          }, slice.showPopupGiftRoll.gift.session);
        } else {
          await sendMessage('Não foi possível conjurar o dom (Não possui Fúria suficiente para a ação requisitada).', slice.showPopupGiftRoll.gift.session);
        }
      }
    dispatch(actionShowMenuSession(''));
    dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
  }
  return(
    <div className="w-full">
      <label
        htmlFor="checkboxReflexive"
        className="pb-5 px-5 w-full text-white flex items-start">
        <input
          type="checkbox"
          id="checkboxReflexive"
          className="mr-2 mt-1"
          checked={reflex}
          onChange={ (e: any) => setReflexa(e.target.checked) }
        />Marque se estiver na forma Crinos.
      </label>
      <div className="flex w-full gap-2"> 
        <button
          type="button"
          onClick={ rollDice }
          className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}