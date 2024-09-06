'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IGenerateDataRolls } from '@/interface';
import { generateDataRoll } from './functions';
import { useRouter } from "next/navigation";
import { authenticate } from "@/new/firebase/authenticate";
import { actionSaveUserData, actionSessionAuth, actionSessionId, useSlice } from '@/redux/slice';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, documentId, getDocs, getFirestore, query, where } from 'firebase/firestore';
import firestoreConfig from '../../../firebase/connection';
import Nav from '@/components/nav';
import PopUpDices from '@/components/sheet/popup/popUpDices';
import PopUpSheet from '@/components/sheet/popup/popUpSheet';
import Message from './message';
import SessionBar from './sessionBar';
import MenuDm from '@/components/MenuDm';
import PopupResetSheet from '@/components/sheet/popup/popupResetSheet';
import PopupDelHistoric from '@/components/sheet/popup/popupDelHistoric';
import BasicMessage from './basicMessage';
import MessageWithRoll from './messageWithRoll';

export default function SessionId({ params } : { params: { sessionId: string } }) {
  const [dataSession, setDataSession] = useState<any>({ name: '' });
  const db = getFirestore(firestoreConfig);
  const sessionRef = collection(db, "sessions");
  const querySession = query(sessionRef, where(documentId(), "==", params.sessionId));
  const [session] = useCollectionData(querySession, { idField: "id" } as any);

  const [email, setEmail] = useState('');
  const [showData, setShowData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [dm, setDm] = useState('');

  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  useEffect(() => {
    dispatch(actionSessionAuth({ show: false, id: ''}));
    setShowData(false);
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyUser = async () => {
    const sessionDocSnapshot = await getDocs(querySession);
    if (sessionDocSnapshot.empty) {
      router.push('/sessions');
      window.alert('A Sessão não foi encontrada');
    }
    else {
      const sessionData = sessionDocSnapshot.docs[0].data();
      const authData: any = await authenticate();
      if (authData && authData.email && authData.displayName) {
        setShowData(true);
        setEmail(authData.email);
        if (authData.email === 'yslasouzagnr@gmail.com') window.alert('Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3');
        if (sessionData.name) {
          setShowData(true);
          setDataSession(sessionData);
          if(sessionData.dm === authData.email || sessionData.players.find((player: any) => player.email === authData.email)) {
            if(sessionData.dm === authData.email) {
              setDm('master');
              dispatch(actionSaveUserData({ email: authData.email, name: authData.displayName, dm: true }));
              dispatch(actionSessionId(params.sessionId));
            }
            else {
              setDm('player');
              dispatch(actionSaveUserData({ email: authData.email, name: authData.displayName, dm: false }));
              dispatch(actionSessionId(params.sessionId));
            }
          } else {
            window.alert('você não é autorizado a estar nesta sessão. Solicite a aprovação do narrador clicando na Sessão em questão.');
            router.push('/sessions');
          }
        } else {
          window.alert('Houve um erro ao encontrar a sessão. Por favor, atualize e tente novamente');
          router.push('/sessions');
        }
      } else router.push('/login');
    }
  }
  
  useLayoutEffect(() => {
    const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const messageData = (msn: any) => {
    if (typeof msn === 'string') {
      return ( <div className="px-2 break-words">{ msn }</div> );
    }
    if (msn.action && msn.roll === 'false') {
      return (
        <section className="mb-2 relative min-h-screen">
          <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 text-white border-2 border-white relative">
            <BasicMessage msn={msn} />
          </article>
        </section>
      );
    }
    
    const rollDices: IGenerateDataRolls = generateDataRoll(msn);
    if (msn.action && msn.roll === 'true') {
      return (
        <section className="mb-2 relative min-h-screen">
          <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 text-white border-2 border-white relative">
            <BasicMessage msn={msn} />
            <MessageWithRoll msn={msn} rollDices={rollDices} />
          </article>
        </section>
      );
    }
    if (msn.rollOfMargin) {
      return(<MessageWithRoll msn={msn} rollDices={rollDices} />);
    }
    return <Message rollDices={ rollDices } msn={ msn } type="rage-check" />
  };

  const messageForm = (index: number, msg: any, color: string, justify: string) => {
    console.log(msg);
    if (msg.user === 'notification') {
      return(
        <div key={index} className="my-3 w-full flex justify-center text-gray-400">
          <div className="bg-gray-whats text-sm text-center rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2">
            { messageData(msg.message) }
            { msg.date && msg.date }
          </div>
        </div>
      )
    }
    return(
      <div key={index} className={`w-full flex ${justify === 'end' ? 'justify-end' : 'justify-start' } text-white`}>
        <div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2`}>
          {
            color === 'gray' &&
            <div className="pl-2 pb-2 capitalize font-bold flex items-center gap-2">
              { msg.user }
            </div>
          }
          <div>
            { messageData(msg.message) }
          </div>
          <div className="flex justify-end pt-2">
            <span className="w-full text-right text-sm flex justify-end">
              { msg.date && msg.date }
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-ritual bg-cover bg-top">
      <Nav />
      {
        showData
        ? <div className="flex bg-black/80">
            <div className="flex flex-col w-full relative">
              <div id="messages-container" className={`relative h-90vh overflow-y-auto pt-2 px-2`}>
                {
                  session && session.length > 0 && session[0].chat && session[0].chat.length >= 0
                  ? session[0] && session[0].chat.map((msg: any, index: number) => {
                    if (email !== '' && email === msg.email) {
                      return messageForm(index, msg, 'green', 'end');
                    } return messageForm(index, msg, 'gray', 'start');
                  })
                  : <div className="bg-black/60 text-white h-90vh flex items-center justify-center flex-col">
                      <span className="loader z-50" />
                    </div>
                }
              </div>
              <SessionBar
                sessionId={params.sessionId}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
                scrollToBottom={scrollToBottom}
                sessionName={dataSession.name}
              />
            </div>
            { 
              slice.showMenuSession === 'dices' &&
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                <PopUpDices session={ dataSession.name } type={dm} />
              </div>
            }
            {
              slice.showMenuSession === 'sheet' && 
                <div className="w-full md:w-3/5 absolute sm:relative z-50">
                { dm === 'master' && <MenuDm sessionId={ params.sessionId } /> }
                { dm === 'player' && <PopUpSheet /> }
                </div>
            }
          </div>
        : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
      { slice.popupResetSheet && <PopupResetSheet /> }
      { slice.deleteHistoric && <PopupDelHistoric /> }
    </div>
  );
}