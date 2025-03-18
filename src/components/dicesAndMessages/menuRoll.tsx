import contexto from "@/context/context";
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ManualRoll from "./manualRoll";
import AutomatedRoll from "./automatedRoll";

export default function MenuRoll() {
  const { setShowMenuSession, session, email } = useContext(contexto);
  const [optionRadio, setOptionRadio] = useState<string>(session.gameMaster === email ? 'manual': 'automated');
  return(
    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto text-white">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => setShowMenuSession('') }
        />
      </div>
        <div className="pb-8 grid grid-cols-2 w-full">
          <button
            type="button"
            onClick={() => setOptionRadio('automated')}
            className={`text-sm sm:text-base w-full ${ optionRadio === 'automated' ? 'text-white bg-black border-2 border-white' : 'text-black bg-gray-400 border-2 border-black'} p-2 text-center`}>
            Teste Automatizado
          </button>
          <button
            type="button"
            onClick={() => setOptionRadio('manual')}
            className={`text-sm sm:text-base w-full ${ optionRadio === 'manual' ? 'text-white bg-black border-2 border-white' : 'text-black bg-gray-400 border-2 border-black'} p-2 text-center`}>
            Teste Manual
          </button>
        </div>
        {
          optionRadio === 'automated'
          ? <AutomatedRoll />
          : <ManualRoll />
        }
    </div>
  );
}