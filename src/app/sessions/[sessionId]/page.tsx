'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionSessionAuth, actionShowMenuSession, useSlice } from '@/redux/slice';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, documentId, getDocs, getFirestore, query, where } from 'firebase/firestore';
import firestoreConfig from '../../../firebase/connection';
import { IGenerateDataRolls, IMsn } from '@/interface';
import Nav from '@/components/nav';
import PopUpDices from '@/components/popUpDices';
import PopUpSheet from '@/components/popUpSheet';
import Message from './message';
import { generateDataRoll } from './functions';
import Dice from './dice';
import SessionBar from './sessionBar';
import { useRouter } from 'next/navigation';
import MenuDm from '@/components/MenuDm';
import firebaseConfig from '../../../firebase/connection';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import ManualRoll from '@/components/manualRoll';
import PopupResetSheet from '@/components/popupResetSheet';
import PopupDelHistoric from '@/components/popupDelHistoric';
import { authenticate, signIn } from '@/firebase/login';

export default function Chat({ params } : { params: { sessionId: string } }) {
  const [dataSession, setDataSession] = useState<any>({ name: '' });
  const slice = useAppSelector(useSlice);
  const db = getFirestore(firestoreConfig);
  const [email, setEmail] = useState('');
  const sessionRef = collection(db, "sessions");
  const querySession = query(sessionRef, where(documentId(), "==", params.sessionId));
  const [session] = useCollectionData(querySession, { idField: "id" } as any);
  const [showData, setShowData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [dm, setDm] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(actionSessionAuth({ show: false, id: ''}));
    setShowData(false);
        
    const verifyUser = async () => {
      const sessionDocSnapshot = await getDocs(querySession);
      if (sessionDocSnapshot.empty) {
        console.log('aqui');
        router.push('/sessions');
        window.alert('A Sessão não foi encontrada');
      }
      else {
        const sessionData = sessionDocSnapshot.docs[0].data();
        const authData: { email: string, name: string } | null = await authenticate();
        if (authData && authData.email && authData.name) {
          setShowData(true);
          const { email } = authData;
          setEmail(email);
          if (email === 'yslasouzagnr@gmail.com') window.alert('Espero que o tempo passe\nEspero que a semana acabe\nPra que eu possa te ver de novo\nEspero que o tempo voe\nPara que você retorne\nPra que eu possa te abraçar\nTe beijar de novo\n<3');
          if (sessionData.name) {
            setShowData(true);
            setDataSession(sessionData);
            if(sessionData.dm === email || sessionData.players.find((player: any) => player.email === email)) {
              if(sessionData.dm === email) setDm('master');
              else setDm('player');
            } else {
              window.alert('você não é autorizado a estar nesta sessão. Solicite a aprovação do narrador clicando na Sessão em questão.');
              router.push('/sessions');
            }
          } else {
            window.alert('Houve um erro ao encontrar a sessão. Por favor, atualize e tente novamente');
            router.push('/sessions');
          }
        } else {
          const sign = await signIn();
          if (sign) setShowData(true);
          else {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          }
        }
      }
    }
    verifyUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const messagesContainer: HTMLElement | null = document.getElementById('messages-container');
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const messageData = (msn: IMsn) => {
    if (typeof msn === 'string') {
      return ( <div className="px-2 break-words">{ msn }</div> );
    }
    const rollDices: IGenerateDataRolls = generateDataRoll(msn);
    if (msn.rollOfMargin) {
      return(
        <div className="p-2">
          <div className="p-2 flex gap-1 flex-wrap">
            {
              msn.rollOfRage.sort((a, b) => a - b).map((dice, index) => (
                <Dice key={ index } dice={ dice } type="(rage)" />
              ))
            }
            {
              msn.rollOfMargin.sort((a, b) => a - b).map((dice, index) => (
                <Dice key={ index } dice={ dice } type="" />
              ))
            }
          </div>
          <div>
            {
              rollDices.falhaBrutal
              ? rollDices.sucessosParaDano >= 0
                ? <Message rollDices={ rollDices } msn={ msn } type="success-rage" />
                : <Message rollDices={ rollDices } msn={ msn } type="fail" />
              : rollDices.sucessosParaDano >= 0
                ? <Message rollDices={ rollDices } msn={ msn } type="success" />
                : <Message rollDices={ rollDices } msn={ msn } type="fail" />
            }
          </div>
        </div>
      );
    }
    return <Message rollDices={ rollDices } msn={ msn } type="rage-check" />
  };

  const returnDate = (msg: any) => {
    const data = new Date(msg.date);
    const formatoData = `${`${data.getDate() < 10 ? 0 : ''}${data.getDate()}`}/${`${data.getMonth() < 10 ? 0 : ''}${data.getMonth() + 1}`}/${data.getFullYear()}`;
    const formatoHora = `${data.getHours() === 0 ? 0 : ''}${data.getHours()}:${data.getMinutes() < 10 ? 0: ''}${data.getMinutes()}:${data.getSeconds() < 10 ? 0 : ''}${data.getSeconds()}`;
    return `${formatoHora}, ${formatoData}`;
  }

  const messageForm = (index: number, msg: any, color: string, justify: string) => {
    return(
      <div key={index} className={`w-full flex ${justify === 'end' ? 'justify-end' : 'justify-start' } text-white`}>
        <div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2`}>
          {
            color === 'gray' &&
            <div className="pl-2 pb-2 capitalize font-bold">
              { msg.user }
            </div>
          }
          <div>
            { messageData(msg.message) }
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-full text-right text-sm flex justify-end">
                { msg.date && returnDate(msg) }
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
                showOptions={showOptions}
                setShowOptions={setShowOptions}
                scrollToBottom={scrollToBottom}
                sessionName={dataSession.name}
              />
            </div>
            { 
              slice.showMenuSession === 'dices' &&
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                {
                  dm === 'master' &&
                    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
                    <div className="w-full mb-3 flex justify-end">
                      <IoIosCloseCircleOutline
                        className="text-4xl text-white cursor-pointer"
                        onClick={() => dispatch(actionShowMenuSession(''))}
                      />
                    </div>
                    <ManualRoll session={ dataSession.name } />
                  </div>
                }
                {
                  dm === 'player' && <PopUpDices session={ dataSession.name } />
                }
              </div>
            }
            {
              slice.showMenuSession === 'sheet' && 
                <div className="w-full md:w-3/5 absolute sm:relative z-50">
                { dm === 'master' && <MenuDm sessionId={ params.sessionId } /> }
                { dm === 'player' && <PopUpSheet session={ dataSession.name } /> }
                </div>
            }
          </div>
        : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
    { slice.popupResetSheet && <PopupResetSheet sessionId={ params.sessionId } /> }
    { slice.deleteHistoric && <PopupDelHistoric sessionId={ params.sessionId } /> }
    </div>
  );
}
