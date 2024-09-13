'use client'
import { useAppDispatch, useAppSelector} from "@/redux/hooks";
import { actionResetSheet, useSlice } from "@/redux/slice";
import { collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../../firebase/connection';
import { authenticate } from "@/new/firebase/authenticate";
import { useRouter } from "next/navigation";
import { getHoraOficialBrasil } from "@/firebase/chatbot";
import { sheetStructure } from "@/new/firebase/utilities";

export default function PopupResetSheet() {
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const router = useRouter();

  const resetSheet = async () => {
    const dateMessage = await getHoraOficialBrasil();
    try {
      const authData: any = await authenticate();
      const db = getFirestore(firestoreConfig);
      if (authData && authData.email && authData.displayName) {
        const { email, displayName: name } = authData;
        const sheet = sheetStructure(email, name, dateMessage);
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionDocRef = doc(sessionsCollectionRef, slice.sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          const sessionDoc = sessionDocSnapshot.data();
          const playerIndex = sessionDoc.players.findIndex((player: any) => player.email === email);
        if (playerIndex !== -1) {
          const updatedPlayers = [...sessionDoc.players];
          updatedPlayers[playerIndex] = sheet;
          await updateDoc(sessionDocRef, { players: updatedPlayers });
          dispatch(actionResetSheet(false));
          window.alert("Sua ficha foi resetada!");
        } else {
          window.alert("Jogador não encontrado na sessão.");
          dispatch(actionResetSheet(false));
        }
        window.location.reload();
        }
      } else router.push('/login');
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
      dispatch(actionResetSheet(false));
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionResetSheet(false))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza que quer resetar os dados da sua ficha? Absolutamente tudo o que você registrou nela será apagado e ela voltará ao estado inicial de quando você logou pela primeira vez nesta sessão.
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionResetSheet(false))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

            >
              Não
            </button>
            <button
              type="button"
              onClick={ resetSheet }
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