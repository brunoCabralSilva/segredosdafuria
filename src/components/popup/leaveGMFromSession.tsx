'use client'
import contexto from '@/context/context';
import { registerMessage } from '@/firebase/messagesAndRolls';
import { registerNotification } from '@/firebase/notifications';
import { getPlayersBySession } from '@/firebase/players';
import { deleteSessionById, leaveFromSession, updateSession } from '@/firebase/sessions';
import { capitalizeFirstLetter } from '@/firebase/utilities';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function LeaveGMFromSession() {
  const router = useRouter();
	const { setShowDelGMFromSession, session, setShowMessage } = useContext(contexto);

  const removeSession = async () => {
    try {
      const players = await getPlayersBySession(session.id, setShowMessage);
      if (players.length === 1 && players[0].email === session.gameMaster) { 
        await deleteSessionById(session.id, setShowMessage);
      } else if (players.length === 0) await deleteSessionById(session.id, setShowMessage);
      else {
        const playersReduce = players
          .filter((player: any) => player.email !== session.gameMaster)
          .reduce((oldestPlayer: any, currentPlayer: any) => {
          const currentCreationDate = new Date(currentPlayer.creationDate);
          const oldestCreationDate = new Date(oldestPlayer.creationDate);
            return currentCreationDate < oldestCreationDate ? currentPlayer : oldestPlayer;
        });
        const sessionData = session;
        session.gameMaster = playersReduce.email;
        const notification = {
          message: `Parabéns! Agora você é o novo Narrador da Sessão "${capitalizeFirstLetter(session.name)}"!`, email: playersReduce.email, type: 'info',
          user: playersReduce.user,
        }
        await registerNotification(session.id, notification, setShowMessage);
        await registerMessage(
          session.id,
          {
            message: `O antigo Narrador saiu da sessão e o cargo foi repassado para ${capitalizeFirstLetter(playersReduce.user)}! Caso não seja do interesse do novo Narrador manter-se no cargo, basta ir até Menu > Geral > Narrador e inserir o email de outro Jogador cadastrado na plataforma. Sair da Sessão também fará com que o cargo de Narrador passe para o Jogador mais antigo da Sala, até que não existam mais jogadores e a Sessão seja excluída.`,
            type: 'notification',
          },
          null,
          setShowMessage,
        );
        await updateSession(sessionData, setShowMessage);
      }
      setShowDelGMFromSession(false);
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
            onClick={ () => setShowDelGMFromSession(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Ai confirmar sua saída desta Sessão, seu acesso e histórico serão completamente apagados, sem chance de resgate destes dados. Se ainda existirem Jogadores na Sessão, o cargo de NARRADOR será atribuído ao mais antigo, caso contrário a Sala será completamente excluída. Você tem certeza que de fato quer fazer isto?
            </p>
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