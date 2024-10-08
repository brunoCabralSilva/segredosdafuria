import contexto from "@/context/context";
import { useContext } from "react";
import LeaveFromSession from "../popup/leaveFromSession";

export default function Details() {
  const {
    showDelFromSession,
    email,
    name,
    session,
    players,
    setShowDelFromSession,
  } = useContext(contexto);

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 text-white items-start justify-center font-bold px-1">
        <div
          className="w-full mt-2 flex justify-between items-start"
        >
          {
            session.creationDate !== ''
            ? <div className="h-full w-full">
                <div className="flex flex-col items-center justify-start w-full">
                  <div
                    className="w-full capitalize flex justify-between items-center pr-2 border-2 border-white mb-2"
                  >
                    <span className="text-white font-bold text-2xl my-3 capitalize break-words w-full px-4">
                      { session.name }
                    </span>
                  </div>
                  <div className="w-full mb-2 flex-col font-bold border-2 border-white">
                    <div className="pl-4 pr-2 pt-2 flex justify-between items-center w-full">
                      <div
                        className="text-white w-full flex-col items-center justify-center"
                      >
                        Descrição:
                      </div>
                    </div>
                    <div className="w-full h-full">
                        <div
                            className="text-white font-normal p-4 text-justify w-full h-full break-words"
                          >
                          { session.description }
                        </div>
                    </div>
                  </div>
                  <div
                    className="w-full mb-2 mt-1 flex flex-col justify-between items-center p-2 border-2 border-white"
                  >
                    <div className="flex w-full">
                      <span className="text-white break-words w-full p-2">
                        <span className="font-bold pr-1">Narrador:</span>
                      </span>
                    </div>
                    <span className="border border-transparent text-sm text-white w-full p-2 break-words">
                      { session.gameMaster }
                    </span>
                  </div>
                  <p className="mt-1 text-white sm:text-left w-full text-center border-2 border-white p-4">
                    <span className="font-bold pr-1">Data de Criação:</span>
                    <span>{ session.creationDate }</span>
                  </p>
                  <div className="text-white pb-3 sm:text-left w-full text-center mt-3 border-2 border-white p-4 mb-3">
                    <span className="pr-1 font-bold">Jogadores:</span>
                    {
                      players.filter((player:any) => player.email !== session.gameMaster ).map((item: any, index: number) => (
                        <span className="capitalize" key={index}>
                          { index === players.length -1 ? item.user + '.' : item.user + ', ' }
                        </span>
                      ))
                    }
                  </div>
                </div>
                <button
                  type="button"
                  onClick={ () => setShowDelFromSession(true) }
                  className="mt-3 mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
                >
                  Sair da Sessão
                </button>
                { showDelFromSession && <LeaveFromSession email={email} name={name} /> }
              </div>
            : <div className="h-screen w-full flex items-center justify-center">
                <span className="loader z-50" />
              </div>
          }
        </div>
      </div>
    </div>
  );
}