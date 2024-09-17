'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataRituals from '../../data/rituals.json';
import contexto from "@/context/context";
import { IoAdd } from "react-icons/io5";
import { updateDataPlayer } from "@/firebase/players";
import { MdDelete } from "react-icons/md";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function AddRitual() {
  const {
    email,
    sessionId,
    dataSheet,
    returnSheetValues,
    setShowRitualsToAdd,
  } =  useContext(contexto);
  
  const registerRitual = async (ritual: any) => {
    if (dataSheet.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr))
      dataSheet.rituals = dataSheet.rituals.filter((item: any) => item.titlePtBr !== ritual.titlePtBr)
    else dataSheet.rituals.push(ritual);
    await updateDataPlayer(sessionId, email, dataSheet);
    returnSheetValues();
  }

  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70  p-5 pb-3">
      <div className="bg-black border-2 border-white w-full h-full p-5">
        <div className="flex justify-between">
          <p className="text-white font-bold text-2xl py-3 pt-2">Rituais</p>
          <button
            type="button"
            className="p-1 right-3 h-10"
            onClick={ () => setShowRitualsToAdd(false) }
          >
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={ () => setShowRitualsToAdd(false) }
            />
          </button>
        </div>
        <div className="custom-grid">
          <div className="flex-1 pt-3 pb-2 text-justify overflow-y-auto col1-73">
            <div className="p-3 bg-gray-whats">
              {
                dataRituals.map((ritual: any, index2: number) => (
                  <div key={index2} className={`${dataSheet.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr) ? 'bg-black': ''} border-2 border-white p-5 mb-3`}>
                    <div className="w-full flex items-start justify-between">
                      <p className="capitalize text-xl pb-3 font-bold flex flex-col">
                        <span>
                          { ritual.titlePtBr } - { ritual.type }
                        </span>
                        <span>({ ritual.title }) </span>
                      </p>
                      <button
                        type="button"
                        className="p-1 border-2 border-white bg-white right-3"
                        onClick={ () => { registerRitual(ritual)}}
                      >
                        {
                          dataSheet.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr)
                          ? <MdDelete className="text-black text-xl" />
                          : <IoAdd className="text-black text-xl" />
                        }
                      </button>
                    </div>
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Teste:</span>
                      { ritual.pool }
                    </p>
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Descrição:</span>
                      { ritual.descriptionPtBr }
                    </p>
                    <p className="pt-2">
                      <span className="pr-1 font-bold">Sistema:</span>
                      { ritual.systemPtBr }
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="col2-73 flex flex-col w-full pl-2 pt-3">
            <div className="bg-gray-whats w-full h-full overflow-y-auto p-5">
              <p className="capitalize text-lg pb-3 font-bold">Rituais Adicionados</p>
              {
                dataSheet.rituals.map((item: any, index: number) => (
                  <div key={index} className="mt-2">
                     - { item.titlePtBr } ({item.title})
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}