'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionDelHistoric, useSlice } from "@/redux/slice";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firebaseConfig from "../firebase/connection";

export default function PopupDelHistoric(props: { sessionId : string }) {
  const { sessionId } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const clearMessages = async () => {
    try {
      const db = getFirestore(firebaseConfig);
      const sessionsCollectionRef = collection(db, 'sessions');
      const sessionDocRef = doc(sessionsCollectionRef, sessionId);
      const sessionDocSnapshot = await getDoc(sessionDocRef);
      if (sessionDocSnapshot.exists()) {
        await updateDoc(sessionDocSnapshot.ref, { chat: [] });
        dispatch(actionDelHistoric(false))
        window.alert('Histórico apagado com Sucesso!');
      } else {
        window.alert('Erro ao encontrar o histórico do chat. Por favor, atualize a página e tente novamente.');
      }
    } catch (error) {
      window.alert('Erro ao limpar o campo chat: ' + error);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionDelHistoric(false))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de que quer apagar TODO o histórico deste chat? Tudo o que foi enviado pelos participantes será apagado com esta ação!
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionDelHistoric(false))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

            >
              Não
            </button>
            <button
              type="button"
              onClick={ clearMessages }
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