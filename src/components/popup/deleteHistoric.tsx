'use client'
import contexto from "@/context/context";
import { clearHistory } from "@/firebase/sessions";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function DeleteHistoric() {
  const { setShowDeleteHistoric, session, setShowMessage } = useContext(contexto);
  const clearMessages = async () => {
    try {
      await clearHistory(session.id, setShowMessage);
      setShowDeleteHistoric(false);
    } catch (error) {
      setShowMessage({ show: true, text: 'Erro ao excluir as mensagens do chat: ' + error });
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setShowDeleteHistoric(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de que quer apagar TODO o histórico deste chat? Tudo o que foi enviado pelos participantes será apagado com esta ação!
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteHistoric(false) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ clearMessages }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}