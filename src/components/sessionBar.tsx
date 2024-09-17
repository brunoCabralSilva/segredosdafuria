'use client'
import { GiD10 } from "react-icons/gi";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { useContext, useState } from 'react';
import contexto from '@/context/context';
import { clearHistory } from '../firebase/sessions';
import { registerMessage } from "../firebase/messagesAndRolls";

export default function SessionBar(props: { gameMaster: boolean}) {
  const { gameMaster } = props;
  const [text, setText] = useState('');
  const {
    sessionId,
    scrollToBottom,
    showOptions, setShowOptions,
    showMenuSession, setShowMenuSession,
  } = useContext(contexto);

  return(
    <div className={`${showMenuSession !== '' ? 'absolute' : 'fixed'} bottom-0 w-full bg-black p-2 flex flex-col gap-2 justify-center items-center min-h-10vh`}>
      { showOptions &&
        <div className="flex items-center justify-end w-full gap-2">
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              title="Realizar um teste com dados"
              onClick={() => {
                setShowMenuSession('dices');
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
                setShowMenuSession('sheet');
                scrollToBottom();
              }}
            >
              <FaFile />
            </button>
          </div>
          { 
            gameMaster &&
              <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                <button
                  className="p-2"
                  title="Apagar o histórico de conversas"
                  onClick={ async () => {
                    try {
                      await clearHistory(sessionId);
                    } catch (error) {
                      window.alert(error)
                    }
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
          onKeyDown={ async (event) => {
            if (event.key === 'Enter' && text !== '' && text !== ' ') {
              await registerMessage(sessionId, { type: 'text', message: text }, null);
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
                  await registerMessage(sessionId, { type: 'text', message: text }, null);
                  setText('');
                  scrollToBottom();
                }
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