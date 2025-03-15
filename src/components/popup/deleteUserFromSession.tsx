'use client'
import contexto from '@/context/context';
import { deleteConsent } from '@/firebase/consentForm';
import { removeFromSession, transferSheetToGameMaster, updateSession } from '@/firebase/sessions';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function DeleteUserFromSession() {
	const { email, session, setShowMessage, showDeletePlayer, setShowDeletePlayer } = useContext(contexto);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const removeSession = async (removeSheet: boolean) => {
    if (removeSheet) {
      await removeFromSession(session.id, showDeletePlayer.userEmail, setShowMessage);
    } else {
      await transferSheetToGameMaster(session.id, showDeletePlayer.userEmail, email, setShowMessage);
    }
    await deleteConsent(showDeletePlayer.userEmail, session.id, setShowMessage);
    const newPlayers = session;
    newPlayers.players = session.players.filter((emailUser: any) => emailUser !== showDeletePlayer.userEmail);
    await updateSession(newPlayers, setShowMessage);
    setShowDeletePlayer({ show: false, userEmail: '' });
    setConfirmDelete(false);
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => {
              setShowDeletePlayer({ show: false, userEmail: '' });
              setConfirmDelete(false);
            }}
          />
        </div>
        {
          confirmDelete ?
          <div className="pb-5 px-5 w-full">
            <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
              <p className="text-white w-full text-center pb-3">
                Deseja Remover a Ficha do Usuário ou atribuí-la para você?
              </p>
            </label>
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={ () => removeSession(true) }
                className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
              >
                Remover Ficha(s) do usuário
              </button>
              <button
                type="button"
                onClick={ () => removeSession(false) }
                className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
              >
                Atribuí a(s) Ficha(s) para mim
              </button>
            </div>
          </div>
          : <div className="pb-5 px-5 w-full">
              <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
                <p className="text-white w-full text-center pb-3">
                  Tem Certeza que quer Remover o Usuário selecionado da Sessão? Ele não terá mais acesso a esta Sessão se você realizar esta ação
                </p>
              </label>
              <div className="flex w-full gap-2">
                <button
                  type="button"
                  onClick={ () => setShowDeletePlayer({ show: false, userEmail: '' }) }
                  className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={ () => setConfirmDelete(true) }
                  className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
                >
                  Sim
                </button>
              </div>
            </div>
        }
      </div>
    </div>
  );
}