'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import dataSheet from '../../data/sheet.json';
import { registerRoll, returnRageCheck } from "@/firebase/checks";

export default function AutomatedRoll(props: { session: string }) {
  const { session } = props;
  const [atrSelected, setAtrSelected] = useState<string>('');
  const [sklSelected, setSklSelected] = useState<string>('');
  const [renSelected, setRenSelected] = useState<string>('');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
  const dispatch = useAppDispatch();

  const disabledButton = () => {
    return (atrSelected === '' && renSelected === '' && sklSelected === '') || dificulty <= 0;
  }

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueOf" className="mb-4 flex items-center w-full gap-2">
        <button
          className="bg-white p-3 w-full py-3 cursor-pointer capitalize text-center text-black hover:font-bold"
          onClick={ () => {
            returnRageCheck(1, 'manual', session);
            dispatch(actionShowMenuSession(''))
          }}
        >
          Realizar 1 Teste de Fúria
        </button>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Atributo</p>
          <select
            onClick={(e: any) => setAtrSelected(e.target.value)}
            className="w-full py-3 text-black capitalize cursor-pointer"
          >
            <option
              className="capitalize text-center text-black"
              disabled selected
              value=""
            >
              Escolha um atributo
            </option>
            {
              dataSheet.attributes
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr }
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Habilidade</p>
          <select
            onClick={(e: any) => setSklSelected(e.target.value)}
            className="w-full py-3 capitalize cursor-pointer text-black"
          > 
            <option
              className="capitalize text-center text-black"
              disabled selected
              value=""
            >
              Escolha uma Habilidade
            </option>
            <option
              className="text-black capitalize text-center"
              value=""
            >
              Nenhuma
            </option>
            {
              dataSheet.skills
                .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                .map((item, index) => (
                  <option
                    className="text-black capitalize text-center"
                    key={index}
                    value={item.value}
                  >
                    { item.namePtBr }
                  </option>
                ))
            }
          </select>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Renome</p>
          <select
            onClick={(e: any) => setRenSelected(e.target.value)}
            className="w-full py-3 capitalize cursor-pointer text-black"
          >
            <option
              className="capitalize text-center text-black"
              disabled selected
              value=""
            >
              Escolha um Renome
            </option>
            <option
              className="capitalize text-center text-black"
              value=""
            >
              Nenhum
            </option>
            {
              dataSheet.renown
                .map((item, index) => (
                <option
                  className="capitalize text-center text-black"
                  key={index}
                  value={item.value}
                >
                  { item.namePtBr }
                </option>
              ))
            }
          </select>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Bônus (+) ou Penalidade (-)</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === -50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus > -50) setPenaltyOrBonus(penaltyOrBonus - 1)
            }}
          >
            <FaMinus />
          </button>
          <div
            className="p-2 text-center text-black w-full bg-white"
          >
            <span className="w-full">{ penaltyOrBonus }</span>
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ penaltyOrBonus === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (penaltyOrBonus < 50) setPenaltyOrBonus(penaltyOrBonus + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dificuldade</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 0) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            className="p-2 text-center text-black w-full bg-white"
          >
            <span className="w-full">{ dificulty }</span>
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ dificulty === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty < 15) setDificulty(dificulty + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <button
        className={`${disabledButton() ? 'text-black bg-gray-400 hover:bg-gray-600 hover:text-white transition-colors': 'text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
        disabled={disabledButton()}
        onClick={() => {
          registerRoll(
            dificulty,
            penaltyOrBonus,
            atrSelected,
            sklSelected,
            renSelected,
            session
          );
          dispatch(actionShowMenuSession(''));
        }
        }
      >
        Rolar dados
      </button>
    </div>
  )
}