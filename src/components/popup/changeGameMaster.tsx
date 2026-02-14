'use client'
import contexto from '@/context/context';
import { registerNotification } from '@/firebase/notifications';
import { updateSession } from '@/firebase/sessions';
import { getUserByEmail } from '@/firebase/user';
import { capitalizeFirstLetter } from '@/firebase/utilities';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function ChangeGameMaster(props: { setGameMaster: any }) {
  const { setGameMaster } = props;
  const router = useRouter();
	const {
    showChangeGameMaster, setShowChangeGameMaster,
    setShowMessage, session,
  } = useContext(contexto);

  const removeSession = async () => {
    try {
			const sessionData = session;
      sessionData.gameMaster = showChangeGameMaster.data.email;
      const getUser = await getUserByEmail(showChangeGameMaster.data.email, setShowMessage);
      if (getUser)
        sessionData.nameMaster = getUser.firstName + ' ' + getUser.lastName;
      await updateSession(sessionData, setShowMessage);
      const notification = {
        message: `Parabéns! Agora você é o novo Narrador da Sessão "${capitalizeFirstLetter(session.name)}"!`,
        email: showChangeGameMaster.data.email,
        type: 'info',
        user: showChangeGameMaster.data.displayName,
      }
      await registerNotification(session.id, notification, setShowMessage);
      setShowChangeGameMaster({ show: false, data: {} });
      router.push('/sessions');
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => {
              setShowChangeGameMaster({ show: false, data: {} });
              setGameMaster(session.gameMaster);
            }}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Ao confirmar essa mudança, você perderá o acesso à Sessão como NARRADOR e precisará solicitar permissão ao novo Narrador para participar da sala como JOGADOR. Tem certeza de que deseja realizar essa alteração?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => {
                setShowChangeGameMaster({ show: false, data: {} });
                setGameMaster(session.gameMaster);
              }}
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