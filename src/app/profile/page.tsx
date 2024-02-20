'use client'
import { useEffect, useState } from 'react';
import Nav from '@/components/nav';
import { useRouter } from 'next/navigation';
import { authenticate, signIn } from '@/firebase/login';
import Footer from '@/components/footer';
import Image from 'next/image';
import Simplify from '@/components/simplify';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionSessionAuth, useSlice } from '@/redux/slice';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import firebaseConfig from '@/firebase/connection';
import SessionAuth from '../sessions/sessionAuth';

export default function Profile() {
  const [sessionSelected, setSessionSelected] = useState('');
  const [showData, setShowData] = useState(false);
  const [email, setEmail] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [listDmSessions, setListDmSessions] = useState<{id: string, name: string }[]>([]);
  const [listSessions, setListSessions] = useState<{id: string, name: string }[]>([]);
  const router = useRouter();
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    setListDmSessions([]);
    setListSessions([]);
    const profile = async () => {
    const authData: { email: string, name: string } | null = await authenticate();
    if (authData && authData.email && authData.name) {
      const { email, name } = authData;
      setNameUser(name);
      setEmail(email);
      setShowData(true);
        const db = getFirestore(firebaseConfig);
        const sessionsCollectionRef = collection(db, 'sessions');
        const userQuerySnapshot = await getDocs(sessionsCollectionRef);
        let list1: {id: string, name: string }[] = [];
        let list2: {id: string, name: string }[] = [];
        userQuerySnapshot.forEach((doc: any) => {
          const data = doc.data();
          if (data.dm === email) {
              list1.push({ id: doc.id, name: data.name });
          } else {
            data.players.forEach((player: any) => {
              if (player.email === email && data.dm !== email) {
                list2.push({ id: doc.id, name: data.name });
              }
            });
          }
      });
      setListSessions(list2);
      setListDmSessions(list1);
    } else {
      const sign = await signIn();
      if (sign) setShowData(true);
      else {
        window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
        router.push('/');
      }
    }
  }
  profile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-ritual bg-cover bg-top">
      <Nav />
      {
        showData
        ? <div className="w-full bg-ritual bg-cover bg-top relative">
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
            <Simplify />
            <Nav />
            <section className="relative">
              {
                !slice.simplify &&
                <div className="h-40vh relative flex bg-white items-end text-black">
                <Image
                  src={ "/images/25.jpg" }
                  alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
                  className="absolute w-full h-40vh object-cover object-center"
                  width={ 1200 }
                  height={ 800 }
                />
                </div>
              }
              <div className="py-6 sm:px-5 text-white flex flex-col items-center sm:items-start text-justify">
                <h1 className="text-4xl relative">Perfil</h1>
                <hr className="w-10/12 mt-6" />
                <div className="w-full bg-black p-4 mt-6 mb-2">
                  <p className="w-full text-center sm:text-left">Usuário registrado:</p>
                  <p className="w-full text-center sm:text-left text-white font-bold">
                    {nameUser}
                  </p>
                  <p className="pt-5 w-full text-center sm:text-left">Email de cadastro via Google:</p>
                  <p className="w-full text-center sm:text-left text-white font-bold">
                  {email} 
                  </p>
                <p className="w-full text-center sm:text-left pt-6 pb-2">
                  {`${listSessions.length > 0 ? 'Sessões em que você é Jogador (clique para ser redirecionado):' : 'Você não possui sessões onde é um jogador.'}`}
                  </p>
                <div className="pt-3 gap-3 w-full grid sm:grid-cols-2 md:grid-cols-5">
                  {
                    listSessions.map((sessions: any, index: number) => (
                      <button
                        type="button"
                        key={index}
                        className="text-center border-2 border-white bg-black px-4 py-2 rounded-full text-white hover:border-red-800"
                        onClick={
                          () => {
                            setSessionSelected(sessions.id);
                            dispatch(actionSessionAuth({ show: true, id: sessions.id }))
                          }
                        }
                      >
                        { sessions.name }
                      </button>
                    ))
                  }
                </div>
                <p className="w-full text-center sm:text-left pt-6 pb-2">
                  {`${listDmSessions.length > 0 ? 'Sessões em que você é narrador (clique para ser redirecionado):' : 'Você não possui sessões em que é Narrador.'}`}
                </p>
                <div className="gap-3 w-full grid sm:grid-cols-2 md:grid-cols-3 pt-3">
                  {
                    listDmSessions.map((sessions: any, index: number) => (
                      <button
                        type="button"
                        key={index}
                        className="text-center border-2 border-white bg-black px-4 py-2 rounded-full text-white hover:border-red-800 break-all"
                        onClick={
                          () => {
                            setSessionSelected(sessions.id);
                            dispatch(actionSessionAuth({ show: true, id: sessions.id }))
                          }
                        }
                      >
                        { sessions.name }
                      </button>
                    ))
                  }
                </div>
                </div>
              </div>
            </section>
          </div>
        : <div className="bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
      <Footer />
      { slice.sessionAuth.show ? <SessionAuth /> : '' }
    </div>
  );
}