'use client'

import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, playerSheet } from "@/firebase/utilities";
import { useContext } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export default function ResetSheet() {
  const {
    email,
    sheetId,
    session,
    dataSheet,
    setDataSheet,
    setShowMessage,
    setShowResetSheet,
    setShowMenuSession,
  } = useContext(contexto);

  const closePopup = () => {
    setShowResetSheet(false);
  };

  const resetSheet = async () => {
    try {
      setDataSheet({ ...dataSheet, data: playerSheet });
      await updateDataPlayer(sheetId, { ...dataSheet, data: playerSheet }, setShowMessage);
      setShowMessage({ show: true, text: 'Sua ficha foi redefinida!' });
      setShowResetSheet(false);
      setShowMenuSession('');
      await registerHistory(
        session.id,
        {
          message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} redefiniu a ficha do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : ''}.`,
          type: 'notification',
        },
        null,
        setShowMessage,
      );
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro: ' + error });
      setShowResetSheet(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 text-white backdrop-blur-[3px] sm:px-6">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-500/40 bg-zinc-950/85">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/wallpapers/128.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 text-2xl text-white/70 transition-colors hover:text-red-400"
          aria-label="Fechar redefinição de ficha"
        >
          <AiFillCloseCircle />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8 flex flex-col items-end w-full">
          <h2 className="w-full text-left mt-2 font-kingthings text-xl">Limpar Ficha</h2>
          <p className="mt-2 w-full text-left font-geist-mono text-xs leading-6 text-white/75 sm:text-[13px]">
            Tem certeza de que quer redefinir os dados da sua ficha? Absolutamente tudo o que foi registrado nela será apagado e ela voltará ao estado inicial
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
            <button
              type="button"
              onClick={closePopup}
              className="inline-flex items-center justify-center border border-zinc-500/40 bg-black/60 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:border-white/40 hover:bg-black/80"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={resetSheet}
              className="inline-flex items-center justify-center border border-red-950 bg-red-950 px-4 py-3 font-geist-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-900"
            >
              Redefinir Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
