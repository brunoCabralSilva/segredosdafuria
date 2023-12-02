'use client'
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Simplify from "@/components/simplify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionSessionAuth, useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import firestoreConfig from '../../firebase/connection';
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import SessionAuth from "./sessionAuth";

interface ISessions {
  name: string;
  description: string;
  dm: string;
  creationDate: Date;
  anotations: string;
  chat: any[],
  image: string;
};

export default function Session() {
  const [sessions, setSessions] = useState<any[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getAllSessions = async () => {
      try {
        const db = getFirestore(firestoreConfig);
        const collectionRef = collection(db, 'sessions');
        const querySnapshot = await getDocs(collectionRef);
        const sessionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSessions(sessionsList);
      } catch (error) {
        window.alert('Erro ao obter sessões: ' + error);
      }
    };
    getAllSessions();
  }, []);

  return(
    <div className="bg-ritual bg-top bg-cover w-full">
      <div className="bg-black/80 h-full">
        <Simplify />
        <Nav />
        <section className="relative px-2">
          <div className="h-40vh relative flex bg-white items-end text-black">
            <Image
              src={ "/images/84.png" }
              alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
              className="absolute w-full h-40vh object-contain object-top"
              width={ 1200 }
              height={ 800 }
            />
          </div>
          <div className="py-6 px-5 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
            <h1 className="text-4xl relative">Sessões</h1>
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
                    () => dispatch(actionSessionAuth({ show: true, name: session.name }))
                  }
                  key={ index }
                  className="p-2 px-4 border-2 border-white text-white flex items-center justify-center h-28 cursor-pointer bg-black/80"
                >
                  { session.name }
                </button>
              )
            }
          </div>
        </section>
        { slice.sessionAuth.show ? <SessionAuth /> : '' }
      </div>
      <Footer />
    </div>
  );
}