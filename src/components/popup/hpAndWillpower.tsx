'use client'
import contexto from "@/context/context";
import { getAllPlayersBySessionId } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";
import { MdOutlineDoubleArrow } from "react-icons/md";
import PlayersPopup from "./playersPopup";

export default function HpAndWillPower() {
  const [players, setPlayers] = useState<any>([]);
  const [showData, setShowData] = useState(false);
  const { dataSession, session, setShowMessage, players: allPlayers, showMenuSession } = useContext(contexto);

  const getPlayers = async () => {
    const allPlayers = await getAllPlayersBySessionId(session.id, setShowMessage);
    if (allPlayers) setPlayers(allPlayers);
  }

  useEffect(() => {
    getPlayers();
  }, [dataSession, session, allPlayers]);

  return(
    <div className={`h-[75vh] overflow-y-auto z-30 pl-1 w-50 absolute ${showMenuSession !== '' ? 'top-2' : 'top-12'} right-1 sm:right-6 rounded-xl pr-2`}>
        {
          !showData &&
          <MdOutlineDoubleArrow
            className="rotate-180 cursor-pointer bg-black p-1 rounded-full text-3xl border border-white"
            onClick={ () => setShowData(true) }
          />
        }
        {
          showData &&
          <div className="w-full flex justify-end mb-1">
            <MdOutlineDoubleArrow
              className="cursor-pointer bg-black p-1 rounded-full text-3xl border border-white"
              onClick={ () => setShowData(false) }
            />
          </div>
        }
        {
          showData &&
          players.map((player: any, index: number) => (
            <PlayersPopup player={ player } key={ index } />
          ))
        }
         
    </div>    
  );
}