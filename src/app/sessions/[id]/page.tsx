'use client'
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useCollection, useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import Loading from "../../../components/loading";
import MenuRoll from "@/components/dicesAndMessages/menuRoll";
import Nav from "@/components/nav";
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
import ConvertToPdf from "@/components/convertToPdf";
import AddPrinciple from "@/components/popup/addPrinciple";
import DeletePrinciple from "@/components/popup/deletePrinciple";
import AddFavorAndBan from "@/components/popup/addFavorAndBan";
import DeleteFavorAndBan from "@/components/popup/deleteFavorAndBan";
import SheetSelector from "@/components/popup/sheetSelector";
import EditBannerSession from "@/components/popup/editBannerSession";
import RerollWithWillpower from "@/components/popup/rerollWithWillpower";
import Maps from "@/components/menuSession/maps";
import Battle from "@/components/menuSession/battle";
import Chat from "@/components/menuSession/chat";
import Relationships from "@/components/menuSession/relationships";
import Details from "@/components/menuSession/details";
import Consent from "@/components/menuSession/consent";
import Principles from "@/components/menuSession/principles";
import Notifications from "@/components/menuSession/notifications";
import History from "@/components/menuSession/history";
import General from "@/components/menuSession/general";
import { GiD10, GiThreeFriends } from "react-icons/gi";
import { LuSwords } from "react-icons/lu";
import { FaFileAlt, FaHistory, FaRegMap } from "react-icons/fa";
import { GoLaw } from "react-icons/go";
import { MdOutlineDoubleArrow, MdOutlineSecurity } from "react-icons/md";
import { IoIosHelpCircle, IoMdSettings } from "react-icons/io";
import { IoChatbubbles, IoNotifications } from "react-icons/io5";
import Help from "@/components/popup/help";
import RageTest from "@/components/popup/rageTest";
import WillpowerTest from "@/components/popup/willpowerTest";
import HaranoHauglosk from "@/components/popup/haranoHauglosk";
import GiftRoll from "@/components/gifts/giftRoll";
import RitualRoll from "@/components/rituals/ritualRoll";

export default function SessionId() {
  const params = useParams();
  const id = params?.id as string;
  const db = getFirestore(firestoreConfig);
  const dataRef = collection(db, "chats");
  const queryData = query(dataRef, where("sessionId", "==", id));

  const router = useRouter();
  const [showData, setShowData] = useState(false);
  const [gameMaster, setGameMaster] = useState(false);
  const [showSessionChat, setShowSessionChat] = useState<boolean>(true);
  const [showSessionGeneral, setShowSessionGeneral] = useState<boolean>(false);
  const [showSessionDetails, setShowSessionDetails] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSessionConsent, setShowSessionConsent] = useState<boolean>(false);
  const [showSessionHistory, setShowSessionHistory] = useState<boolean>(false);
  const [showSessionNotifications, setShowSessionNotifications] = useState<boolean>(false);
  const [showSessionPrinciples, setShowSessionPrinciples] = useState<boolean>(false);
  const [showSessionSidebar, setShowSessionSidebar] = useState<boolean>(true);
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
    email,
    showRelationshipMap,
    setShowRelationshipMap,
    showMaps,
    setShowMaps,
    showBattle,
    setShowBattle,
    showMenuSession,
    showRageTest,
    showHarano,
    showHauglosk,
    showWillpowerTest,
    setShowMenuSession,
    showDownloadPdf,
    showBannerSession,
    showGiftRoll,
    showRitualRoll,
    rerollWithWillPower,
    setListNotification,
  } = useContext(contexto);

  const dataRefPlayer = collection(db, "players");
  const queryDataPlayer = query(dataRefPlayer, where("sessionId", "==", id));
  const [snapshot, loading] = useCollection(queryDataPlayer);
  const dataRefNotifications = collection(db, "notifications");
  const queryNotifications = query(dataRefNotifications, where("sessionId", "==", id));
  const [notifications] = useCollectionData(queryNotifications, { idField: "id" } as any);
  useEffect(() => {
    if (notifications) {
      const allLists = notifications.flatMap((notification: any) => notification.list || []);
      setListNotification(allLists);
    }
  }, [notifications, setListNotification]);

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
        setShowMessage({ show: true, text: 'A Sessão foi encontrada' });
        router.push('/sessions');
      } else {
        setShowData(true);
        if (authData.email === 'yslasouzagnr@gmail.com') setShowMessage({ show: true, text: 'Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3' });
        const sessionData: any = await getSessionById(id);
        if (sessionData) {
          const players = await getPlayersBySession(id, setShowMessage);
          if (sessionData.gameMaster === authData.email || authData.email == 'bruno.cabral.silva2018@gmail.com') setGameMaster(true);
          else if (players.find((player: any) => player === authData.email)) {
            setGameMaster(false);
            setShowSelectSheet(true);
          } else {
            setShowMessage({ show: true, text: 'Você não é o narrador da sessão' });
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

  const verifyConvert = () => {
    return <ConvertToPdf data={dataSheet.data} />;
  }

  const clearSessionMenuView = () => {
    setShowMenuSession('');
  };

  const clearSessionMainArea = () => {
    setShowSessionHistory(false);
    setShowSessionNotifications(false);
    setShowSessionPrinciples(false);
  };

  const sidebarIconsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncSidebarIconsScroll = () => {
      const sidebarIcons = sidebarIconsRef.current;
      if (!sidebarIcons) return;
      sidebarIcons.scrollTop = sidebarIcons.scrollHeight;
    };

    syncSidebarIconsScroll();
    window.addEventListener("resize", syncSidebarIconsScroll);

    return () => window.removeEventListener("resize", syncSidebarIconsScroll);
  }, []);

  useEffect(() => {
    const handleOpenSessionChat = () => {
      setShowRelationshipMap({ show: false, data: "" });
      setShowMaps({ show: false, data: "" });
      setShowBattle({ show: false, data: "" });
      setShowSessionGeneral(false);
      setShowSessionDetails(false);
      setShowSessionConsent(false);
      setShowHelp(false);
      clearSessionMainArea();
      clearSessionMenuView();
      setShowSessionChat(true);
    };

    window.addEventListener('session:open-chat', handleOpenSessionChat);

    return () => window.removeEventListener('session:open-chat', handleOpenSessionChat);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ritual bg-cover bg-top">
      {showSelectSheet && <SheetSelector />}
      {showMessage.show && <MessageToUser />}
      {showDeleteHistoric && <DeleteHistoric />}
      {showResetPlayer.show && <ResetPlayer />}
      {showRemovePlayer.show && <RemovePlayer />}
      {addTouchstone.show && <AddTouchstone />}
      {showDeleteTouchstone.show && <DeleteTouchstone />}
      {addPrinciple.show && <AddPrinciple />}
      {showDeletePrinciple.show && <DeletePrinciple />}
      {addFavorAndBan.show && <AddFavorAndBan />}
      {showDeleteFavorAndBan.show && <DeleteFavorAndBan />}
      {showDownloadPdf.show && verifyConvert()}
      {showBannerSession.show && <EditBannerSession />}
      {rerollWithWillPower.show && <RerollWithWillpower />}
      {/* <Nav /> */}
      {
        showData
          ? <div className="flex h-screen flex-1 bg-black/80">
            <div className="flex h-full min-h-0 flex-1">
              {
                showRelationshipMap.show ? <Relationships /> : showMaps.show ? <Maps /> : showBattle.show ? <Battle /> : showSessionGeneral ? <General dataSession={ dataSession } id={ id } gameMaster={ gameMaster } /> : showSessionDetails ? <Details /> : showSessionConsent ? <Consent /> : showSessionPrinciples ? <Principles variant="session" /> : showSessionNotifications ? <Notifications /> : showSessionHistory ? <History /> : showSessionChat ? <Chat /> : showHelp ? <Help /> : <div className="h-full w-full bg-black/60" />}
              <div className="relative h-full shrink-0">
                <button
                  className="absolute right-full top-3 z-[80] flex h-12 w-8 items-center justify-center rounded-l-full pl-2 border-r-0 bg-gray-whats-dark text-2xl text-white transition hover:bg-gray-700"
                  title={showSessionSidebar ? "Ocultar barra lateral" : "Exibir barra lateral"}
                  onClick={() => setShowSessionSidebar((current) => !current)}
                >
                  <MdOutlineDoubleArrow className={showSessionSidebar ? "rotate-0" : "rotate-180"} />
                </button>
                {showSessionSidebar && <div className="h-full w-14 shrink-0 bg-gray-whats-dark flex flex-col items-center py-3">
                  <div className="w-full shrink-0 flex justify-center">
                    <Nav compact />
                  </div>
                  <div ref={sidebarIconsRef} className="principles-scrollbar mt-3 h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
                    <div className="flex w-full h-full flex-col items-center justify-between gap-1">
                      <button
                        className="p-2 text-2xl"
                        title="Histórico"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionHistory(true);
                        }}
                      >
                        <FaHistory />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Notificações"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionNotifications(true);
                        }}
                      >
                        <IoNotifications />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Sistema e Mecânica"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowSessionNotifications(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowHelp(true);
                        }}
                      >
                        <IoIosHelpCircle />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Detalhes da Sessão"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionDetails(true);
                        }}
                      >
                        <IoMdSettings />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Ficha de Consentimento"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionConsent(true);
                        }}
                      >
                        <MdOutlineSecurity />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Princí­pios da Crônica"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionPrinciples(true);
                        }}
                      >
                        <GoLaw />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Mapa de Relacionamentos"
                        onClick={() => {
                          setShowRelationshipMap({ show: true, data: id });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                        }}
                      >
                        <GiThreeFriends />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Mapa da Crônica"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: true, data: id });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                        }}
                      >
                        <FaRegMap />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Modo Combate"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: true, data: id });
                          setShowSessionChat(false);
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                        }}
                      >
                        <LuSwords />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Realizar um teste com dados"
                        onClick={() => setShowMenuSession('dices')}
                      >
                        <GiD10 />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Ficha de Personagem"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionChat(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          setShowHelp(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionGeneral(true);
                        }}
                      >
                        <FaFileAlt />
                      </button>
                      <button
                        className="p-2 text-2xl"
                        title="Chat da Sessão"
                        onClick={() => {
                          setShowRelationshipMap({ show: false, data: "" });
                          setShowMaps({ show: false, data: "" });
                          setShowBattle({ show: false, data: "" });
                          setShowSessionGeneral(false);
                          setShowSessionDetails(false);
                          setShowSessionConsent(false);
                          clearSessionMainArea();
                          clearSessionMenuView();
                          setShowSessionChat(true);
                        }}
                      >
                        <IoChatbubbles />
                      </button>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
          </div>
          : <div className="flex h-screen flex-1 items-center justify-center bg-black/80">
            <Loading />
          </div>
      }
      {
        showMenuSession === 'dices' &&
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="h-full w-full max-w-sm">
            <MenuRoll dataSession={ dataSession } id={ id } gameMaster={ gameMaster } />
          </div>
        </div>
      }
      {
        (showRageTest || showWillpowerTest || showHarano || showHauglosk) &&
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            {showRageTest ? <RageTest /> : showWillpowerTest ? <WillpowerTest /> : showHarano ? <HaranoHauglosk type="Harano" /> : <HaranoHauglosk type="Hauglosk" />}
          </div>
        </div>
      }
      {
        showGiftRoll.show &&
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            <GiftRoll />
          </div>
        </div>
      }
      {
        showRitualRoll.show &&
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            <RitualRoll />
          </div>
        </div>
      }
    </div>
  );
}



