'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AutomatedRoll from "./sheet/automatedRoll";
import ManualRoll from "./manualRoll";

export default function PopUpDices(props: { session: string }) {
  const { session } = props;
  const [optionRadio, setOptionRadio] = useState<string>('automated');
  const dispatch = useAppDispatch();

  return(
      <div className="w-8/10 px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
        <div className="w-full h-20 mb-3 flex justify-end">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionShowMenuSession(''))}
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
          ? <AutomatedRoll session={ session } />
          : <ManualRoll session={ session } />
        }
      </div>
  )
}