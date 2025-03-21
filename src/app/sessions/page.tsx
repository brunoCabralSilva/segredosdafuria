'use client'
import Footer from "@/components/footer";
import Nav from '@/components/nav';
import { useContext, useEffect, useState } from "react";
import { IoIosInformationCircle, IoMdAdd } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { authenticate } from "@/firebase/authenticate";
import { ISessions } from "@/interface";
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
                    className=" border-2 border-white text-white h-28 cursor-pointer bg-ritual bg-cover capitalize"
                    >
                      <div className="w-full h-full bg-black/60 p-2 px-4 flex flex-col items-center justify-center font-bold">
                        <Image
                          src="/images/gifts/Dons Nativos.png"
                          alt="Glifo de um lobo"
                          className="w-12 relative object-contain mb-2"
                          width={35}
                          height={400}
                        />
                        { session.name }
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