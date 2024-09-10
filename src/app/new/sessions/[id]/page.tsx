'use client'
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firestoreConfig from '../../../../firebase/connection';
import { useRouter } from "next/navigation";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import Loading from "../../../../new/components/loading";
import { authenticate } from "@/new/firebase/authenticate";
import Nav from "@/components/nav";
import SessionBar from "../../../../new/components/sessionBar";
import contexto from "@/context/context";
import Message from "@/new/components/message";
import MenuPlayer from "@/new/components/popup/menuPlayer";
import MenuGameMaster from "@/new/components/popup/menuGameMaster";
import MenuRoll from "@/new/components/popup/menuRoll";
import { getSessionById } from "@/new/firebase/sessions";
import { getPlayerByEmail, getPlayersBySession } from "@/new/firebase/players";

export default function SessionId({ params } : { params: { id: string } }) {
	const { id } = params;
  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "chats");
  const queryData = query(dataRef, where("sessionId", "==", id));
  const [chat] = useCollectionData(queryData, { idField: "id" } as any);


  const router = useRouter();
	const [showData, setShowData] = useState(false);
	const [gameMaster, setGameMaster] = useState(false);
  const [dataSession, setDataSession] = useState({});
  const {
    setDataSheet,
    setName,
    setEmail,
    email,
    showMenuSession,
    setSessionId,
  } = useContext(contexto);
	
  const returnValues = async () => {
    const auth = await authenticate();
    if (auth) {
      const player: any = await getPlayerByEmail(id, auth.email);
      if (player) setDataSheet(player.data);
    }
  };

  useEffect(() => {
    setSessionId(id);
    setDataSession({ show: false, id: '' });
    setShowData(false);
    verifyUser();
    returnValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyUser = async () => {
    const authData: any = await authenticate();
    if (authData && authData.email && authData.displayName) {
      setEmail(authData.email);
      setName(authData.displayName);
      const dataDocSnapshot = await getDocs(queryData);
      if (dataDocSnapshot.empty) {
        window.alert('A Sessão não foi encontrada');
        router.push('/new/sessions');
      } else {
        setShowData(true);
        if (authData.email === 'yslasouzagnr@gmail.com') window.alert('Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3');
        const sessionData: any = await getSessionById(id);
        if (sessionData) {
          setDataSession(sessionData);
          const players = await getPlayersBySession(id);
          if (sessionData.gameMaster === authData.email) setGameMaster(true);
          else if (players.find((player: any) => player.email === authData.email)) {
            setGameMaster(false);
          } else {
            window.alert('você não é autorizado a estar nesta sessão. Solicite a aprovação do narrador clicando na Sessão em questão.');
            router.push('/new/sessions');
          }          
          setShowData(true);
        } else {
          window.alert('Houve um erro ao encontrar a sessão. Por favor, atualize e tente novamente');
          router.push('/new/sessions');
        }
      }
    } else router.push('/new/login');
  };
  
  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  return (
    <div className="h-screen overflow-y-auto bg-ritual bg-cover bg-top">
      <Nav />
      {
        showData
        ? <div className="flex bg-black/80">
            <div className="flex flex-col w-full relative">
              <div id="messages-container" className={`relative h-90vh overflow-y-auto pt-2 px-2`}>
                {
                  chat
                  && chat.length > 0
                  && chat[0].list
                  && chat[0].list.length >= 0
                  ? chat[0]
                    && chat[0].list
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((msg: any, index: number) => {
                        if (email !== '' && email === msg.email) {
                          return (<Message key={index} dataMessage={msg} color="green" />);
                        } return (<Message key={index} dataMessage={msg} color="gray" />);
                      })
                  : <div className="bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
                      <Loading />
                    </div>
                }
              </div>
              <SessionBar gameMaster={gameMaster} />
            </div>
            {
              showMenuSession === 'dices' &&
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                <MenuRoll gameMaster={gameMaster} />
              </div>
            }
            {
              showMenuSession === 'sheet' && 
                <div className="w-full md:w-3/5 absolute sm:relative z-50">
                {
                 gameMaster 
                  ? <MenuGameMaster />
                  : <MenuPlayer />
                }
                </div>
            }
          </div>
        : <div className="h-screen w-full bg-black/80">
            <Loading />
          </div>
      }
      {/* { slice.popupResetSheet && <PopupResetSheet /> }
      { slice.deleteHistoric && <PopupDelHistoric /> } */}
    </div>
  );
}