'use client'
import contexto from '@/context/context';
import { deleteConsent } from '@/firebase/consentForm';
import { registerHistory } from '@/firebase/history';
import { registerMessage } from '@/firebase/messagesAndRolls';
import { registerNotification } from '@/firebase/notifications';
import { getOldestUserBySession } from '@/firebase/players';
import { deleteSessionById, leaveFromSession, updateSession } from '@/firebase/sessions';
import { getUserByEmail } from '@/firebase/user';
import { capitalizeFirstLetter } from '@/firebase/utilities';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function LeaveGMFromSession() {
  const router = useRouter();
	const { setShowDelGMFromSession, name, session, email, setShowMessage } = useContext(contexto);

  const removeGMFromSession = async () => {
    try {
      const oldestUser = await getOldestUserBySession(session.id, session.gameMaster, setShowMessage);
      if (oldestUser) {
        const newGameMaster = await getUserByEmail(oldestUser, setShowMessage);
        const nameOfUser = newGameMaster.firstName + ' ' + newGameMaster.lastName;
        const notification = {
          message: `Parabéns! Agora você é o novo Narrador da Sessão "${capitalizeFirstLetter(session.name)}"!`, email: oldestUser, type: 'info',
          user: nameOfUser,
        }
        await registerNotification(session.id, notification, setShowMessage);
        await registerMessage(
          session.id,
          {
            message: `O antigo Narrador saiu da sessão e o cargo foi repassado para ${capitalizeFirstLetter(nameOfUser)}! Caso não seja do interesse do novo Narrador manter-se no cargo, basta ir até Menu > Geral > Narrador e inserir o email de outro Jogador cadastrado na plataforma. Sair da Sessão também fará com que o cargo de Narrador passe para o Jogador mais antigo da Sala, até que não existam mais jogadores e a Sessão seja excluída.`,
            type: 'notification',
          },
          null,
          setShowMessage,
        );
        await registerHistory(session.id, { message: `O antigo Narrador saiu da sessão e o cargo foi repassado para ${capitalizeFirstLetter(nameOfUser)}.`,type: 'notification' }, null, setShowMessage);
        router.push('/sessions'); 
        setShowDelGMFromSession(false);
        await leaveFromSession(session.id, email, name, setShowMessage);
        await deleteConsent(email, session.id, setShowMessage);
        const newPlayers = session;
        newPlayers.players = session.players.filter((emailUser: any) => emailUser !== email);
        newPlayers.gameMaster = oldestUser;
        newPlayers.nameMaster = nameOfUser;
        await updateSession(newPlayers, setShowMessage);
      } else {
        router.push('/sessions');
        setShowDelGMFromSession(false);
        await deleteConsent(email, session.id, setShowMessage);
        await leaveFromSession(session.id, email, name, setShowMessage);
        await deleteSessionById(session.id, setShowMessage);
        location.reload();
      }
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
    }
  };

  const removePlayerFromSession = async () => {
    try {
      router.push('/sessions');
			await leaveFromSession(session.id, email, name, setShowMessage);
      await deleteConsent(email, session.id, setShowMessage);
      setShowDelGMFromSession(false);
      const newPlayers = session;
      newPlayers.players = session.players.filter((emailUser: any) => emailUser !== email);
      await updateSession(newPlayers, setShowMessage);
      location.reload();
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
    }
  }

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => setShowDelGMFromSession(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            {
              session.gameMaster === email ?
              <p className="text-white w-full text-center pb-3">
                Ai confirmar sua saída desta Sessão, seu acesso e histórico serão completamente apagados, sem chance de resgate destes dados. Se ainda existirem Jogadores na Sessão, o cargo de NARRADOR será atribuído ao mais antigo, caso contrário a Sala será completamente excluída. Você tem certeza que de fato quer fazer isto?
              </p>
              : <p>
                Ai confirmar sua saída desta Sessão, sua Ficha e histórico serão completamente apagados, sem chance de resgate destes dados. Você tem certeza que de fato quer fazer isto?
              </p>
            }
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={ () => setShowDelGMFromSession(false) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ () => {
                if (session.gameMaster === email || email === 'bruno.cabral.silva2018@gmail.com') removeGMFromSession();
                else removePlayerFromSession();
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