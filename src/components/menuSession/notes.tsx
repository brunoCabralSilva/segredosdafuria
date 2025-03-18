'use client'
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { updateSession } from "@/firebase/sessions";

export default function Notes(props: { type: string }) {
  const { type } = props;
  const [textArea, setTextArea] = useState<boolean>(false);
  const { session, setShowMessage } =  useContext(contexto);
  const [text, setText] = useState<string>('');

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  useEffect(() => {
    if (session.anotations) setText(session.anotations);
  }, [session]);

  const updateValue = async () => {
    const dataSession = session;
    dataSession.anotations = text;
    await updateSession(dataSession, setShowMessage);
  };

  return(
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <div className="mt-1 p-2 flex justify-between items-center">
          <div
            className="text-white mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
            onClick={
              () => {
                setTextArea(true);
              }
            }
          >
            { type === 'background' ? 'História do Personagem' : 'Anotações do Personagem' }
          </div>
          { 
            textArea
              ? <BsCheckSquare
                  onClick={(e: any) => {
                    updateValue();
                    setTextArea(false);
                    e.stopPropagation();
                  }}
                  className="text-3xl text-white cursor-pointer"
                />
              : <FaRegEdit
                  onClick={(e: any) => {
                    setTextArea(true);
                    e.stopPropagation();
                  }}
                  className="text-3xl text-white cursor-pointer" />
          }
        </div>
          { 
            textArea ?
            <textarea
              className="text-white bg-black font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full"
              value={ text }
              onChange={(e) => typeText(e)}
            />
            : <div
              className={`text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 ${text.length < 720 && 'h-full'} cursor-pointer mb-5`}
                onClick={() => setTextArea(true)} 
              >
              { text }
            </div>
          }
      </div>
    </div>
  );
}