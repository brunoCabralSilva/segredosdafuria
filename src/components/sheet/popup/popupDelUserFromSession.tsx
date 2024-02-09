'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionDeleteUserFromSession } from "@/redux/slice";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../../firebase/connection';
import { authenticate, signIn } from "@/firebase/login";
import { registerMessage } from "@/firebase/chatbot";
import firebaseConfig from "../../../firebase/connection";

export default function PopupDelUserFromSession(props: { session : string }) {
  const { session } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const removeSession = async () => {
    const db = getFirestore(firestoreConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email, name } = authData;
        const db = getFirestore(firebaseConfig);
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const userDocument = userQuerySnapshot.docs[0];
        const sessionDocRef = doc(db, 'sessions', userDocument.id);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          const sessionDoc = sessionDocSnapshot.data();
          const filterListPlayer = sessionDoc.players.filter((player: any) => player.email !== email);
          if (filterListPlayer.length === 0) {
            await deleteDoc(sessionDocSnapshot.ref);
          } else {
            let oldestPlayer = filterListPlayer[0];
            for(let i = 0; i <= filterListPlayer.length - 1; i += 1) {
              if (filterListPlayer[i].creationDate < oldestPlayer.creationDate) {
                oldestPlayer = filterListPlayer[i];
              }
            }
            const updatedNotifications = [
              {
                message: `Olá, tudo bem? O jogador ${name} saiu desta sala. Você pode integrá-lo novamente, caso o mesmo solicite novamente acessar esta sessão.`,
                type: 'transfer',
              }
            ];
            await updateDoc(sessionDocSnapshot.ref, {
              players: filterListPlayer,
              dm: oldestPlayer.email,
              notifications: updatedNotifications,
            });
            await registerMessage({
              message: `O jogador ${name} saiu definitivamente desta sala.`,
              user: 'notification',
              email: email,
            }, sessionDocSnapshot.data().name);
          }
          dispatch(actionDeleteUserFromSession(false));
          window.alert("Esperamos que sua jornada nessa Sessão tenha sido divertida e gratificante. Até logo!");
          router.push('/sessions');
        } else {
          const sign = await signIn();
          if (!sign) {
            window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
            router.push('/');
          }
        }
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
            onClick={() => dispatch(actionDeleteUserFromSession(false))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Ao escolher sair de uma Sessão, todos os dados que você tem registrados aqui, como fichas e anotações, serão removidos permanentemente. Você tem certeza que de fato quer fazer isto?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionDeleteUserFromSession(false))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ removeSession }
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