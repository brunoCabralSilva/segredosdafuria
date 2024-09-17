'use client'
import Footer from "@/components/footer";
import Nav from '@/components/nav';
import { useContext, useEffect, useState } from "react";
import { IoIosInformationCircle, IoMdAdd } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { authenticate } from "@/firebase/authenticate";
import { ISessions } from "@/interface";
import CreateSection from "../../components/createSection";
import { getSessions } from "@/firebase/sessions";
import contexto from "@/context/context";
import Info from "../../components/info";
import Loading from "../../components/loading";
import VerifySession from "../../components/popup/verifySession";

export default function Sessions() {
  const router = useRouter();
  const {
    showInfoSessions, setShowInfoSessions,
    showCreateSession, setShowCreateSession,
    dataSession, setDataSession,
    dataUser, setDataUser,
  } = useContext(contexto);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);
  
  useEffect(() => {
    setDataSession({ show: false, id: '' });
    setShowData(false);
    const fetchData = async (): Promise<void> => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        const sessionsList = await getSessions();
        setSessions(sessionsList);
        setShowData(true);
      } else {
        const authData: any = await authenticate();
        try {
          if (authData && authData.email && authData.displayName) {
            setDataUser({ email: authData.email, displayName: authData.displayName });
            const sessionsList = await getSessions();
            setSessions(sessionsList);
            setShowData(true);
          } else router.push('/login');
        } catch (error) {
          window.alert('Ocorreu um erro ao obter Sessões: ' + error);
        }
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className={`${!showInfoSessions && !showCreateSession && 'h-screen'} bg-ritual bg-top bg-cover w-full`}>
      { 
        showData
        ? <div className="h-full bg-black/80">
            <Nav />
            <section className="relative px-2 overflow-y-auto bg-black/10">
              <div className="py-6 px-5 text-white mt-2 flex flex-col items-center sm:items-start text-justify bg-black/10">
                <h1 className="text-4xl relative flex items-center">
                  <span className="pr-2">Sessões</span>
                  <IoIosInformationCircle
                    className="cursor-pointer"
                    onClick={() => {
                      setShowInfoSessions(!showInfoSessions);
                      setShowCreateSession(false);
                    }}
                  />
                </h1>
                <hr className="w-10/12 mt-6" />
              </div>
              { 
                !showInfoSessions
                && !showCreateSession
                &&
                <div className="px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4 bg-transparent">
                  <button
                    type="button"
                    onClick={ () => {
                      setShowCreateSession(true);
                      setShowInfoSessions(false);
                    }}
                    className="p-2 border-2 border-white text-white flex items-center justify-center h-28 cursor-pointer bg-black/80"
                  >
                    <IoMdAdd className="text-4xl" />
                  </button>
                  {
                    sessions.map((session: ISessions, index: number) =>
                    <button
                      type="button"
                      key={ index }
                      onClick={ () => setDataSession({ show: true, id: session.id })}
                      className="p-2 px-4 border-2 border-white text-white flex items-center justify-center h-28 cursor-pointer bg-black/80 capitalize"
                      >
                        { session.name }
                      </button>
                    )
                  }
                </div>
              }
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