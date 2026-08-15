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
import { AiFillCloseCircle } from 'react-icons/ai';

export default function LeaveGMFromSession() {
  const router = useRouter();
  const { setShowDelGMFromSession, name, session, email, setShowMessage } = useContext(contexto);

  const closePopup = () => setShowDelGMFromSession(false);

  const removeGMFromSession = async () => {
    try {
      const oldestUser = await getOldestUserBySession(session.id, session.gameMaster, setShowMessage);
      if (oldestUser) {
        const newGameMaster = await getUserByEmail(oldestUser, setShowMessage);
        const nameOfUser = newGameMaster.firstName + ' ' + newGameMaster.lastName;
        const notification = {
          message: `Parabéns! Agora você é o novo Narrador da Sessão "${capitalizeFirstLetter(session.name)}"!`,
          email: oldestUser,
          type: 'info',
          user: nameOfUser,
        };
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
        await registerHistory(
          session.id,
          {
            message: `O antigo Narrador saiu da sessão e o cargo foi repassado para ${capitalizeFirstLetter(nameOfUser)}.`,
            type: 'notification',
          },
          null,
          setShowMessage,
        );
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
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro: ' + error });
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
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro: ' + error });
    }
  };

  const description = session.gameMaster === email
    ? 'Ao confirmar sua saída desta Sessão, seu acesso e histórico serão completamente apagados, sem chance de resgate destes dados. Se ainda existirem Jogadores na Sessão, o cargo de Narrador será atribuído ao mais antigo. Caso contrário, a Sala será completamente excluída. Você tem certeza de que deseja fazer isso?'
    : 'Ao confirmar sua saída desta Sessão, sua Ficha e histórico serão completamente apagados, sem chance de resgate destes dados. Você tem certeza de que deseja fazer isso?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar saída da sessão"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
          <h2 className="mt-2 font-kingthings text-2xl sm:text-3xl">Sair Da Sessão</h2>
          <p className="mt-2 max-w-xl font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            {description}
          </p>
        </div>

        <div className="relative z-10 flex gap-3 px-5 pb-5 sm:px-8 sm:pb-8">
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex flex-1 items-center justify-center border border-zinc-600/50 bg-black/70 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-zinc-400/70"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (session.gameMaster === email || email === 'bruno.cabral.silva2018@gmail.com') removeGMFromSession();
              else removePlayerFromSession();
            }}
            className="inline-flex flex-1 items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
