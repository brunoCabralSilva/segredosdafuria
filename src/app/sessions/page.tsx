'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionShowMenuSession, useSlice } from '@/redux/slice';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, orderBy, limit, getFirestore, query } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { jwtDecode } from 'jwt-decode';
import { IGenerateDataRolls, IMsn } from '@/interface';
import Nav from '@/components/nav';
import PopUpDices from '@/components/popUpDices';
import PopUpSheet from '@/components/popUpSheet';
import { verify } from '../../firebase/user';
import { testToken } from '@/firebase/token';
import Message from './message';
import { generateDataRoll } from './functions';
import Dice from './dice';
import SessionBar from './sessionBar';

export default function Chat() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const db = getFirestore(firestoreConfig);
  const messageRef = collection(db, "chatbot");
  const queryMessages = query(messageRef, orderBy("date"), limit(25));
  const [messages] = useCollectionData(queryMessages, { idField: "id" } as any);
  const [showData, setShowData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setShowData(false);
    dispatch(actionShowMenuSession(''));
    window.scrollTo(0, 0);
    setShowData(testToken());
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

  const messageForm = (index: number, msg: any, color: string, justify: string) => {
    console.log('atualizou');
    return(
      <div key={index} className={`w-full flex ${justify === 'end' ? 'justify-end' : 'justify-start' } text-white`}>
        <div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2`}>
          <div>
            { messageData(msg.message) }
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-full text-right text-sm">
                { msg.date && msg.date.toDate().toLocaleString() }
              </span>
            </div>
        </div>
      </div>
    );
  }

  return (
    showData && (
      <div className="h-screen overflow-y-auto bg-ritual">
        <Nav />
        <div className="flex bg-black/80">
          <div className="flex flex-col w-full relative">
            <div id="messages-container" className={`relative h-90vh overflow-y-auto pt-2 px-2`}>
              {
                messages && messages.length >= 0
                ? messages && messages.map((msg, index) => {
                    const token = localStorage.getItem('Segredos Da Fúria');
                    if (token) {
                      const decodedToken = verify(JSON.parse(token));
                      let decode = { email: '' };
                      if (decodedToken) decode = jwtDecode(token);
                      if (token && decode.email !== '' && decode.email === msg.email) {
                        return messageForm(index, msg, 'green', 'end');
                      }
                      return messageForm(index, msg, 'gray', 'start');
                    } return null;
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
            />
          </div>
          { 
            slice.showMenuSession === 'dices' &&
            <div className="w-full md:w-3/5 absolute sm:relative z-50">
              <PopUpDices />
            </div>
          }
          {
            slice.showMenuSession === 'sheet' && 
              <div className="w-full md:w-3/5 absolute sm:relative z-50">
                <PopUpSheet />
              </div>
          }
        </div>
      </div>
    )
  );
}
