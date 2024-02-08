import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { verifyRage } from "../functionGifts";
import { registerMessage, sendMessage } from "@/firebase/chatbot";
import { authenticate } from "@/firebase/login";
import { returnRageCheck, returnValue } from "@/firebase/checks";

export default function AutoRollWithRage(props: any) {
  const { attribute, renown, skill, dificulty: dificultyTest, textDificulty } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(dificultyTest);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    const rage = await verifyRage(slice.showPopupGiftRoll.gift.session);
    if (rage) {
      await returnRageCheck(1, 'manual', slice.showPopupGiftRoll.gift.session);
      const dtSheet: any | null = await returnValue(attribute, skill, renown, slice.showPopupGiftRoll.gift.session);
      if (dtSheet) {
        let rage = dtSheet.rage;
        let resultOfRage = [];
        let resultOf = [];
        let dices = dtSheet.attribute + dtSheet.renown + dtSheet.skill + Number(penaltyOrBonus);
        if (dices > 0) {
          if (dices - dtSheet.rage === 0) dices = 0;
          else if (dices - dtSheet.rage > 0) dices = dices - dtSheet.rage;
          else {
            rage = dices;
            dices = 0;
          };
    
          for (let i = 0; i < rage; i += 1) {
            const value = Math.floor(Math.random() * 10) + 1;
            resultOfRage.push(value);
          }
      
          for (let i = 0; i < dices; i += 1) {
            const value = Math.floor(Math.random() * 10) + 1;
            resultOf.push(value);
          }
        }
        const authData: { email: string, name: string } | null = await authenticate();

        try {
          if (authData && authData.email && authData.name) {
            const { email, name } = authData;
            if (dices + rage >= dificulty) {
              await registerMessage({
                message: {
                  rollOfMargin: resultOf,
                  rollOfRage: resultOfRage,
                  dificulty,
                  penaltyOrBonus,
                  roll: 'true',
                  gift: slice.showPopupGiftRoll.gift.data.gift,
                  giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
                  cost: slice.showPopupGiftRoll.gift.data.cost,
                  action: slice.showPopupGiftRoll.gift.data.action,
                  duration: slice.showPopupGiftRoll.gift.data.duration,
                  pool: slice.showPopupGiftRoll.gift.data.pool,
                  system: slice.showPopupGiftRoll.gift.data.systemPtBr,
              },
                user: name,
                email: email,
              }, slice.showPopupGiftRoll.gift.session);
            } else {
              await registerMessage({
                message: {
                  rollOfMargin: resultOf,
                  rollOfRage: resultOfRage,
                  dificulty,
                  roll: 'true',
                  penaltyOrBonus,
                  gift: slice.showPopupGiftRoll.gift.data.gift,
                  giftPtBr: slice.showPopupGiftRoll.gift.data.giftPtBr,
                  cost: slice.showPopupGiftRoll.gift.data.cost,
                  action: slice.showPopupGiftRoll.gift.data.action,
                  duration: slice.showPopupGiftRoll.gift.data.duration,
                  pool: slice.showPopupGiftRoll.gift.data.pool,
                  system: slice.showPopupGiftRoll.gift.data.systemPtBr,
                },
                user: name,
                email: email,
              }, slice.showPopupGiftRoll.gift.session);
            }
          }
        } catch (error) {
        window.alert('Erro ao obter valor da Forma: ' + error);
        }
      }
    } else {
      await sendMessage('Não foi possível conjurar o dom (Não possui Fúria suficiente para a ação requisitada).', slice.showPopupGiftRoll.gift.session);
    }
    dispatch(actionShowMenuSession(''));
    dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
  }
  return(
    <div className="w-full">
      <label htmlFor="penaltyOrBonus" className="px-4 mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Penalidade (-) ou Bônus (+)</p>
        <div className="flex w-full">
          <div
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </div>
          <div
            id="penaltyOrBonus"
            className="p-2 text-center text-black bg-white w-full appearance-none"
          >
            {penaltyOrBonus}
          </div>
          <div
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label htmlFor="dificulty" className="px-4 mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3 text-justify">{ textDificulty ? textDificulty : 'Dificuldade' }</p>
        <div className="flex w-full">
          <div
            className={`border border-white p-3 cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </div>
          <div
            id="dificulty"
            className="p-2 bg-white text-center text-black w-full"
          >
            {dificulty}
          </div>
          <div
            className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <div className="flex w-full gap-2"> 
        <button
          type="button"
          onClick={ rollDice }
          disabled={dificulty === 0}
          className={`text-white ${dificulty === 0 ? 'bg-gray-600' : 'bg-green-whats'} hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}