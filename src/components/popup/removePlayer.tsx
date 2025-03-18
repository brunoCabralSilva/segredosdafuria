'use client'
import contexto from '@/context/context';
import { removePlayerFromSession } from '@/firebase/players';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function RemovePlayer() {
	const { setShowRemovePlayer, setShowMessage, setShowMenuSession, session, showPlayer } = useContext(contexto);

  const removeSession = async () => {
    try {
			await removePlayerFromSession(session.id, showPlayer.email, setShowMessage);
      setShowRemovePlayer({ show: false, email: '' })
      setShowMenuSession('');
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
    }
  };

  return(
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => setShowRemovePlayer({ show: false, email: '' }) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Ao confirmar a remoção do Jogador desta Sessão, a Ficha dele será completamente apagada, sem chance de resgate de nenhum dado e perdendo o acesso a esta sala até que você o aceite novamente. Tem certeza que de fato quer excluir o usuário?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => setShowRemovePlayer({ show: false, email: '' }) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ removeSession }
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