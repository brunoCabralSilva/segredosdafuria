'use client'
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function PlayerSheet() {
  const { viewPlayer, setViewPlayer } =  useContext(contexto);

  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70 font-normal p-5 pb-3 z-60">
      <div className="bg-black border-2 border-white w-full h-full p-5 overflow-y-auto">
        <div className="flex justify-between">
          <p className="text-white font-bold text-2xl py-3 pt-2">Ficha do Personagem</p>
          <button
            type="button"
            className="p-1 right-3 h-10"
            onClick={ () => setViewPlayer({ show: false, data: {} }) }
          >
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
            />
          </button>
        </div>
        <div className="pt-3 bg-gray-whats-dark w-full h-full p-5">
          <p className="text-lg pb-3 font-bold text-white">{ viewPlayer.data.data.name } - { capitalizeFirstLetter(viewPlayer.data.data.auspice) } dos { capitalizeFirstLetter(viewPlayer.data.data.trybe) } </p>
        </div>
      </div>
    </div>
  );
}