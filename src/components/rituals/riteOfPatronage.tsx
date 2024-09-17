import contexto from "@/context/context";
import { registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function RiteOfPatronage() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(3);
  const [renown, setRenown] = useState('');
  const { sessionId, email, dataSheet, showRitualRoll, setShowRitualRoll, returnSheetValues, setShowMenuSession, } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = dataSheet.skills.etiquette.value + dataSheet[renown];
    let rage = Number(dataSheet.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;
    const roll = rollTest(rage, pool, penaltyOrBonus, dificulty);
    return roll;
  }
  
  const rollDices = async () => {
    const roll = await rollTestOfUser();
    await registerMessage(sessionId, { ...showRitualRoll.ritual, type: 'ritual', results: roll }, email);
    returnSheetValues();
  }

  return(
    <div className="w-full">
      <select
        onChange={(e) => setRenown(e.target.value) }
        value={renown}
        className="w-full p-2 mb-4 text-black"
      >
        <option value="" disabled>Selecione um Renome</option>
        <option value="honor" >Honra</option>
        <option value="glory">Glória</option>
        <option value="wisdom">Sabedoria</option>
      </select>
      <label htmlFor="penaltyOrBonus" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Penalidade (-) ou Bônus (+) para o teste</p>
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
        <p className="text-white w-full pb-3">Dificuldade do Teste</p>
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
        className={`${renown !== '' ? 'bg-black text-white' : 'bg-gray-500 text-black'} hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold`}
        disabled={renown === ''}
        onClick={ () => {
          rollDices();
          setShowMenuSession('');
          setShowRitualRoll({ show: false, ritual: {} });
        }}
      >
        Evocar Ritual
      </button>
    </div>
  )
}