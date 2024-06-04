import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionForm, actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerMessage } from "@/firebase/chatbot";
import { authenticate } from "@/firebase/new/authenticate";
import { returnRageCheck, returnValue } from "@/firebase/checks";
import FormsGift from "../formsGift";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { useRouter } from "next/navigation";

export default function RapidShift() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const updateValue = async () => {
    const db = getFirestore(firebaseConfig);
    const authData: any = await authenticate();
    try {
      if (authData && authData.email && authData.displayName) {
      const { email, displayName: name } = authData;
        if (slice.form === 'Hominídeo' || slice.form === 'Lupino') {
          await registerMessage({
            message: `Mudou para a forma ${slice.form}.`,
            user: name,
            email: email,
          }, slice.showPopupGiftRoll.gift.session);
        }
        if (slice.form === 'Crinos') await returnRageCheck(2, slice.form, slice.sessionId, slice.userData);
        if (slice.form === 'Glabro' || slice.form === 'Hispo') await returnRageCheck(1, slice.form, slice.sessionId, slice.userData);
        const userQuery = query(collection(db, 'sessions'), where('name', '==', slice.showPopupGiftRoll.gift.session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        if (player.data.form === "Crinos") {
          if (player.data.rage > 0) {
            player.data.rage = 1;
            await registerMessage({
              message: 'Fúria reduzida para 1 por ter saído da forma Crinos.',
              user: name,
              email: email,
            }, slice.showPopupGiftRoll.gift.session );
          }
        }
        dispatch(actionShowMenuSession(''))
        player.data.form = slice.form;
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
        dispatch(actionForm(slice.form));
      } else router.push('/login');
    } catch (error) {
      window.alert('Erro ao atualizar Forma (' + error + ')');
    }
  };
  
  const rollDice = async () => {
    updateValue();
    const dtSheet: any | null = await returnValue('dexterity', '', 'glory', slice.sessionId, slice.userData.email);
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
      dispatch(actionShowMenuSession(''));
      dispatch(actionPopupGiftRoll({ show: false, gift: { session: '', data: '' }}));
    }
  }
  return(
    <div className="w-full">
      <p className="text-white px-5">Escolha uma Forma</p>
      <div className="pb-5 px-5 w-full text-white flex items-start">
        <FormsGift session={slice.showPopupGiftRoll.gift.session} />
      </div>
      <div className="w-full px-5">
        <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
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
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3 text-justify">Dificuldade (1 para Hominídeo e Lupino, 2 para Glabro e Hispo e 3 para Crinos)</p>
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
          disabled={ dificulty === 0}
          className={`text-white ${dificulty === 0 ? 'bg-gray-600' : 'bg-green-whats'} hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}