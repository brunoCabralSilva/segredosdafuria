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
import Image from "next/image";

export default function Sessions() {
  const router = useRouter();
  const {
    showInfoSessions, setShowInfoSessions,
    showCreateSession, setShowCreateSession,
    dataSession, setDataSession,
    dataUser, setDataUser,
    resetPopups,
    showMessage, setShowMessage,
  } = useContext(contexto);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

  const resumeSinopse = (text: string) => {
    const totalLength = 220;
    if (text.length > totalLength) return text.slice(0, totalLength) + '...';
    return text.slice(0, totalLength);
  }
  
  useEffect(() => {
    resetPopups();
    setShowData(false);
    const fetchData = async (): Promise<void> => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        const sessionsList = await getSessions();
        setSessions(sessionsList);
        setShowData(true);
      } else {
        const authData: any = await authenticate(setShowMessage);
        try {
          if (authData && authData.email && authData.displayName) {
            setDataUser({ email: authData.email, displayName: authData.displayName });
            const sessionsList = await getSessions();
            setSessions(sessionsList);
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
    <div className="h-screen bg-ritual bg-top bg-cover w-full">
      { 
        showData
        ? <div className="h-full bg-black/80">
            { showMessage.show && <MessageToUser /> }
            <Nav />
            <section className="h-full relative px-2 overflow-y-auto bg-black/10">
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
                  className="px-4 py-2 border rounded-full border-white text-black font-bold flex items-center justify-center cursor-pointer bg-white mr-5"
                >
                  Nova Sessão
                </button>
              </div>
              <div className="px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3 pb-4 bg-transparent">
                {
                  sessions.map((session: ISession, index: number) =>
                  <button
                    type="button"
                    key={ index }
                    onClick={ () => setDataSession({ show: true, id: session.id })}
                    className="border border-white text-white cursor-pointer bg-ritual bg-cover capitalize rounded-xl"
                    >
                      <div className="w-full h-full bg-black/90 font-bold rounded-xl">
                        <div className="flex items-center justify-center w-full">
                          <Image
                            src={`/images/sessions/${ session.imageName}.png` }
                            alt="Glifo de um lobo"
                            className="w-full h-32 relative object-cover object-center mb-2 rounded-t-xl"
                            width={1000}
                            height={1000}
                          />
                        </div>
                        <div className="w-full pb-8 px-8 pt-4">
                          <p className="text-left">{ session.name }</p>
                          <div className="w-full pt-1 pb-2">
                            <hr />
                          </div>
                          <p className="text-sm font-normal text-justify">
                            Narrador: { session.nameMaster }
                          </p>
                          <p className="text-sm font-normal text-justify">
                            Jogadores: { session.players.length }
                          </p>
                          <p className="text-sm font-normal text-justify">
                            Data de Criação: { session.creationDate.toString() }
                          </p>
                          <p className="text-sm font-normal text-justify">
                            Sinopse: { resumeSinopse(session.description) }
                          </p>
                        </div>
                      </div>
                    </button>
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