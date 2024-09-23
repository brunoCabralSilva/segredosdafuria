import contexto from "@/context/context";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";

export default function Players() {
  const { players, session, setShowPlayer, setShowCreateSheet } = useContext(contexto);
  return(
    <div className="flex flex-col items-center justify-start h-screen z-60 top-0 right-0 w-full">
      <button
        type="button"
        onClick={() => setShowCreateSheet(true) }
        className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
      >
        Criar Ficha
      </button>
      { 
        players.length === 0 && <div className="w-full text-white text-lg text-center mt-4">
          Você não possui Jogadores.
        </div>
      }
      <div className="flex flex-col w-full gap-3">
        {
          players.length > 0 && players.filter((pl: any) => pl.email !== session.gameMaster).map((player: any, index: number) => (
            <button
              type="button"
              key={index}
              onClick={ () => {
                setShowPlayer({show: true, email: player.email }) }}
              className="w-full py-4 border border-white cursor-pointer text-white text-center font-bold"
            >
              {
                player.data.name !== ''
                ? `${player.data.name} (${capitalizeFirstLetter(player.user)})`
                : capitalizeFirstLetter(player.user)
              }
            </button>
          ))
        } 
      </div>
    </div>
  );
}