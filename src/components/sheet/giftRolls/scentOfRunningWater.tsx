import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { reduceFdv } from "../functionGifts";
import { sendMessage } from "@/firebase/chatbot";

export default function ScentOfRunningWater() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(3);
  const [reflex, setReflexa] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDiceCatFeet = async () => {
    if (reflex) {
      const willpower = await reduceFdv(slice.showPopupGiftRoll.gift.session, false);
      if (willpower) {
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
        await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.showPopupGiftRoll.gift.session);
      }
    } else {
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
          onClick={ rollDiceCatFeet }
          disabled={reflex && dificulty === 0}
          className={`text-white ${dificulty === 0 ? 'bg-gray-600' : 'bg-green-whats'} hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}