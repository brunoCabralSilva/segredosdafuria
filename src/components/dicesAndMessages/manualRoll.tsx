import contexto from "@/context/context";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerManualRoll } from "@/firebase/messagesAndRolls";

export default function ManualRoll() {
	const [valueOfRage, setValueOfRage] = useState<number>(0);
  const [valueOf, setValueOf] = useState<number>(0);
  const [totalDices, setTotalDices] = useState<number>(1);
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(0);
	const { setShowMenuSession, sessionId, setShowMessage } = useContext(contexto);

	const disableRoll = () => {
    return (dificulty <= 0) || (valueOfRage <= 0 &&  valueOf <= 0 && penaltyOrBonus === 0)
  }

	const rollDices = async () => {
    
    await registerManualRoll(sessionId, valueOfRage, (totalDices - valueOfRage), penaltyOrBonus, dificulty, setShowMessage);
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      {/* <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1">Dados de Fúria</p>
        <p className="text-white w-full pb-3">(Dados pretos definem o total de dados de Fúria)</p>
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
      </label> */}
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Quantidade de Dados Totais:</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`w-10 border border-white p-3 cursor-pointer ${ totalDices === 1 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (totalDices > 1) {
                setTotalDices(totalDices - 1);
                if (totalDices - 1 < valueOfRage)
                  setValueOfRage(totalDices - 1);
              }
            }}
          >
            <FaMinus />
          </button>
          <div
            id="totalDices"
            className="p-2 text-center bg-white text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 50)) setTotalDices(50);
              else if (e.target.value >= 0) setTotalDices(Number(e.target.value));
              else setTotalDices(0);
            }}
          >
            {totalDices}
          </div>
          <button
            type="button"
            className={`w-10 border border-white p-3 cursor-pointer ${ totalDices === 50 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (totalDices < 50) {
                setTotalDices(totalDices + 1);
                if (totalDices + 1 < valueOfRage)
                  setValueOfRage(totalDices + 1);
              }
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Dentre estes, quantos são de Fúria?</p>
        <div className="flex w-full">
          <button
            type="button"
            className={`w-10 border border-white p-3 cursor-pointer ${ valueOfRage === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (valueOfRage > 0) setValueOfRage(valueOfRage - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="valueOfRage"
            className="p-2 text-center bg-white text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 50)) setValueOfRage(50);
              else if (e.target.value >= 0) setValueOfRage(Number(e.target.value));
              else setValueOfRage(0);
            }}
          >
            {valueOfRage}
          </div>
          <button
            type="button"
            className={`w-10 border border-white p-3 cursor-pointer ${ (valueOfRage === 5 || valueOfRage === totalDices) ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (valueOfRage < 5 && valueOfRage < totalDices) setValueOfRage(valueOfRage + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Penalidade (-) ou Bônus (+) para o teste</p>
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
            id="penaltyOrBonus"
            className="p-2 text-center text-black bg-white w-full appearance-none"
            onChange={(e: any) => {
              if (Number(e.target.value) < 0 && Number(e.target.value) < -50) setPenaltyOrBonus(-50);
              else setPenaltyOrBonus(Number(e.target.value))
            }}
          >
            {penaltyOrBonus}
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
        <p className="text-white w-full pb-3">Dificuldade do Teste</p>
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
        className={`${disableRoll() ? 'text-black bg-gray-400' : 'text-white bg-black hover:border-red-800' } border-2 border-white  transition-colors cursor-pointer w-full p-2 mt-6 font-bold`}
        onClick={ rollDices }
        disabled={ disableRoll() }
      >
        Rolar dados
      </button>
    </div>
  );
}