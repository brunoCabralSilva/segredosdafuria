import contexto from "@/context/context";
import { calculateRageChecks, registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export function Energize() {
  const [numberOfRageTest, setNumberOfRageTests] = useState<number>(1);
  const [marked, setMarked] = useState<boolean>(false);
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    sessionId,
    email,
    sheetId,
    dataSheet,
    setShowMessage,
    showGiftRoll, setShowGiftRoll,
    setShowMenuSession,
  } = useContext(contexto);

  const rollTestOfUser = async () => {
      let pool = 0;
      pool = Number(dataSheet.data.wisdom) + Number(dataSheet.data.attributes.resolve);
      let rage = Number(dataSheet.data.rage);
      if (rage > pool) {
        rage = pool;
        pool = 0;
      } else pool -= rage;
      const roll = rollTest(rage, pool, penaltyOrBonus, dificulty);
      return roll;
    }
  
    const rollRage = async () => {
      if (dataSheet.data.rage >= numberOfRageTest) {
        const rageTest = await calculateRageChecks(sheetId, numberOfRageTest, setShowMessage);
        dataSheet.data.rage = rageTest?.rage;
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        if (marked) {
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
      <label htmlFor="rage-tests" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Quantidade de testes de Fúria Necessários:</p>
        <div className="flex w-full">
          <div
            className={`border border-white p-3 cursor-pointer ${ numberOfRageTest === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfRageTest > 0) setNumberOfRageTests(numberOfRageTest - 1);
            }}
          >
            <FaMinus />
          </div>
          <div
            id="rage-tests"
            className="p-2 bg-white text-center text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setNumberOfRageTests(15);
              else if (e.target.value >= 0) setNumberOfRageTests(Number(e.target.value));
            }}
          >
            {numberOfRageTest}
          </div>
          <div
            className={`border border-white p-3 cursor-pointer ${ numberOfRageTest === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfRageTest < dataSheet.data.rage) setNumberOfRageTests(numberOfRageTest + 1)
            }}
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label
        htmlFor="checkboxReflexive"
        className="pb-5 w-full text-white flex items-start cursor-pointer">
        <input
          type="checkbox"
          id="checkboxReflexive"
          className="mr-2 mt-1"
          checked={marked}
          onChange={ (e: any) => setMarked(e.target.checked) }
        />
        <span>Marque se a máquina estiver danificada</span>
      </label>
      {
        marked &&
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
        marked &&
        <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Dificuldade do Teste (Dependendo da extensão da avaria)</p>
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
    </div>
  )
}