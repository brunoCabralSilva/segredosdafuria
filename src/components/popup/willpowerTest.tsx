'use client'
import { useContext, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { registerWillpowerRoll } from "@/firebase/messagesAndRolls";

export default function WillpowerTest() {
  const [willpowerType, setWillpowerType] = useState<string>('Aguardando Seleção');
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    sessionId,
    dataSheet,
    setShowWillpowerTest,
    setShowMenuSession,
    setShowMessage,
  } =  useContext(contexto);

  const rollDices = async () => {
    const actualWillpower = Number(willpowerType.replace('total -', '').replace('restante -', ''));
    let type = '';
    if (willpowerType.includes('total')) type = 'total';
    else type = 'restante';
    await registerWillpowerRoll(sessionId, type, dataSheet.data.name, actualWillpower, penaltyOrBonus, dificulty, setShowMessage);
    setShowWillpowerTest(false);
    setShowMenuSession('');
  };

  return(
    <div className="w-full bg-black flex flex-col items-center h-80vh z-50 top-0 right-0 overflow-y-auto pr-2">
      <label htmlFor="valueofRage" className="w-full mb-4 flex flex-col items-center">
        <p className="text-white w-full pb-1 text-xl mb-4 font-bold">Teste de Força de Vontade</p>
      </label>
      <select
        className="w-full text-center bg-black border-2 border-white cursor-pointer mb-4 py-2 outline-none"
        value={willpowerType}
        onChange={ (e) => setWillpowerType(e.target.value) }
      >
        <option
          disabled
          value='Aguardando Seleção'
        >
          Selecione a parada de dados
        </option>
        <option
          value={ 'restante -' + (dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length) }
        >
          Usar Força de Vontade restante ({ dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve - dataSheet.data.willpower.length })
        </option>
        <option
          value={ 'total - ' + (dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve) }
        >
          Usar Força de Vontade total ({ dataSheet.data.attributes.composure + dataSheet.data.attributes.resolve })
        </option>
      </select>
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
            className={`border border-white p-3 cursor-pointer ${ dificulty === 1 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (dificulty > 1) setDificulty(dificulty - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="dificulty"
            className="p-2 bg-white text-center text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setDificulty(15);
              else setDificulty(Number(e.target.value));
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
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Parada de Dados</p>
        <div className="flex w-full">
          <div
            id="dices"
            className="p-2 bg-white text-center text-black w-full"
          >
            { willpowerType.replace('total -', '').replace('restante -', '') }
          </div>
        </div>
      </label>
      {
        (willpowerType === '0') &&
        <div className="text-center">
          Você não possui Força de Vontade disponível para realizar este teste
        </div>
      }
      <button
        className={`${willpowerType.replace('total -', '').replace('restante -', '') === '0' || willpowerType.replace('total -', '').replace('restante -', '') === 'Aguardando Seleção' ? 'text-black bg-gray-400' : 'text-white bg-black hover:border-red-800' } border-2 border-white  transition-colors cursor-pointer w-full p-2 mt-4 font-bold`}
        onClick={ rollDices }
        disabled={ willpowerType.replace('total -', '').replace('restante -', '') === '0' || willpowerType.replace('total -', '').replace('restante -', '') === 'Aguardando Seleção' }
      >
        Rolar dados
      </button>
    </div>
  );
}