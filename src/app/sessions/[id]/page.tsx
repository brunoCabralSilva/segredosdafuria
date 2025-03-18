'use client'
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useCollection, useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import Loading from "../../../components/loading";
import Nav from '@/components/nav';
import SessionBar from "../../../components/sessionBar";
import Message from "@/components/dicesAndMessages/message";
import MenuPlayer from "@/components/menuPlayer";
import MenuRoll from "@/components/dicesAndMessages/menuRoll";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { getPlayersBySession } from "@/firebase/players";
import { getSessionById } from "@/firebase/sessions";
import firestoreConfig from "@/firebase/connection";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import DeleteHistoric from "@/components/popup/deleteHistoric";
import RemovePlayer from "@/components/popup/removePlayer";
import ResetPlayer from "@/components/popup/resetPlayer";
import AddTouchstone from "@/components/popup/addTouchstone";
import DeleteTouchstone from "@/components/popup/deleteTouchstone";
import EvaluateSheet from "@/components/popup/evaluateSheet";
import ConvertToPdf from "@/components/convertToPdf";
import AddPrinciple from "@/components/popup/addPrinciple";
import DeletePrinciple from "@/components/popup/deletePrinciple";
import AddFavorAndBan from "@/components/popup/addFavorAndBan";
import DeleteFavorAndBan from "@/components/popup/deleteFavorAndBan";
import SheetSelector from "@/components/popup/sheetSelector";
import EditImage from "@/components/popup/editImage";
import ConsentForm from "@/components/popup/consentForm";

export default function SessionId() {
	const params = useParams();
  const id = params?.id as string;
  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "chats");
  const queryData = query(dataRef, where("sessionId", "==", id));
  const [chat] = useCollectionData(queryData, { idField: "id" } as any);
  
  const router = useRouter();
	const [showData, setShowData] = useState(false);
	const [gameMaster, setGameMaster] = useState(false);
  const {
    setName,
    sheetId,
    setEmail,
    setSessionId,
    resetPopups,
    setPlayers,
    setSession,
    dataSheet, setDataSheet,
    showMessage, setShowMessage,
    showSelectSheet, setShowSelectSheet,
    addFavorAndBan,
    showDeleteFavorAndBan,
    addTouchstone,
    showRemovePlayer,
    showResetPlayer,
    showDeleteHistoric,
    showDeleteTouchstone,
    addPrinciple,
    showDeletePrinciple,
    showEvaluateSheet,
    showConsentForm,
    email,
    showMenuSession,
    showDownloadPdf,
  } = useContext(contexto);

  const dataRefPlayer = collection(db, "players");
  const queryDataPlayer = query(dataRefPlayer, where("sessionId", "==", id));
  const [snapshot, loading] = useCollection(queryDataPlayer);
  useEffect(() => {
    if (snapshot) {
      const dataWithId = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(dataWithId);
      if (sheetId !== '') {
        setDataSheet(dataWithId.find((dataId: any) => dataId.id === sheetId));
      }
    }
  }, [snapshot]);

  const dataRefSession = doc(db, "sessions", id);
  const [dataSession, loadingSession] = useDocumentData(dataRefSession, { idField: "id" } as any);

  useEffect(() => {
    if (dataSession && !loadingSession) setSession(dataSession);
  }, [dataSession, loadingSession, email, setSession]);

  useEffect(() => {
    resetPopups();
    setSessionId(id);
    setShowData(false);
    verifyUser();
    // returnValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyUser = async () => {
    const authData: any = await authenticate(setShowMessage);
    if (authData && authData.email && authData.displayName) {
      setEmail(authData.email);
      setName(authData.displayName);
      const dataDocSnapshot = await getDocs(queryData);
      if (dataDocSnapshot.empty) {
        setShowMessage({ show: true, text: 'A Sessão não foi encontrada' });
        router.push('/sessions');
      } else {
        setShowData(true);
        if (authData.email === 'yslasouzagnr@gmail.com') setShowMessage({ show: true, text: 'Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3' });
        const sessionData: any = await getSessionById(id);
        if (sessionData) {
          const players = await getPlayersBySession(id, setShowMessage);
          if (sessionData.gameMaster === authData.email) setGameMaster(true);
          else if (players.find((player: any) => player === authData.email)) {
            setGameMaster(false);
            setShowSelectSheet(true);
          } else {
            setShowMessage({ show: true, text: 'você não é autorizado a estar nesta sessão. Solicite a aprovação do narrador clicando na Sessão em questão.' });
            router.push('/sessions');
          }          
          setShowData(true);
        } else {
          setShowMessage({ show: true, text: 'Houve um erro ao encontrar a sessão. Por favor, atualize e tente novamente' });
          router.push('/sessions');
        }
      }
    } else router.push('/login');
  };
  
  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  const verifyConvert = () => {
    return <ConvertToPdf data={ dataSheet.data } />;
  }

  return (
    <div className="h-screen overflow-y-auto bg-ritual bg-cover bg-top">
      { showSelectSheet && <SheetSelector /> }
      { showMessage.show && <MessageToUser /> }
      { showDeleteHistoric && <DeleteHistoric /> }
      { showResetPlayer.show && <ResetPlayer /> }
      { showRemovePlayer.show && <RemovePlayer /> }
      { addTouchstone.show && <AddTouchstone /> }
      { showDeleteTouchstone.show && <DeleteTouchstone /> }
      { addPrinciple.show && <AddPrinciple /> }
      { showDeletePrinciple.show && <DeletePrinciple /> }
      { addFavorAndBan.show && <AddFavorAndBan /> }
      { showDeleteFavorAndBan.show && <DeleteFavorAndBan /> }
      { showDownloadPdf.show && verifyConvert() }
      <Nav />
      {
        showData
        ? <div className="flex bg-black/80">
            {
              showEvaluateSheet.show
              ? <EvaluateSheet />
              : showConsentForm ?
                <ConsentForm />
                : <div className="flex flex-col w-full relative">
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
                <SessionBar />
              </div>
            }
            {
              showMenuSession === 'edit-image' && 
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                <EditImage />
              </div>
            }
            {
              showMenuSession === 'dices' &&
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                <MenuRoll />
              </div>
            }
            { showMenuSession === 'sheet' && <MenuPlayer /> }
          </div>
        : <div className="h-full w-full bg-black/80">
            <Loading />
          </div>
      }
    </div>
  );
}