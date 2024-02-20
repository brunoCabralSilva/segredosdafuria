import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { reduceFdv } from "../functionGifts";
import { registerMessage, sendMessage } from "@/firebase/chatbot";
import { returnValue } from "@/firebase/checks";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";

export default function GraspfromBeyond(props: any) {
  const { textDificulty } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [fdv, setFdv] = useState(1);
  const [willpower, setWillpower] = useState(0);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getWillPower();
  }, []);

  const getWillPower = async () => {
    const db = getFirestore(firebaseConfig);
    const userQuery = query(collection(db, 'sessions'), where('name', '==', slice.showPopupGiftRoll.gift.session));
    const userQuerySnapshot = await getDocs(userQuery);
    const players: any = [];
    userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
    const player: any = players.find((gp: any) => gp.email === slice.userData.email);
    const valueWill = player.data.willpower.filter((will: any) => will.agravated === false);
    const valueWillAgravated = player.data.willpower.filter((will: any) => will.agravated === true);
    const totalDamageSuperficial = valueWill.length;
    const totalDamageAgravated = valueWillAgravated.length;
    const totalWillpower = player.data.attributes.resolve + player.data.attributes.composure;
    const restWillpower = totalWillpower - totalDamageSuperficial - totalDamageAgravated;
    setWillpower(restWillpower*2 + totalDamageSuperficial);
  };

  const rollDice = async () => {
    let allPointsUsed = true;
    for (let i = 1; i <= 3; i += 1) {
      const will = await reduceFdv(slice.sessionId, false, slice.userData);
      if (will) allPointsUsed = true;
      else (allPointsUsed = false);
    }
    if (allPointsUsed) {
      const dtSheet: any | null = await returnValue('resolve', '', 'wisdom', slice.sessionId, slice.userData.email);
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
      await sendMessage('Não foi possível conjurar o dom (Não possui Força de Vontade suficiente para a ação requisitada).', slice.sessionId, slice.userData);
    }
    dispatch(actionShowMenuSession(''));
    dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
  }
  return(
    <div className="w-full">
      <div className="w-full">
        <label htmlFor="fdv" className="px-4 mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Pontos de Força de Vontade que serão gastos (O custo de Força de Vontade depende do tamanho do objeto, com um item pequeno - como um livro ou laptop - requerendo um único ponto e um grande - como um carro ou tenda - requerendo três.)</p>
          <div className="flex w-full">
            <div
              className={`border border-white p-3 cursor-pointer ${ fdv === 1 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (fdv > 1) setFdv(fdv - 1)
              }}
            >
              <FaMinus />
            </div>
            <div
              id="fdv"
              className="p-2 text-center text-black bg-white w-full appearance-none"
            >
              {fdv}
            </div>
            <div
              className={`border border-white p-3 cursor-pointer ${ fdv === willpower || fdv == 3 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
              onClick={ () => {
                if (fdv < willpower && fdv < 3) setFdv(fdv + 1)
              }}
            >
              <FaPlus />
            </div>
          </div>
        </label>
        <label htmlFor="penaltyOrBonus" className="pt-4 px-4 mb-4 flex flex-col items-center w-full">
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
          <p className="text-white w-full pb-3">{ textDificulty ? textDificulty : 'Dificuldade' }</p>
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
      </div>
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