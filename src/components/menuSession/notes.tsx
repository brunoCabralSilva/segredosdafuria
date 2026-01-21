'use client'
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function Notes(props: { type: string }) {
  const { type } = props;
  const [textArea, setTextArea] = useState<boolean>(false);
  const { sheetId, session, email, dataSheet, setShowMessage } =  useContext(contexto);
  const [text, setText] = useState<string>('');

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/[ \t]+/g, ' ');
    setText(sanitizedValue);
  };

  useEffect(() => {
    setText(dataSheet.data[type]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSheet]);

  const updateValue = async () => {
    if (dataSheet) {
      const dataItem = dataSheet;
      dataItem.data[type] = text;
			await updateDataPlayer(sheetId, dataItem, setShowMessage);
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} atualizou o Background do personagem${dataSheet.data.name !== '' ? ` ${dataSheet.data.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.' }`, type: 'notification' }, null, setShowMessage);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
  };

  return(
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold ">
        <div className="mt-1 p-2 flex justify-between items-center ">
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
            className="text-white bg-black font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full mb-5 whitespace-pre-line"
            value={ text }
            onChange={(e) => typeText(e)}
          />
          : <div
              className={`text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 whitespace-pre-line ${text && text.length < 720 && 'h-full'} ${!text && 'h-full'} cursor-pointer mb-5`}
              onClick={() => setTextArea(true)} 
            >
            { text }
          </div>
        }
      </div>
    </div>
  );
}