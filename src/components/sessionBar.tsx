'use client'
import { IoIosSend } from "react-icons/io";
import { FaEraser } from "react-icons/fa";
import { FaChevronDown, FaFile, FaPlus } from "react-icons/fa6";
import { useContext, useState } from 'react';
import contexto from '@/context/context';
import { registerMessage } from "../firebase/messagesAndRolls";
import { GiD10 } from "react-icons/gi";
import { CiFileOn } from "react-icons/ci";

export default function SessionBar() {
  const [text, setText] = useState('');
  const [menu, setMenu] = useState(false);
  const {
    sessionId,
    session,
    email,
    setShowDeleteHistoric,
    scrollToBottom,
    setShowMessage,
    showMenuSession, setShowMenuSession,
  } = useContext(contexto);

  return(
    <div className={`${showMenuSession !== '' ? 'absolute' : 'fixed'} bottom-0 w-full bg-black p-2 flex flex-col gap-2 justify-center items-center min-h-10vh`}>
      {
        menu &&
        <div className="bg-black flex w-full justify-end gap-2">
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Realizar um teste com dados"
              onClick={() => {
                setShowMenuSession('dices');
                scrollToBottom();
              }}
            >
              <GiD10 />
            </button>
          </div>
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Acessar o Menu da Sessão"
              onClick={() => {
                setShowMenuSession('sheet');
                scrollToBottom();
              }}
            >
              <FaFile className="" />
            </button>
          </div>
          { 
            session.gameMaster === email &&
            <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
              <button
                className="p-2"
                title="Apagar o histórico de conversas"
                onClick={ async () => {
                  setShowDeleteHistoric(true);
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
          onKeyDown={ async (event) => {
            if (event.key === 'Enter' && text !== '' && text !== ' ') {
              await registerMessage(sessionId, { type: 'text', message: text }, null, setShowMessage);
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
              onClick={ async () => {
                if (text !== '' && text !== ' ') {
                  await registerMessage(sessionId, { type: 'text', message: text }, null, setShowMessage);
                  setText('');
                  scrollToBottom();
                }
              }}
            >
              <IoIosSend />
            </button>
          </div>
          {
            showMenuSession === '' &&
            <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
              <button
                className="p-2"
                title="Acessar o Menu da Sessão"
                onClick={() => {
                  setMenu(!menu);
                  scrollToBottom();
                }}
              >
                {
                  menu
                  ? <FaChevronDown />
                  : <FaPlus />
                }
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}