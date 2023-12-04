'use client'
import { registerMessage } from "@/firebase/chatbot";
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { serverTimestamp } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ManualRoll(props: { session: string }) {
  const { session } = props;
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

    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const { firstName, lastName, email, role }: IUser = jwtDecode(token);
        await registerMessage({
          message: {
            rollOfMargin: resultOf,
            rollOfRage: resultOfRage,
            dificulty,
            penaltyOrBonus,
            },
          user: firstName + ' ' + lastName,
          email: email,
          date: serverTimestamp(),
        }, session);
    }
    setValueOfRage(0);
    setValueOf(0);
    setPenaltyOrBonus(0);
    setDificulty(0);
    dispatch(actionShowMenuSession(''))
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-3">Dados de Fúria</p>
        <div className="grid grid-cols-5 gap-2 w-full bg-gray-400 p-1">
          <Image
            alt="Dado de 10 faces"
            src={`/images/dices/${valueOfRage >= 1 ? 'falha(rage).png' : 'falha.png'}`}
            width={500}
            height={500}
            onClick={ () => {
              if (valueOfRage === 1) setValueOfRage(0);
              else setValueOfRage(1);
            }}
            className="sm:w-14 cursor-pointer"
          />
          <Image
            alt="Dado de 10 faces"
            src={`/images/dices/${valueOfRage >= 2 ? 'falha(rage).png' : 'falha.png'}`}
            width={500}
            height={500}
            className="sm:w-14 cursor-pointer"
            onClick={ () => {
              if (valueOfRage === 2) setValueOfRage(1);
              else setValueOfRage(2);
            }}
          />
          <Image
            alt="Dado de 10 faces"
            src={`/images/dices/${valueOfRage >= 3 ? 'falha(rage).png' : 'falha.png'}`}
            width={500}
            height={500}
            className="sm:w-14 cursor-pointer"
            onClick={ () => {
              if (valueOfRage === 3) setValueOfRage(2);
              else setValueOfRage(3);
            }}
          />
          <Image
            alt="Dado de 10 faces"
            src={`/images/dices/${valueOfRage >= 4 ? 'falha(rage).png' : 'falha.png'}`}
            width={500}
            height={500}
            className="sm:w-14 cursor-pointer"
            onClick={ () => {
              if (valueOfRage === 4) setValueOfRage(3);
              else setValueOfRage(4);
            }}
          />
          <Image
            alt="Dado de 10 faces"
            src={`/images/dices/${valueOfRage === 5 ? 'falha(rage).png' : 'falha.png'}`}
            width={500}
            height={500}
            className="sm:w-14 cursor-pointer"
            onClick={ () => {
              if (valueOfRage === 5) setValueOfRage(4);
              else setValueOfRage(5);
            }}
          />
        </div>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dados Restantes</p>
        <div className="flex w-full">
          <div
            className={`w-10 border border-white p-3 cursor-pointer ${ valueOf === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (valueOf > 0) setValueOf(valueOf - 1);
            }}
          >
            <FaMinus />
          </div>
          <div
            id="valueOf"
            className="p-2 text-center bg-white text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 50)) setValueOf(50);
              else if (e.target.value >= 0) setValueOf(Number(e.target.value));
              else setValueOf(0);
            }}
          >
            {valueOf}
          </div>
          <div
            className={`w-10 border border-white p-3 cursor-pointer ${ valueOf === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (valueOf < 50) setValueOf(valueOf + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Penalidade (+) ou Bônus (-)</p>
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
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dificuldade</p>
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
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setDificulty(15);
              else if (e.target.value >= 0) setDificulty(Number(e.target.value));
              else setValueOf(0);
            }}
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
      <button
        className="text-white bg-black border-2 border-white hover:border-red-800 transition-colorscursor-pointer w-full p-2 mt-6 font-bold"
        onClick={registerRoll}
      >
        Rolar dados
      </button>
    </div>
  )
}