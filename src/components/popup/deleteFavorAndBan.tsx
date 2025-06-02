'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { updateSession } from "@/firebase/sessions";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function DeleteFavorAndBan() {
  const {
    email,
    showDeleteFavorAndBan,
    dataSheet,
    sheetId,
    session,
    setShowMessage,
    setShowDeleteFavorAndBan,
  } = useContext(contexto);

  const deleteFavorAndBan = async () => {
    // const findItem = dataSheet.data.favorsAndBans.find((favorAndBan: any) => favorAndBan.order === showDeleteFavorAndBan.name);
    // console.log(findItem);
    if (showDeleteFavorAndBan.type === 'player') {
      dataSheet.data.favorsAndBans = dataSheet.data.favorsAndBans.filter((favorAndBan: any) => favorAndBan.order !== showDeleteFavorAndBan.name);
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      setShowMessage({ show: true, text: 'O Favor / Proibição foi excluído.' });
    } else {
      const newDataSession = session;
      newDataSession.favorsAndBans = newDataSession.favorsAndBans.filter((favorAndBan: any) => favorAndBan.order !== showDeleteFavorAndBan.name);
      await updateSession(newDataSession, setShowMessage);
      setShowMessage({ show: true, text: 'O Favor / Proibição foi excluído.' });
    }
    // await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} excluiu o Favor / Proibição "${showDeleteFavorAndBan.name}" do personagem${dataSheet.data.name !== '' ? ` ${dataSheet.data.name}` : ''}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}.` : '.' }`, type: 'notification' }, null, setShowMessage);
    setShowDeleteFavorAndBan({ show: false, name: '', type: '' });
  };

  return(
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setShowDeleteFavorAndBan({ show: false, name: '', type: '' }) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de que quer apagar este Favor / Proibição?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteFavorAndBan({ show: false, name: '', type: '' }) }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ deleteFavorAndBan }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}