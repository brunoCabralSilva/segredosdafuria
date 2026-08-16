'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosInformationCircle } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import Simplify from '@/components/simplify';
import MessageToUser from '@/components/dicesAndMessages/messageToUser';
import VerifySession from '@/components/popup/verifySession';
import CreateSection from '@/components/popup/createSection';
import Info from '@/components/info';
import contexto from '@/context/context';
import { authenticate } from '@/firebase/authenticate';
import { getSessions } from '@/firebase/sessions';
import { parseDate } from '@/firebase/utilities';

type SessionCard = {
  id: string;
  gameMaster?: string;
  name?: string;
  nameMaster?: string;
  creationDate?: string;
  description?: string;
  imageName?: string;
  statusSession?: string;
  players?: string[];
};

const authorizedFinanceEmail = 'lycan.byell@gmail.com';

const resumeText = (text: string, totalLength: number) => {
  if (text.length <= totalLength) return text;
  return `${text.slice(0, totalLength)}...`;
};

export default function Sessions() {
  const router = useRouter();
  const {
    simplify,
    showInfoSessions,
    setShowInfoSessions,
    showCreateSession,
    setShowCreateSession,
    dataSession,
    dataUser,
    setDataUser,
    resetPopups,
    showMessage,
    setShowMessage,
    setDataSession,
  } = useContext(contexto);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showData, setShowData] = useState(false);
  const [sessionsAsGM, setSessionsAsGM] = useState<SessionCard[]>([]);
  const [sessionsEnded, setSessionsEnded] = useState<SessionCard[]>([]);
  const [sessionsAsPlayer, setSessionsAsPlayer] = useState<SessionCard[]>([]);
  const [sessionsOthers, setSessionsOthers] = useState<SessionCard[]>([]);

  const organizeSessions = (sessionsList: SessionCard[], email: string) => {
    const orderedSessions = [...sessionsList].sort((a, b) => {
      const dateA = a.creationDate ? parseDate(String(a.creationDate)) : new Date(0);
      const dateB = b.creationDate ? parseDate(String(b.creationDate)) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const gmList = orderedSessions.filter(
      (session) => String(session.gameMaster || '') === email && session.statusSession !== 'Finalizada',
    );

    const playerList = orderedSessions.filter((session) => {
      const isNarrator = String(session.gameMaster || '') === email;
      const isPlayer = Array.isArray(session.players) && session.players.includes(email);
      return !isNarrator && isPlayer && session.statusSession !== 'Finalizada';
    });

    const othersList = orderedSessions.filter((session) => {
      const isNarrator = String(session.gameMaster || '') === email;
      const isPlayer = Array.isArray(session.players) && session.players.includes(email);
      return !isNarrator && !isPlayer && session.statusSession !== 'Finalizada';
    });

    const endedList = orderedSessions.filter((session) => session.statusSession === 'Finalizada');

    setSessionsAsGM(gmList);
    setSessionsAsPlayer(playerList);
    setSessionsOthers(othersList);
    setSessionsEnded(endedList);
  };

  const handleOpenSession = (sessionId: string) => {
    setDataSession({ show: true, id: sessionId });
  };

  const handleCreateSession = () => {
    setShowCreateSession(true);
    setShowInfoSessions(false);
  };

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        resetPopups();
        if (active) {
          setLoadingSessions(true);
          setShowData(false);
          setDataSession({ show: false, id: '' });
        }

        let authUser = dataUser;

        if (authUser.email === '' || authUser.displayName === '') {
          const authData: any = await authenticate(setShowMessage);

          if (!authData || !authData.email || !authData.displayName) {
            router.push('/login');
            return;
          }

          authUser = {
            email: String(authData.email),
            displayName: String(authData.displayName),
          };

          if (active) setDataUser(authUser);
        }

        if (active) setShowData(true);

        const sessionsList = await getSessions();
        if (active) organizeSessions(sessionsList as SessionCard[], authUser.email);
      } catch (error) {
        if (active) {
          setShowMessage({ show: true, text: `Ocorreu um erro ao obter Sessões: ${error}` });
        }
      } finally {
        if (active) setLoadingSessions(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSessionCard = (session: SessionCard) => (
    <button
      type="button"
      onClick={() => handleOpenSession(session.id)}
      className="group h-full w-full overflow-hidden border border-zinc-500/30 bg-black/70 text-left transition-colors hover:border-red-700/80"
    >
      <div className="relative h-36 w-full">
        <Image
          src={`/images/sessions/${session.imageName || '01'}.png`}
          alt={`Banner da sessão ${session.name || ''}`}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-3 pb-1 pt-3">
          <p className="font-kingthings text-base capitalize text-white transition-colors group-hover:text-red-500">
            {session.name || 'Sessão sem nome'}
          </p>
        </div>
      </div>

      <div className="space-y-2 px-4 py-4 text-white uppercase">
        <p className="font-geist-mono text-[11px] text-white/75">
          Narrador: <span className="uppercase">{session.nameMaster || 'Não informado'}</span>
        </p>
        <p className="font-geist-mono text-[11px] text-white/75">
          Criada em: {session.creationDate || 'Não informada'}
        </p>
        <p className="font-geist-mono text-[11px] text-white/75">
          Status: {session.statusSession || 'Ativa'}
        </p>
        <p className="font-geist-mono text-[11px] leading-relaxed text-white/85">
          {resumeText(session.description || 'Sem sinopse cadastrada.', 120)}
        </p>
      </div>
    </button>
  );

  const renderSessionSection = (
    title: string,
    description: string,
    sessions: SessionCard[],
    emptyText: string,
  ) => (
    <div className="mt-10 w-full first:mt-0">
      <div className="mb-4 flex flex-col gap-3 text-white sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-kingthings text-lg sm:text-xl">{title}</h2>
          <p className="mt-1 font-geist-mono text-[11px] text-white/75 sm:text-xs">{description}</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="border border-zinc-500/30 bg-black/60 px-4 py-6 text-center font-geist-mono text-xs text-white/70">
          {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <div key={`${title}-${session.id}`} className="h-full">
              {renderSessionCard(session)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <Simplify />
      {showMessage.show && <MessageToUser />}
      {dataSession.show && <VerifySession />}
      {showCreateSession && <CreateSection closeHref="/sessions" />}
      <Nav />

      <section className="h-full w-full bg-black/90">
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          {!showData || loadingSessions ? (
            <div className="flex min-h-[60vh] items-center justify-center bg-black/80 px-6 py-10 text-white">
              <span className="loader z-50" />
            </div>
          ) : (
            <section className="text-white">
              <div className="py-8 sm:py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Sessões</h1>
                      <button
                        type="button"
                        onClick={() => {
                          setShowInfoSessions(!showInfoSessions);
                          setShowCreateSession(false);
                        }}
                        className="text-white/70 transition-colors hover:text-red-400"
                        aria-label="Informações sobre sessões"
                      >
                        <IoIosInformationCircle className="text-3xl sm:text-4xl" />
                      </button>
                    </div>
                    <p className="mt-2 font-geist-mono text-[11px] text-white/75 sm:text-xs">
                      Entre em mesas, acompanhe o chat, gerencie fichas e viva toda a crônica em um só lugar.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {dataUser.email === authorizedFinanceEmail && (
                      <button
                        type="button"
                        onClick={() => router.push('/finance')}
                        className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                      >
                        Financeiro
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCreateSession}
                      className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-2 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
                    >
                      Criar Sessão
                    </button>
                  </div>
                </div>
                <hr className="mt-5 border-white/10" />
              </div>

              {sessionsAsGM.length > 0 && renderSessionSection(
                'Sessões em que você é narrador',
                'As mesas sob sua condução ficam reunidas aqui para acesso rápido.',
                sessionsAsGM,
                'Você ainda não possui sessões ativas em que seja narrador.',
              )}

              {sessionsAsPlayer.length > 0 && renderSessionSection(
                'Sessões em que você é jogador',
                'Aqui ficam as sessões em que seu personagem participa ativamente.',
                sessionsAsPlayer,
                'Você ainda não possui sessões ativas em que seja jogador.',
              )}

              {sessionsOthers.length > 0 && renderSessionSection(
                'Outras sessões',
                'Explore outras mesas ativas disponíveis no projeto.',
                sessionsOthers,
                'Não há outras sessões ativas disponíveis no momento.',
              )}

              {sessionsEnded.length > 0 && renderSessionSection(
                'Sessões finalizadas',
                'As crônicas encerradas continuam registradas aqui para consulta.',
                sessionsEnded,
                'Nenhuma sessão finalizada encontrada até o momento.',
              )}

              {showInfoSessions && <Info />}
            </section>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

