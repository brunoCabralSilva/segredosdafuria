import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerMessage, sendMessage } from "@/firebase/chatbot";
import { returnRageCheck, returnValue } from "@/firebase/checks";
import { getUserByIdSession } from "@/firebase/sessions";

export default function SpiritOfTheFray(props: any) {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [glory, setGlory] = useState(0);
  const [rage, setRage] = useState(0);
  const [rageTests, setRageTests] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getGlory();
  }, []);
  
  const getGlory = async () => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setGlory(player.data.glory);
      setRage(player.data.rage);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const rollDice = async () => {
    if (rage) {
      await returnRageCheck(rageTests + 1, 'manual', slice.sessionId, slice.userData);
      const dtSheet: any | null = await returnValue('strength', 'brawl', '', slice.sessionId, slice.userData.email);
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
          user: slice.userData.name,
          email: slice.userData.email,
        }, slice.sessionId);
      }
    } else {
      await sendMessage('Não foi possível conjurar o dom (Não possui Fúria suficiente para a ação requisitada).', slice.sessionId, slice.userData);
    }
    dispatch(actionShowMenuSession(''));
    dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
  }
  return(
    <div className="w-full">
      <label htmlFor="penaltyOrBonus" className="px-4 mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3 text-justify">Quantidade de Testes de Fúria adicionais (Cada Teste de Fúria incrementa um oponente adicional ao ataque, Limitado ao valor total de Glória e o valor disponível de Fúria, o menor entre ambos).</p>
        <div className="flex w-full">
          <div
            className={`border border-white p-3 cursor-pointer ${ rageTests === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (rageTests > 0) setRageTests(rageTests - 1)
            }}
          >
            <FaMinus />
          </div>
          <div
            id="penaltyOrBonus"
            className="p-2 text-center text-black bg-white w-full appearance-none"
          >
            {rageTests}
          </div>
          <div
            className={`border border-white p-3 cursor-pointer ${ rageTests === glory || rageTests === rage - 1 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (rageTests < glory && rageTests < rage - 1) setRageTests(rageTests + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
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
            onChange={(e: any) => {
              if (Number(e.target.value) < 0 && Number(e.target.value) < -50) setPenaltyOrBonus(-50);
              else setPenaltyOrBonus(Number(e.target.value))
            }}
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
        <p className="text-white w-full pb-3">Dificuldade do ataque que será aplicado em todos os alvos</p>
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