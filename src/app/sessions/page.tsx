'use client'
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Simplify from "@/components/simplify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionInfoSessions, actionSaveUserData, actionSessionAuth, useSlice } from "@/redux/slice";
import { useEffect, useState } from "react";
import { IoIosInformationCircle, IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import SessionAuth from "./sessionAuth";
import { authenticate, signIn, signOutFirebase } from "@/firebase/login";
import PopupInfo from "@/components/sheet/popup/popupInfo";
import { getAllSessions } from "@/firebase/sessions";
import { ISessions } from "@/interface";

export default function Session() {
  const [sessions, setSessions] = useState<any[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    setShowData(false);
    const fetchData = async (): Promise<void> => {
      const authData = await authenticate();
      try {
        if (authData && authData.email && authData.name) {
          dispatch(actionSaveUserData({ email: authData.email, name: authData.name, dm: false }));
          setShowData(true);
          const sessionsList = await getAllSessions();
          setSessions(sessionsList);
          setShowData(true);
        } else {
          await signOutFirebase();
          const sign = await signIn();
          if (!sign) {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          } else {
            const authData = await authenticate();
            if (authData && authData.email && authData.name) {
              dispatch(actionSaveUserData({ email: authData.email, name: authData.name, dm: false }));
              setShowData(true);
            } else {
              window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
              router.push('/');
            }
          }
        } 
      } catch (error) {
        window.alert('Ocorreu um erro ao obter Sessões: ' + error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="bg-ritual bg-top bg-cover w-full">
      { 
        showData
        ? <div className="bg-black/80 h-full">
          <Simplify />
          <Nav />
          <section className="relative px-2 h-screen overflow-y-auto">
            <div className="py-6 px-5 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
              <h1 className="text-4xl relative flex items-center">
                <span className="pr-2">Sessões</span>
                <IoIosInformationCircle
                  className="cursor-pointer"
                  onClick={ () => dispatch(actionInfoSessions(true)) }
                />
              </h1>
              <hr className="w-10/12 mt-6" />
            </div>
            
            <div className="px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
              <button
                type="button"
                onClick={ () => router.push('/sessions/create') }
                className="p-2 border-2 border-white text-white flex items-center justify-center h-28 cursor-pointer bg-black/80"
              >
                <IoMdAdd className="text-4xl" />
              </button>
              {
                sessions.map((session: ISessions, index: number) =>
                <button
                  type="button"
                  onClick={
                    () => {
                      dispatch(actionSessionAuth({ show: true, id: session.id }))
                    }}
                    key={ index }
                    className="p-2 px-4 border-2 border-white text-white flex items-center justify-center h-28 cursor-pointer bg-black/80 capitalize"
                  >
                    { session.name }
                  </button>
                )
              }
            </div>
          </section>
          </div>
        : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
      { slice.sessionAuth.show ? <SessionAuth /> : '' }
      { slice.popupInfo && <PopupInfo /> }
      <Footer />
    </div>
  );
}