'use client'
import { BsCheckSquare } from "react-icons/bs";
import {  updateDoc } from "firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";

export default function Notes(props: { type: string }) {
  const { type } = props;
  const [textArea, setTextArea] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const slice = useAppSelector(useSlice);

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setText(player.data[type]);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const updateValue = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      player.data[type] = text;
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      returnValue();
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
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
              className="text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full cursor-pointer"
              onClick={() => setTextArea(true)} 
            >
            { text }
          </div>
        }
      </div>
    </div>
  );
}