'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch } from "@/redux/hooks";
import { actionRollDice } from "@/redux/slice";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function PopUpDices() {
  const [valueOfRage, setValueOfRage] = useState<number>(0);
  const [valueOf, setValueOf] = useState<number>(0);
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
  const dispatch = useAppDispatch();

  interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }

  const registerRoll = async () => {
    let resultOfRage = [];
    let resultOf = [];
    let valueWithPenaltyOfBonus = Number(penaltyOrBonus) + Number(valueOf);
    let totalOfRage = valueOfRage;
    if (valueWithPenaltyOfBonus < 0) {
      totalOfRage = Number(valueOfRage) + valueWithPenaltyOfBonus;
      valueWithPenaltyOfBonus = 0;
    }

    for (let i = 0; i < Number(totalOfRage); i += 1) {
      const value = Math.floor(Math.random() * 10) + 1;
      resultOfRage.push(value);
    }

    for (let i = 0; i < Number(valueWithPenaltyOfBonus); i += 1) {
      const value = Math.floor(Math.random() * 10) + 1;
      resultOf.push(value);
    }

    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const { firstName, lastName, email, role }: IUser = jwtDecode(token);
      await addDoc(
        messagesRef,
        {
          message: {
            rollOfMargin: resultOf,
            rollOfRage: resultOfRage,
            dificulty,
            penaltyOrBonus,
           },
          user: firstName + ' ' + lastName,
          email: email,
          date: serverTimestamp(),
        }
      );
    }
    dispatch(actionRollDice(false));
  };

  const disabledButton = () => {
    return (valueOfRage == 0 && valueOf == 0) || dificulty <= 0;
  }

  return(
    <div className="fixed w-full h-screen bg-black/80 z-50 flex items-center justify-center">
      <div className="w-8/10 relative p-10 bg-black flex flex-col items-center justify-center">
          <IoIosCloseCircleOutline
            className="absolute top-0 right-0 text-4xl text-white mr-2 mt-2 cursor-pointer"
            onClick={() => dispatch(actionRollDice(false))}
          />
        <label htmlFor="valueofRage" className="mb-4 flex flex-col items-center">
          <p className="text-white w-full text-center">Dados de Fúria</p>
          <input
            type="number"
            id="valueOfRage"
            className="p-2 text-center text-black w-full"
            value={valueOfRage}
            onChange={ (e: any) => {
              if (e.target.value >= 0) setValueOfRage(e.target.value);
              else setValueOfRage(0);
            }}
          />
        </label>
        <label htmlFor="valueof" className="mb-4 flex flex-col items-center">
          <p className="text-white w-full text-center">Parada de Dados Restante</p>
          <input
            type="number"
            id="valueOf"
            className="p-2 text-center text-black w-full"
            value={valueOf}
            onChange={ (e: any) => {
              if (e.target.value >= 0) setValueOf(e.target.value);
              else setValueOf(0);
            }}
          />
        </label>
        <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center">
          <p className="text-white w-full text-center">Penalidade ou bônus caso possua</p>
          <input
            type="number"
            id="penaltyOrBonus"
            className="p-2 text-center text-black w-full"
            value={penaltyOrBonus}
            onChange={ (e: any) => setPenaltyOrBonus(e.target.value) }
          />
        </label>
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center">
          <p className="text-white w-full text-center">Qual a dificuldade?</p>
          <input
            type="number"
            id="dificulty"
            className="p-2 text-center text-black w-full"
            value={dificulty}
            onChange={ (e: any) => {
              if (e.target.value >= 0) setDificulty(e.target.value);
              else setDificulty(0);
            }}
          />
        </label>
        <button
          className={`${disabledButton() ? 'text-black bg-gray-400 hover:bg-gray-600 hover:text-white transition-colors': 'text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
          disabled={disabledButton()}
          onClick={registerRoll}
        >
            Rolar dados
          </button>
      </div>
    </div>
  )
}