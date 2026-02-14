'use client'
import Footer from "@/components/footer";
import Nav from '@/components/nav';
import { useContext, useEffect, useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { authenticate } from "@/firebase/authenticate";
import { ISession } from "@/interface";
import CreateSection from "../../components/popup/createSection";
import { getSessions } from "@/firebase/sessions";
import contexto from "@/context/context";
import Info from "../../components/info";
import Loading from "../../components/loading";
import VerifySession from "../../components/popup/verifySession";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import SessionItem from "./sessionItem";

export default function Sessions() {
  const router = useRouter();
  const {
    showInfoSessions, setShowInfoSessions,
    showCreateSession, setShowCreateSession,
    dataSession,
    dataUser, setDataUser,
    resetPopups,
    showMessage, setShowMessage,
  } = useContext(contexto);
  const [sessionsAsGM, setSessionsAsGM] = useState<any[]>([]);
  const [sessionsAsPlayer, setSessionsAsPlayer] = useState<any[]>([]);
  const [sessionsOthers, setSessionsOthers] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

  const organizeSession = (sessionsList: any, email: string) => {
    const gmList = sessionsList.filter(
        (s: any) => s.gameMaster === email
      );

      const playerList = sessionsList.filter(
        (s: any) =>
          s.players && Array.isArray(s.players) && s.players.includes(email)
      );

      const othersList = sessionsList.filter(
        (s: any) =>
          s.gameMaster !== email &&
          (!s.players || !s.players.includes(email))
      );

      setSessionsAsGM(gmList);
      setSessionsAsPlayer(playerList);
      setSessionsOthers(othersList);
  }
  
  useEffect(() => {
    resetPopups();
    setShowData(false);
    const fetchData = async (): Promise<void> => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        const sessionsList = await getSessions();
        const orderedSessions = sessionsList.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        organizeSession(orderedSessions, dataUser.email);
        setShowData(true);
      } else {
        const authData: any = await authenticate(setShowMessage);
        try {
          if (authData && authData.email && authData.displayName) {
            setDataUser({ email: authData.email, displayName: authData.displayName });
            const sessionsList = await getSessions();
            const orderedSessions = sessionsList.sort((a: any, b: any) =>
              a.name.localeCompare(b.name)
            );
            organizeSession(orderedSessions, authData.email);
            setShowData(true);
          } else router.push('/login');
        } catch (error) {
          setShowMessage({ show: true, text: 'Ocorreu um erro ao obter Sessões: ' + error });
        }
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="h-full bg-ritual bg-top bg-cover w-full">
      { 
        showData
        ? <div className="h-full bg-black/90">
            { showMessage.show && <MessageToUser /> }
            <Nav />
            <section className="h-full relative px-2 bg-black/10">
              <div className="pt-6 pb-3 px-5 text-white mt-2 flex flex-col items-center sm:items-start text-justify bg-black/10">
                <h1 className="relative flex items-center justify-between w-full">
                  <div className="flex gap-2 items-center">
                    <span className="pr-2 text-4xl">Sessões</span>
                    <IoIosInformationCircle
                      className="cursor-pointer text-4xl animate-pulse"
                      onClick={() => {
                        setShowInfoSessions(!showInfoSessions);
                        setShowCreateSession(false);
                      }}
                    />
                  </div>
                </h1>
                <hr className="w-10/12 mt-6" />
              </div>
              <div className="flex w-full justify-end mb-5">
                <button
                  type="button"
                  onClick={ () => {
                    setShowCreateSession(true);
                    setShowInfoSessions(false);
                  }}
                  className="px-4 py-2 border rounded-full border-white text-black font-bold flex items-center justify-center cursor-pointer bg-white mr-5 w-full sm:w-40"
                >
                  Nova Sessão
                </button>
              </div>
              <div className="px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3 pb-4 bg-transparent">
                {
                  sessionsAsGM.length > 0 &&
                  <div
                    className="col-span-1 sm:col-span-3 md:col-span-3 text-lg sm:text-xl text-left">
                      Sessões em que você é Narrador:
                    </div>
                }
                {
                  sessionsAsGM.map((session: ISession, index: number) =>
                    <SessionItem key={index} session={ session } />
                  )
                }
                {
                  sessionsAsPlayer.length > 0 &&
                  <div
                    className="col-span-1 sm:col-span-3 md:col-span-3 text-lg sm:text-xl text-left"
                  >
                    Sessões em que você é Jogador:
                  </div>
                }
                {
                  sessionsAsPlayer.map((session: ISession, index: number) =>
                    <SessionItem key={index} session={ session } />
                  )
                }
                {
                  sessionsAsPlayer.length > 0 || sessionsAsGM.length > 0 &&
                  <div className="col-span-1 sm:col-span-3 md:col-span-3 text-lg sm:text-xl text-left">Demais Sessões:</div>
                }
                {
                  sessionsOthers.map((session: ISession, index: number) =>
                    <SessionItem key={index} session={ session } />
                  )
                }
              </div>
              { showInfoSessions && <Info /> }
              { showCreateSession && <CreateSection /> }
              { dataSession.show && <VerifySession /> }
            </section>
          </div>
        : <div className="bg-black/80 h-screen w-full"><Loading /></div>
      }
      <Footer />
    </div>
  );
}