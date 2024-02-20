import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { rollDiceWithRage } from "../functionGifts";

export default function AutoRollWithRage(props: any) {
  const { attribute, renown, skill, dificulty: dificultyTest, textDificulty } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(dificultyTest);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
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
          onClick={ () => 
            rollDiceWithRage(
              slice,
              dispatch,
              dificulty,
              attribute,
              skill,
              renown,
              slice.userData,
              penaltyOrBonus,
            )
          }
          disabled={dificulty === 0}
          className={`text-white ${dificulty === 0 ? 'bg-gray-600' : 'bg-green-whats'} hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold mx-4`}
        >
          Utilizar Dom
        </button>
      </div>
    </div>
  )
}