'use client'
import Footer from "@/components/footer";
import Nav from '@/components/nav';
import { useContext, useEffect, useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { authenticate } from "@/firebase/authenticate";
import contexto from "@/context/context";
import Info from "../../components/info";
import Loading from "../../components/loading";
import VerifySession from "../../components/popup/verifySession";
import MessageToUser from "@/components/dicesAndMessages/messageToUser";
import { addNewSheetMandatory, getSheetsByEmail } from "@/firebase/players";
import { sheetStructure } from "@/firebase/utilities";
import SheetItem from "./sheetItem";

export default function Sessions() {
  const router = useRouter();
  const {
    showInfoSessions, setShowInfoSessions,
    dataSession,
    dataUser, setDataUser,
    resetPopups,
    showMessage, setShowMessage,
  } = useContext(contexto);
  const [sheetList, setSheetList] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);
  const [creatingSheet, setCreatingSheet] = useState(false);

  const getCurrentBrazilDateTimeString = () => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return formatter.format(new Date());
  };

  const refreshSheets = async (userEmail: string) => {
    const sheets = await getSheetsByEmail(userEmail);
    setSheetList(sheets);
  };

  const createSheet = async () => {
    if (creatingSheet) return;

    setCreatingSheet(true);
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

      const creationDate = getCurrentBrazilDateTimeString();
      const sheet = sheetStructure(authUser.email, authUser.displayName, creationDate);
      const sheetId = await addNewSheetMandatory('', sheet, setShowMessage);
      await refreshSheets(authUser.email);
      setShowMessage({ show: true, text: 'Ficha criada com sucesso!' });
      if (sheetId) {
        router.push(`/sheets/${sheetId}`);
      }
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro ao criar a Ficha: ' + error });
    } finally {
      setCreatingSheet(false);
    }
  };

  
  useEffect(() => {
    resetPopups();
    setShowData(false);
    const fetchData = async (): Promise<void> => {
      if (dataUser.email !== '' && dataUser.displayName !== '') {
        await refreshSheets(dataUser.email);
        setShowData(true);
      } else {
        try {
          const authData: any = await authenticate(setShowMessage);
          if (authData && authData.email && authData.displayName) {
            setDataUser({ email: authData.email, displayName: authData.displayName });
            await refreshSheets(authData.email);
            setShowData(true);
          } else router.push('/login');
        } catch (error) {
          setShowMessage({ show: true, text: 'Ocorreu um erro ao obter Fichas: ' + error });
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
                    <span className="pr-2 text-4xl">Fichas</span>
                    {/* <IoIosInformationCircle
                      className="cursor-pointer text-4xl animate-pulse"
                      onClick={() => {
                        setShowInfoSessions(!showInfoSessions);
                        setShowCreateSession(false);
                      }}
                    /> */}
                  </div>
                </h1>
                <hr className="w-10/12 mt-6" />
              </div>
              <div className="flex w-full justify-end mb-3 sm:mb-5 px-4 sm:px-0">
                <button
                  type="button"
                  onClick={ () => {
                    setShowInfoSessions(false);
                    createSheet();
                  }}
                  className="px-4 py-2 border-2 rounded-xl border-black text-black font-bold flex items-center justify-center cursor-pointer bg-white sm:mr-5 w-full sm:w-40 hover:border-white transition-colors duration-400 hover:underline"
                >
                  { creatingSheet ? 'Criando...' : 'Nova Ficha' }
                </button>
              </div>
              <div className="px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3 pb-4 bg-transparent">
                {
                  sheetList.map((sheet: any, index: number) =>
                    <SheetItem key={index} sheet={ sheet } />
                  )
                }
              </div>              
              { showInfoSessions && <Info /> }
              { dataSession.show && <VerifySession /> }
            </section>
          </div>
        : <div className="bg-black/80 h-screen w-full"><Loading /></div>
      }
      <Footer />
    </div>
  );
}
