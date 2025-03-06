'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataRituals from '../../data/rituals.json';
import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import Ritual from "../player/ritual";

export default function AddRitual() {
  const {
    sheetId,
    dataSheet,
    setShowRitualsToAdd,
    setShowMessage,
  } =  useContext(contexto);
  
  const registerRitual = async (ritual: any) => {
    if (dataSheet.data.rituals.find((item: any) => item.titlePtBr === ritual.titlePtBr))
      dataSheet.data.rituals = dataSheet.data.rituals.filter((item: any) => item.titlePtBr !== ritual.titlePtBr)
    else dataSheet.data.rituals.push(ritual);
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
  }

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 p-2 sm:p-5 pb-3">
      <div className="bg-black border-2 border-white w-full h-full p-2 sm:p-5">
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
          <div className="flex-1 pt-3 text-justify overflow-y-auto col1-73">
            <div className="sm:px-3">
              {
                dataRituals.map((ritual: any, index: number) => (
                  <Ritual ritual={ritual} key={index} index={index} length={dataRituals.length} />
                ))
              }
            </div>
          </div>
          <div className="col2-73 hidden sm:flex flex-col w-full pl-2 pt-3">
            <div className="bg-gray-whats-dark w-full h-full overflow-y-auto p-5">
              <p className="capitalize text-lg pb-3 font-bold">Rituais Adicionados</p>
              {
                dataSheet.data.rituals.map((item: any, index: number) => (
                  <div key={index} className="mt-2 ">
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