'use client'
import contexto from '@/context/context';
import { updateStatusSession } from '@/firebase/sessions';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function EndSession() {
	const { setShowEndSession, session, email, setShowMessage } = useContext(contexto);

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => setShowEndSession(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            {
              session.gameMaster === email ?
              <p className="text-white w-full text-center pb-3">
                Ao finalizar esta sessão, ela será removida da lista exibida na página de sessões nas quais você atua como Narrador ou Jogador e será movida para a lista de Sessões Finalizadas. Caso deseje, você poderá reativá-la a qualquer momento.
              </p>
              : <p>
                Você tem certeza que de fato quer fazer isto?
              </p>
            }
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => setShowEndSession(false) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ async () => {
                await updateStatusSession(session.id, 'Finalizada', setShowMessage);
                setShowEndSession(false)
              }}
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