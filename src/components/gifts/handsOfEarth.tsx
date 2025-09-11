import contexto from "@/context/context";
import { calculateRageCheck, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function HandsOfEarth() {
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [type, setType] = useState<number>(0);
  const { sessionId, sheetId, email, dataSheet, showGiftRoll, setShowGiftRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = 0;
    if (type === 2) {
      pool = Number(dataSheet.data.wisdom) + Number(dataSheet.data.attributes.resolve);
    } else if (type === 3) {
      pool = Number(dataSheet.data.wisdom) + Number(dataSheet.data.attributes.wits);
    }
    let rage = Number(dataSheet.data.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;
    const roll = rollTest(rage, pool, penaltyOrBonus, dificulty);
    return roll;
  }

  const rollRage = async () => {
    if (dataSheet.data.rage >= 1) {
      const rageTest = await calculateRageCheck(sheetId, setShowMessage);
      dataSheet.data.rage = rageTest?.rage;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      if (type === 2 || type === 3) {
        const roll = await rollTestOfUser();
        await registerMessage(
          sessionId,
          {
            type: 'gift',
            ...showGiftRoll.gift,
            roll: 'rage-with-test',
            rageResults: rageTest,
            results: roll,
          },
          email,
          setShowMessage);
      } else {
        await registerMessage(
          sessionId,
          {
            type: 'gift',
            ...showGiftRoll.gift,
            roll: 'rage',
            rageResults: rageTest,
          },
          email,
          setShowMessage);
      }
    } else setShowMessage({ show: true, text: 'Você não possui Fúria suficiente para ativar este Dom.' });
  }

  return(
    <div className="w-full">
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Selecione a ação</p>
        <select
          className="flex w-full text-black p-3"
          value={type}
          onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => setType(Number(e.target.value)) }
        >
          <option
            className="capitalize text-center text-black"
            value={ 0 }
            disabled
          >
            Escolha uma ação
          </option>
          <option
            value={ 1 }
            className="p-3 bg-black text-center text-white w-full"
          >
            Mover um objeto que não é pesado
          </option>
          <option
            value={ 2 }
            className="p-3 bg-black text-center text-white w-full"
          >
            Mover um objeto pesado
          </option>
          <option
            value={ 3 }
            className="p-3 bg-black text-center text-white w-full"
          >
            Lançar um objeto leve como um ataque à distância
          </option>
        </select>
      </label>
      {
        type !== 0 && type !== 1 &&
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
      }
      {
        type !== 0 && type !== 1 &&
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Dificuldade do Teste (para cada 10 metros além dos primeiros 10, a dificuldade aumenta em 1)</p>
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
      }
      {
        type !== 0 &&
        <button
          className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
          onClick={ () => {
            rollRage();
            setShowMenuSession('');
            setShowGiftRoll({ show: false, gift: {} });
          }}
        >
          Ativar Dom
        </button>
      }
    </div>
  )
}