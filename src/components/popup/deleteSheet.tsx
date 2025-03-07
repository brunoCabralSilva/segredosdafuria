'use client'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { deleteDataPlayer } from "@/firebase/players";
import { playerSheet } from "@/firebase/utilities";
import contexto from "@/context/context";
import { deletePlayerImage } from "@/firebase/storage";

export default function DeleteSheet() {
	const {
    sheetId,
    session,
    setSheetId,
    dataSheet,
    setDataSheet,
    setShowMessage,
    setShowDeleteSheet,
    setShowMenuSession,
    setOptionSelect,
  } = useContext(contexto);

  const deleteSheet = async () => {
    try {
      setDataSheet({ ...dataSheet, data: playerSheet });
      await deleteDataPlayer(sheetId, session.id, dataSheet.data.profileImage, setShowMessage);
      setShowDeleteSheet(false);
      setSheetId('');
      setDataSheet({});
      setShowMenuSession('');
      setOptionSelect('players');
      await deletePlayerImage (session.id, sheetId, dataSheet.data.profileImage, setShowMessage);
    } catch(error) {
      setShowMessage({ show: true, text: "Ocorreu um erro: " + error });
      setShowDeleteSheet(false);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setShowDeleteSheet(false) }
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza que quer apagar esta ficha do banco de dados? Absolutamente tudo o que você registrou nela será apagado e ela deixará de existir na lista de Personagens.
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteSheet(false) }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não Excluir
            </button>
            <button
              type="button"
              onClick={ deleteSheet }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Excluir Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}