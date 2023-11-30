import { clearMessages, sendMessage } from '@/firebase/chatbot';
import { GiD10 } from "react-icons/gi";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionShowMenuSession, useSlice } from '@/redux/slice';
import { useState } from 'react';

export default function SessionBar(props: any) {
  const { showOptions, setShowOptions, scrollToBottom } = props;
  const [text, setText] = useState('');
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
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
          <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
            <button
              className="p-2"
              onClick={() => {
                scrollToBottom();
                setShowOptions(false);
              }}
              title="Ir para a mensagem mais recente"
            >
              <RxUpdate />
            </button>
          </div>
          { 
            slice.user.role === 'admin'&&
              <div className="text-xl border border-white flex justify-center hover:bg-white transition-colors text-white hover:text-black">
                <button
                  className="p-2"
                  title="Apagar o histórico de conversas"
                  onClick={() => {
                    clearMessages();
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
                sendMessage(text);
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