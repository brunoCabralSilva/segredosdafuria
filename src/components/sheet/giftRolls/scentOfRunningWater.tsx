import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { rollWillPower } from "../functionGifts";
import { sendMessage } from "@/firebase/chatbot";

export default function ScentOfRunningWater() {
  const [reflex, setReflexa] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    if (reflex) await rollWillPower(slice);
    else {
      await sendMessage({
        roll: 'false',
        gift: slice.showPopupGiftRoll.gift.data.gift,
        giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
        cost: slice.showPopupGiftRoll.gift.data.cost,
        action: slice.showPopupGiftRoll.gift.data.action,
        duration: slice.showPopupGiftRoll.gift.data.duration,
        pool: 'Nenhuma',
        system: slice.showPopupGiftRoll.gift.data.systemPtBr,
      }, slice.sessionId, slice.userData);
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
        />A ativação deste Dom é gratuita para o usuário, mas gastando um ponto de Força de Vontade o jogador pode estender os efeitos do Dom à parada de dados do seu personagem por uma cena. Marque se desejar estender os efeitos.
      </label>
      <div className="flex w-full gap-2"> 
        <button
          type="button"
          onClick={ rollDice }
          disabled={reflex}
          className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}