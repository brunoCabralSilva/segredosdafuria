'use client'
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { FaMinus, FaPlus } from "react-icons/fa";
import { haranoHaugloskCheck } from "@/firebase/messagesAndRolls";
import { updateDataPlayer } from "@/firebase/players";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function HaranoHaugloskMaster(props: { type: string }) {
  const { type } = props;
  const [player, setPlayer]: any = useState({});
  const [haranoHauglosk, setHaranoHauglosk] = useState<number>(1);
  const [dificulty, setDificulty] = useState<number>(1);
  const {
    showPlayer,
    players,
    session,
    setShowHauglosk,
    setShowHarano,
    setShowMenuSession,
    setShowMessage,
    setShowPlayer,
  } =  useContext(contexto);

  useEffect(() => {
    const playerData: any = players.find((item: any) => item.data.email === showPlayer.email);
    setPlayer(playerData);
    if (Number(playerData.data.harano) + Number(playerData.data.hauglosk) === 0) setHaranoHauglosk(1);
    else setHaranoHauglosk(Number(playerData.data.harano) + Number(playerData.data.hauglosk));
  });

  const rollDices = async () => {
    const typeEdited = type.toLocaleLowerCase();
    player.data[typeEdited] = await haranoHaugloskCheck(session.id, typeEdited, player.data, dificulty, player.email, setShowMessage);
    await updateDataPlayer(session.id, player.email, player.data, setShowMessage);
    setShowHauglosk(false);
    setShowHarano(false);
    setShowMenuSession('');
    setShowPlayer({ show: false, email: '' })
  };

  return(
    <div className="sm:pl-4 mt-8 w-full flex flex-col items-center z-50 top-0 right-0 overflow-y-auto">
      <label htmlFor="valueofRage" className="w-full mb-2 flex justify-between items-center">
        <p className="text-white w-full text-xl font-bold">Teste de { type }</p>
        <button
          type="button"
          className="p-1 right-3 h-10"
          onClick={ () => {
            setShowHarano(false);
            setShowHauglosk(false);
          }}
        >
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
          />
        </button>
      </label>
      <label htmlFor="dificulty" className="mb-2 flex flex-col items-center w-full">
        <p className="text-white w-full pb-3">Parada de Dados</p>
        <div className="flex w-full">
          <div
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaMinus />
          </div>
          <div
            id="dices"
            className="p-2 bg-white text-center text-black w-full"
          >
            {haranoHauglosk}
          </div>
          <div
            className="border border-white p-3 cursor-pointer bg-gray-400 text-black"
          >
            <FaPlus />
          </div>
        </div>
      </label>
      <label htmlFor="dificulty" className="flex flex-col items-center w-full">
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
              else setDificulty(Number(e.target.value));
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
        className={`${dificulty <= 0 ? 'text-black bg-gray-400' : 'text-white bg-black hover:border-red-800' } border-2 border-white  transition-colors cursor-pointer w-full p-2 mt-4 mb-2 font-bold`}
        onClick={ rollDices }
        disabled={ dificulty <= 0 }
      >
        Rolar dados
      </button>
    </div>
  );
}