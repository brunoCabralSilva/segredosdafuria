import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function AddTouchstone() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [listTouchstones, setListTouchstones] = useState({});
  const {
    dataSheet,
    addTouchstone, setAddTouchstone,
    setShowMessage,
    sessionId,
    email,
   } = useContext(contexto);

  useEffect(() => {
    if (addTouchstone.data.name) {
      setName(addTouchstone.data.name);
      setDescription(addTouchstone.data.description);
      setListTouchstones(dataSheet.touchstones.filter((touchstone: any) => touchstone.name !== addTouchstone.data.name));
    }
  }, []);

  const createTouchstone = async () => {
    const newDataSheet = dataSheet;
    if (addTouchstone.data.name) {
      newDataSheet.touchstones = listTouchstones;
      newDataSheet.touchstones = [...newDataSheet.touchstones, { name, description }];
      await updateDataPlayer(sessionId, email, newDataSheet, setShowMessage);
    } else {
      newDataSheet.touchstones = [...newDataSheet.touchstones, { name, description }];
      await updateDataPlayer(sessionId, email, newDataSheet, setShowMessage);
    }
    setAddTouchstone({ show: false, data: {} });
  }

  return(
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0 text-white">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-ritual bg-cover bg-center relative border-white border-2">
        <div className="bg-black/90 h-full w-full">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={() => setAddTouchstone({ show: false, data: {} }) }
            />
          </div>
          <div className="pb-5 px-5 w-full">
            <p className="font-bold pb-2">Nome do Pilar</p>
            <input
              type="text"
              className="focus:outline-none border-2 border-white text-white text-center w-full mr-1 bg-black py-1"
              value={ name }
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setName(sanitizedValue);
              }}
            />
            <p className="font-bold pb-1 pt-4">Descreva seu Pilar e o que ele representa</p>
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
              onClick={ createTouchstone }
              className="mt-2 mb-5 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
            >
              { addTouchstone.data.name ? 'Atualizar': 'Adicionar' } Pilar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}