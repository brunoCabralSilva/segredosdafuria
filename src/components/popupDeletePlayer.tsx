'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionDeletePlayer, useSlice } from "@/redux/slice";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../firebase/connection';
import { jwtDecode } from "jwt-decode";
import { authenticate, signIn } from "@/firebase/login";

export default function PopupDeletePlayer(props: { returnValue: any, sessionId : string }) {
  const { sessionId, returnValue } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const removePlayer = async () => {
    const db = getFirestore(firestoreConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionDocRef = doc(sessionsCollectionRef, sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          const sessionDoc = sessionDocSnapshot.data();
          const filterListPlayer = sessionDoc.players.filter((player: any) => player.email !== slice.popupDeletePlayer.player.email);
          await updateDoc(sessionDocSnapshot.ref, {
            players: filterListPlayer,
          });
          returnValue();
          dispatch(actionDeletePlayer({ show: false, player: {}}));
          window.alert("O jogador foi removido com sucesso!");
        }
      } else {
        const sign = await signIn();
        if (!sign) router.push('/');
      }
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionDeletePlayer({ show: false, player: {}}))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza que quer excluir este jogador da sua Sessão? Além de perder todos os dados deste personagem ao fazer isto, ele também não terá mais autorização para acessar sua sessão, a não ser que você autorize novamente.
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionDeletePlayer({ show: false, player: {}}))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

            >
              Não
            </button>
            <button
              type="button"
              onClick={ removePlayer }
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