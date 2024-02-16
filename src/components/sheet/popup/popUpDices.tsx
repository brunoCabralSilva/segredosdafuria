'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AutomatedRoll from "../automatedRoll";
import ManualRoll from "../../manualRoll";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { useRouter } from "next/navigation";

export default function PopUpDices(props: { session: string, type: string }) {
  const { session, type } = props;
  const [optionRadio, setOptionRadio] = useState<string>('automated');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const verifyIfUserIsDm = async () => {
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const db = getFirestore(firebaseConfig);
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
    }
  };

  useEffect(() => {
    verifyIfUserIsDm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto">
      <div className="w-full mb-3 flex justify-end">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer"
          onClick={() => dispatch(actionShowMenuSession(''))}
        />
      </div>
      <div className="pb-8 grid grid-cols-2 w-full">
        <button
          type="button"
          onClick={() => setOptionRadio('automated')}
          className={`text-sm sm:text-base w-full ${ optionRadio === 'automated' ? 'text-white bg-black border-2 border-white' : 'text-black bg-gray-400 border-2 border-black'} p-2 text-center`}>
          Teste Automatizado
        </button>
        <button
          type="button"
          onClick={() => setOptionRadio('manual')}
          className={`text-sm sm:text-base w-full ${ optionRadio === 'manual' ? 'text-white bg-black border-2 border-white' : 'text-black bg-gray-400 border-2 border-black'} p-2 text-center`}>
          Teste Manual
        </button>
      </div>
      {
        optionRadio === 'automated'
        ? <AutomatedRoll session={ session } type={type} />
        : <ManualRoll session={ session } />
      }
    </div>
  )
}