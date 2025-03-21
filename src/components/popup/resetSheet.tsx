'use client'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, playerSheet } from "@/firebase/utilities";
import contexto from "@/context/context";
import { deletePlayerImage } from "@/firebase/storage";
import { registerHistory } from "@/firebase/history";

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

  const resetSheet = async () => {
    try {
      setDataSheet({ ...dataSheet, data: playerSheet });
      const dataPersist = dataSheet.data.name;
      await updateDataPlayer(sheetId, { ...dataSheet, data: playerSheet }, setShowMessage);
      setShowMessage({ show: true, text: "Sua ficha foi redefinida!" });
      setShowResetSheet(false);
      setShowMenuSession('');
      await deletePlayerImage (session.id, sheetId, dataSheet.data.profileImage, setShowMessage);
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} redefiniu a ficha do personagem${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' }.`, type: 'notification' }, null, setShowMessage);
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
      setShowResetSheet(false);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setShowResetSheet(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza que quer redefinir os dados da sua ficha? Absolutamente tudo o que você registrou nela será apagado e ela voltará ao estado inicial de quando você logou pela primeira vez nesta sessão.
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => setShowResetSheet(false) }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não Redefinir
            </button>
            <button
              type="button"
              onClick={ resetSheet }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Redefinir Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}