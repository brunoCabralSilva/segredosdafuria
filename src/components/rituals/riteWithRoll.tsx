import contexto from "@/context/context";
import { registerMessage, rollTest } from "@/firebase/messagesAndRolls";
import { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export function RiteWithRoll(
  props: {
    skill: string,
    renown: string,
    textDifficult: string,
  }
) {
  const { textDifficult, skill, renown } = props;
  const [penaltyOrBonus, setPenaltyOrBonus] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(1);
  const [numberOfPjs, setNumberOfPjs] = useState<number>(0);
  const [numberOfKnowPjs, setNumberOfKnowPjs] = useState<number>(0);
  const { sessionId, email, dataSheet, showRitualRoll, setShowRitualRoll, setShowMenuSession, setShowMessage } = useContext(contexto);

  const rollTestOfUser = async () => {
    let pool = 0;
    if (skill !== '') pool += Number(dataSheet.data.skills[skill].value);
    if (renown !== '') pool += Number(dataSheet.data[renown]);
    let rage = Number(dataSheet.data.rage);
    if (rage > pool) {
      rage = pool;
      pool = 0;
    } else pool -= rage;

    const totalPool = pool + numberOfKnowPjs;
    const totalRage = rage + numberOfPjs;
    const roll = rollTest(totalRage, totalPool, penaltyOrBonus, dificulty);
    return roll;
  }
  
  const rollDices = async () => {
    const roll = await rollTestOfUser();
    await registerMessage(sessionId, { ...showRitualRoll.ritual, type: 'ritual', results: roll }, email, setShowMessage);
  }

  return(
    <div className="w-full">
      <label htmlFor="numberOfPjs" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">
          Quantidade de participantes além do Mestre do Ritual que estão participando (cada um dos outros participantes soma um dado de Fúria à parada):
        </p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ numberOfPjs === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfPjs > 0) setNumberOfPjs(numberOfPjs - 1);
              if (numberOfPjs < numberOfKnowPjs) setNumberOfKnowPjs(numberOfPjs - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="numberOfPjs"
            className="p-2 bg-white text-center text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setNumberOfPjs(15);
              else if (e.target.value >= 0) setNumberOfPjs(Number(e.target.value));
            }}
          >
            {numberOfPjs}
          </div>
         <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ numberOfPjs === 15 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfPjs < 15) setNumberOfPjs(numberOfPjs + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="numberOfKnowPjs" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">
          Dentre os informados acima, cite a quantidade de participantes além do Mestre do Ritual que conhecem o Ritual (cada um dos outros participantes que conhecerem o Ritual somarão um dado de Fúria e um dado comum à parada):
        </p>
        <div className="flex w-full">
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ numberOfKnowPjs === 0 ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfKnowPjs > 0) setNumberOfKnowPjs(numberOfKnowPjs - 1);
            }}
          >
            <FaMinus />
          </button>
          <div
            id="numberOfKnowPjs"
            className="p-2 bg-white text-center text-black w-full"
            onChange={ (e: any) => {
              if (Number(e.target.value > 0 && Number(e.target.value) > 15)) setNumberOfKnowPjs(15);
              else if (e.target.value >= 0) setNumberOfKnowPjs(Number(e.target.value));
            }}
          >
            {numberOfKnowPjs}
          </div>
          <button
            type="button"
            className={`border border-white p-3 cursor-pointer ${ numberOfKnowPjs === numberOfPjs ? 'bg-gray-400 text-black' : 'bg-black text-white'}`}
            onClick={ () => {
              if (numberOfKnowPjs < numberOfPjs) setNumberOfKnowPjs(numberOfKnowPjs + 1)
            }}
          >
            <FaPlus />
          </button>
        </div>
      </label>
      <label htmlFor="dificulty" className="mb-4 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">{ textDifficult === '' ? 'Dificuldade do Teste' : textDifficult } </p>
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
      <button
        className="text-white bg-black hover:border-red-800 border-2 border-white  transition-colors cursor-pointer w-full p-2 font-bold"
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