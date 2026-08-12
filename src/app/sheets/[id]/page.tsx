'use client'
import ConvertToPdf from "@/components/convertToPdf";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import Loading from "@/components/loading";
import General from "@/components/menuSession/general";
import EvaluateSheet from "@/components/popup/evaluateSheet";
import GiftRoll from "@/components/gifts/giftRoll";
import RitualRoll from "@/components/rituals/ritualRoll";
import RageTest from "@/components/popup/rageTest";
import WillpowerTest from "@/components/popup/willpowerTest";
import HaranoHauglosk from "@/components/popup/haranoHauglosk";
import AddTouchstone from "@/components/popup/addTouchstone";
import DeleteTouchstone from "@/components/popup/deleteTouchstone";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import firebaseConfig from "@/firebase/connection";
import { collection, doc, getFirestore, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

export default function SheetId() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const db = getFirestore(firebaseConfig);
  const {
    dataUser,
    showDownloadPdf,
    showEvaluateSheet,
    showGiftRoll,
    showRitualRoll,
    showRageTest,
    showWillpowerTest,
    showHarano,
    showHauglosk,
    addTouchstone,
    showDeleteTouchstone,
    setDataUser,
    setDataSheet,
    setEmail,
    setName,
    setPlayers,
    setSession,
    setSheetId,
    resetPopups,
    showMessage,
    setShowMessage,
  } = useContext(contexto);
  const [authChecked, setAuthChecked] = useState(false);

  const sheetRef = doc(db, 'players', id);
  const [sheetData, sheetLoading] = useDocumentData(sheetRef, { idField: 'id' } as any);
  const sessionRef = sheetData?.sessionId ? doc(db, 'sessions', sheetData.sessionId) : null;
  const [sessionData] = useDocumentData(sessionRef, { idField: 'id' } as any);
  const playersQuery = sheetData?.sessionId
    ? query(collection(db, 'players'), where('sessionId', '==', sheetData.sessionId))
    : null;
  const [playersData] = useCollectionData(playersQuery, { idField: 'id' } as any);

  const showData = authChecked && !sheetLoading;
  const generalSessionData = useMemo(() => {
    if (sessionData) return sessionData;
    if (!sheetData) return null;

    return {
      id: sheetData.sessionId || '',
      gameMaster: sheetData.email,
      typeSession: 'Regras Oficiais',
      name: '',
    };
  }, [sessionData, sheetData]);

  const verifyConvert = () => {
    return sheetData ? <ConvertToPdf data={sheetData.data} /> : null;
  };

  useEffect(() => {
    resetPopups();
    setSheetId(id);

    const verifyUser = async () => {
      try {
        let authUser = dataUser;

        if (authUser.email === '' || authUser.displayName === '') {
          const authData: any = await authenticate(setShowMessage);
          if (!authData || !authData.email || !authData.displayName) {
            router.push('/login');
            return;
          }

          authUser = { email: authData.email, displayName: authData.displayName };
          setDataUser(authUser);
        }

        setEmail(authUser.email);
        setName(authUser.displayName);
        setAuthChecked(true);
      } catch (error) {
        setShowMessage({ show: true, text: 'Ocorreu um erro ao obter fichas: ' + error });
      }
    };

    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sheetData) return;

    setDataSheet(sheetData);

    if (!sheetData.sessionId) {
      setPlayers([sheetData]);
      setSession({
        id: '',
        gameMaster: sheetData.email,
        typeSession: 'Regras Oficiais',
        name: '',
      });
    }
  }, [sheetData, setDataSheet, setPlayers, setSession]);

  useEffect(() => {
    if (sessionData) setSession(sessionData);
  }, [sessionData, setSession]);

  useEffect(() => {
    if (playersData) setPlayers(playersData);
  }, [playersData, setPlayers]);

  return (
    <div className="h-screen overflow-hidden bg-ritual bg-cover bg-top">
      {showMessage.show && <MessageToUser />}
      {showDownloadPdf.show && verifyConvert()}
      {showEvaluateSheet.show && <EvaluateSheet />}
      {showGiftRoll.show && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            <GiftRoll />
          </div>
        </div>
      )}
      {showRitualRoll.show && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            <RitualRoll />
          </div>
        </div>
      )}
      {(showRageTest || showWillpowerTest || showHarano || showHauglosk) && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div className="w-full max-w-sm">
            {showRageTest ? <RageTest /> : showWillpowerTest ? <WillpowerTest /> : showHarano ? <HaranoHauglosk type="Harano" /> : <HaranoHauglosk type="Hauglosk" />}
          </div>
        </div>
      )}
      {addTouchstone.show && <AddTouchstone />}
      {showDeleteTouchstone.show && <DeleteTouchstone />}
      {showData ? (
        <div className="h-full bg-black/80">
          {sheetData && generalSessionData ? (
            <div className="h-full w-full overflow-hidden">
              <General
                dataSession={generalSessionData}
                id={sheetData.sessionId || ''}
                gameMaster={generalSessionData.gameMaster === dataUser.email}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-white">Erro ao carregar a ficha</div>
          )}
        </div>
      ) : (
        <div className="h-full w-full bg-black/80">
          <Loading />
        </div>
      )}
    </div>
  );
}
