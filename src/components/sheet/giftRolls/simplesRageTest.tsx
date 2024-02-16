import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { verifyRage } from "../functionGifts";
import { sendMessage } from "@/firebase/chatbot";
import { returnRageCheck } from "@/firebase/checks";

export default function SimplesRageTest() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    const rage = await verifyRage(slice.showPopupGiftRoll.gift.session);
    if (rage) {
      await returnRageCheck(1, 'manual', slice.showPopupGiftRoll.gift.session);
      try {
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
      } catch (error) {
        window.alert('Erro ao obter valor da Forma: ' + error);
      }
    } else {
      await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.showPopupGiftRoll.gift.session);
    }
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