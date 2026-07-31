'use client'
import ConvertToPdf from "@/components/convertToPdf";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import Loading from "@/components/loading";
import MenuPlayer from "@/components/menuPlayer";
import EvaluateSheet from "@/components/popup/evaluateSheet";
import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import firebaseConfig from "@/firebase/connection";
import { collection, doc, getFirestore, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
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
    setDataUser,
    setDataSheet,
    setEmail,
    setName,
    setShowEvaluateSheet,
    setOptionSelect,
    setPlayers,
    setSession,
    setSheetId,
    resetPopups,
    showMessage,
    setShowMessage,
  } = useContext(contexto);
  const [authChecked, setAuthChecked] = useState(false);

  const sheetRef = doc(db, "players", id);
  const [sheetData, sheetLoading] = useDocumentData(sheetRef, { idField: "id" } as any);
  const sessionRef = sheetData?.sessionId ? doc(db, "sessions", sheetData.sessionId) : null;
  const [sessionData] = useDocumentData(sessionRef, { idField: "id" } as any);
  const playersQuery = sheetData?.sessionId
    ? query(collection(db, "players"), where("sessionId", "==", sheetData.sessionId))
    : null;
  const [playersData] = useCollectionData(playersQuery, { idField: "id" } as any);

  const verifyConvert = () => {
    return sheetData ? <ConvertToPdf data={ sheetData.data } /> : null;
  };

  useEffect(() => {
    resetPopups();
    setSheetId(id);
    setOptionSelect('general');
    
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
        setShowMessage({ show: true, text: 'Ocorreu um erro ao obter Fichas: ' + error });
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

  const showData = authChecked && !sheetLoading;

  return(
    <div className="h-screen overflow-hidden bg-ritual bg-cover bg-top">
      { showMessage.show && <MessageToUser /> }
      { showDownloadPdf.show && verifyConvert() }
      {
        showData
        ? <div className="bg-black/80 h-full">
            {
              sheetData
                ? <div className="h-full flex flex-col lg:flex-row gap-0 items-stretch">
                    <div className="w-full lg:flex-1 lg:min-w-0 h-full overflow-auto bg-white relative">
                      {
                        showEvaluateSheet.show
                        ? <EvaluateSheet />
                        : <ConvertToPdf data={ sheetData.data } preview />
                      }
                    </div>
                    <div className="w-full lg:w-[32rem] lg:shrink-0 h-full">
                      <MenuPlayer standalone />
                    </div>
                  </div>
              : <div>Erro ao carregar a ficha</div>
            }
          </div>
        : <div className="h-full w-full bg-black/80">
            <Loading />
          </div>
      }
    </div>
  );
}
