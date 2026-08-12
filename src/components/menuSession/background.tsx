'use client'
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function Background(props: { type: string }) {
  const { type } = props;
  const [textArea, setTextArea] = useState<boolean>(false);
  const { sheetId, session, email, dataSheet, setShowMessage } = useContext(contexto);
  const sheetData = dataSheet?.data;
  const [text, setText] = useState<string>("");

  const isBackground = type === 'background';
  const title = isBackground ? 'História do Personagem' : 'Anotações do Personagem';
  const historyLabel = isBackground ? 'História do personagem' : 'Anotações do personagem';
  const contentBoxClass = 'principles-scrollbar mt-3 w-full border border-white/10 bg-black px-4 py-3 font-geist-mono text-[10px] leading-5 tracking-[0.05em] text-white/78 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]';
  const textAreaClass = 'principles-scrollbar mt-3 w-full border border-white/10 bg-black px-4 py-3 font-geist-mono text-[10px] leading-5 tracking-[0.05em] text-white/78 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]';

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/[ \t]+/g, ' ');
    setText(sanitizedValue);
  };

  useEffect(() => {
    setText(String(sheetData?.[type] || ''));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSheet, type]);

  const updateValue = async () => {
    if (dataSheet && sheetData) {
      const dataItem = dataSheet;
      dataItem.data[type] = text;
      await updateDataPlayer(sheetId, dataItem, setShowMessage);
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} atualizou o Background do personagem${sheetData.name !== '' ? ` ${sheetData.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.'}`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
    } else {
      setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
    }
  };

  return (
    <section className="visage-card relative mt-5 w-full overflow-hidden border border-[#708578]/40 bg-[#090d0e]/95 text-slate-300 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <div>
          <p onClick={() => setTextArea(true)} className="cursor-pointer font-kingthings text-[0.82rem] uppercase tracking-[0.26em] text-red-500/85">
            {title}
          </p>
          <p className="mt-1 font-geist-mono text-[9px] uppercase tracking-[0.08em] text-white/55">
            {isBackground ? 'Passado, contexto e memória do personagem' : 'Registros livres da sessão e da ficha'}
          </p>
        </div>
        <button
          type="button"
          onClick={(e: any) => {
            e.stopPropagation();
            if (textArea) {
              updateValue();
              setTextArea(false);
            } else setTextArea(true);
          }}
          className="sheet-readonly-action inline-flex items-center justify-center border border-red-950 bg-red-950 p-2 font-geist-mono text-lg uppercase text-white transition-colors hover:bg-red-900"
          aria-label={`Editar ${historyLabel}`}
        >
          {
            textArea ?
            <BsCheckSquare /> :
            <FaRegEdit />
          }
        </button>
      </div>
      <div className="mx-6 border-b border-white/10" />
      <div className="px-6 pb-5 pt-3">
        {textArea ? (
          <textarea
            className={`${contentBoxClass} min-h-[46vh] resize-none outline-none transition-colors hover:border-red-700/70 focus:border-red-700/70`}
            value={text}
            onChange={(e) => typeText(e)}
          />
        ) : (
          <div
            className={`${contentBoxClass} min-h-[32vh] cursor-pointer whitespace-pre-line ${!text ? 'flex items-center justify-center text-white/38 uppercase tracking-[0.08em]' : ''}`}
            onClick={() => setTextArea(true)}
          >
            {text || `${title} ainda não preenchida.`}
          </div>
        )}
        {!isBackground && <div className="mt-4 border-b border-white/10" />}
      </div>
    </section>
  );
}