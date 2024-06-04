'use client'
import { sendMessage } from '@/firebase/chatbot';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { GiD10 } from "react-icons/gi";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionDelHistoric, actionShowMenuSession, useSlice } from '@/redux/slice';
import { useEffect, useState } from 'react';
import firebaseConfig from '../../../firebase/connection';

export default function SessionBar(props: any) {
  const { showOptions, setShowOptions, scrollToBottom, sessionId } = props;
  const [text, setText] = useState('');
  const [dm, setDm] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    setDm(false);
    analyzeDm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeDm = async () => {
    const db = getFirestore(firebaseConfig);
    const sessionRef = doc(db, "sessions", sessionId);
    const result: any = await getDoc(sessionRef);
    if (result.exists()) {
      const dmEmail: string = result.data().dm;
      if (dmEmail === slice.userData.email) setDm(true);
    }
  };

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
                scrollToBottom();
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
                scrollToBottom();
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
                    scrollToBottom();
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage(text, slice.sessionId, slice.userData);
              setText('');
              scrollToBottom();
            }
          }}
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
                sendMessage(text, slice.sessionId, slice.userData);
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
              onClick={() => {
                setShowOptions(!showOptions);
                scrollToBottom();
              }}
            >
              {showOptions? <FaAngleDown /> : <FaPlus /> }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}