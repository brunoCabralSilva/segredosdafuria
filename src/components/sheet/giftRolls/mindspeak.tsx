import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, actionShowMenuSession, useSlice } from "@/redux/slice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { rollDiceWithWillpower, rollWillPower } from "../functionGifts";

export default function Mindspeak() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [reflex, setReflexa] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  const rollDice = async () => {
    if (reflex) {
      await rollDiceWithWillpower(
        slice,
        dispatch,
        dificulty,
        'resolve',
        '',
        'wisdom',
        slice.userData,
        penaltyOrBonus,
      );
    } else await rollWillPower(slice);
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
        />
        <span>Marque se o alvo não é conhecido e está na linha de visão (Não é possível fazer contato com algos que não são conhecidos de outra forma além desta), ou se é conhecido, mas não está presente.</span>
      </label>
      { reflex &&
        <div className="w-full">
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
            <p className="text-white w-full pb-3 text-justify">Dificuldade (A dificuldade deve ser o número de sucessos obtidos pelo alvo em um teste de Autocontrole + Determinação, ou um valor imposto pelo Narrador).</p>
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
      }
      <div className="flex w-full gap-2"> 
        <button
          type="button"
          onClick={ rollDice }
          disabled={reflex && dificulty === 0}
          className={`text-white ${dificulty === 0 ? 'bg-gray-600' : 'bg-green-whats'} hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}