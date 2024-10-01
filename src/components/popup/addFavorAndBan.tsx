import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function AddFavorAndBan() {
  const [description, setDescription] = useState('');
  const [listFavorAndBan, setListFavorAndBan] = useState({});
  const {
    addFavorAndBan, setAddFavorAndBan,
    setShowMessage,
    sessionId,
    dataSheet,
    email,
  } = useContext(contexto);

  useEffect(() => {
    if (addFavorAndBan.data.description) {
      setDescription(addFavorAndBan.data.description);
      setListFavorAndBan(dataSheet.favorsAndBans.filter((favorAndBan: any) => favorAndBan.order !== addFavorAndBan.data.order));
    }
  }, []);

  const createFavorAndBan = async () => {
    const newDataSheet = dataSheet;
    if (addFavorAndBan.data.name) {
      newDataSheet.favorsAndBans = listFavorAndBan;
      newDataSheet.favorsAndBans = [...newDataSheet.favorsAndBans, { description, order: newDataSheet.favorsAndBans.length + 1 }];
      await updateDataPlayer(sessionId, email, newDataSheet, setShowMessage);
    } else {
      newDataSheet.favorsAndBans = [...newDataSheet.favorsAndBans, { description, order: newDataSheet.favorsAndBans.length + 1 }];
      await updateDataPlayer(sessionId, email, newDataSheet, setShowMessage);
    }
    setAddFavorAndBan({ show: false, data: {} });
  }

  return(
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0 text-white">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-ritual bg-cover bg-center relative border-white border-2">
        <div className="bg-black/90 h-full w-full">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={() => setAddFavorAndBan({ show: false, data: {} }) }
            />
          </div>
          <div className="pb-5 px-5 w-full">
            <p className="font-bold pb-1 pt-4">Descreva o Favor / Proibição</p>
            <textarea
              className="focus:outline-none text-white bg-black font-normal p-3 border-2 border-white w-full mr-1 mt-1"
              value={ description }
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setDescription(sanitizedValue);
              }}
            />
            <button
              type="button"
              onClick={ createFavorAndBan }
              className="mt-2 mb-5 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
            >
              { addFavorAndBan.data.description ? 'Atualizar': 'Adicionar' } Favor / Proibição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}