'use client'
import { sendMessage } from '@/firebase/chatbot';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { GiD10 } from "react-icons/gi";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionDelHistoric, actionShowMenuSession, useSlice } from '@/redux/slice';
import { useEffect, useState } from 'react';
import firestoreConfig from '../../../firebase/connection';
import { authenticate, signIn } from '@/firebase/login';
import { useRouter } from 'next/navigation';

export default function SessionBar(props: any) {
  const { showOptions, setShowOptions, scrollToBottom, sessionName } = props;
  const [text, setText] = useState('');
  const [dm, setDm] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    setDm(false);
    const analyzeDm = async () => {
      try {
        const authData: { email: string, name: string } | null = await authenticate();
        if (authData && authData.email && authData.name) {
          const { email } = authData;
          const db = getFirestore(firestoreConfig);
          const sessionRef = collection(db, "sessions");
          const querySession = query(sessionRef, where("name", "==", sessionName));
          const resultado: any = await getDocs(querySession);
          const players: any = [];
          resultado.forEach((doc: any) => players.push(...doc.data().players));
          let dmEmail: string = '';
          resultado.forEach((doc: any) => dmEmail = doc.data().dm);
          if (dmEmail === email) setDm(true);
        } else {
          const sign = await signIn();
          if (!sign) router.push('/');
        }
      } catch(error) {
        setDm(false);
      }
    };
    analyzeDm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className={`${slice.showMenuSession !== '' ? 'absolute' : 'fixed'} bottom-0 w-full bg-black p-2 flex flex-col gap-2 justify-center items-center min-h-10vh`}>
      { showOptions &&
        <div className="flex items-center justify-end w-full gap-2">
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Realizar um teste com dados"
              onClick={() => {
                dispatch(actionShowMenuSession('dices'));
                setShowOptions(false);
              }}
            >
              <GiD10 />
            </button>
          </div>
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Acessar a sua ficha"
              onClick={() => {
                setShowOptions(false);
                dispatch(actionShowMenuSession('sheet'))
              }}
            >
              <FaFile />
            </button>
          </div>
          { 
            dm &&
              <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                <button
                  className="p-2"
                  title="Apagar o histórico de conversas"
                  onClick={() => {
                    dispatch(actionDelHistoric(true))
                    setShowOptions(false);
                  }}
                >
                  <FaEraser />
                </button>
              </div>
          }
        </div>
      }
      <div className="flex w-full items-end relative">
        <textarea
          rows={Math.max(1, Math.ceil(text.length / 40))}
          className="w-full p-2 text-black"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
            setText(sanitizedValue);
          }}                  
        />
        <div className="pl-2 gap-2 flex">
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Enviar uma mensagem"
              onClick={() => {
                sendMessage(text, sessionName);
                setText('');
                scrollToBottom();
              }}
            >
              <IoIosSend />
            </button>
          </div>
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Enviar uma mensagem"
              onClick={() => setShowOptions(!showOptions)}
            >
              {showOptions? <FaAngleDown /> : <FaPlus /> }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}