'use client'
import { useAppDispatch } from "@/redux/hooks";
import { actionShowMenuSession } from "@/redux/slice";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AutomatedRoll from "./sheet/automatedRoll";
import ManualRoll from "./manualRoll";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";

export default function PopUpDices(props: { session: string }) {
  const { session } = props;
  const [optionRadio, setOptionRadio] = useState<string>('manual');
  const [dm, setDm] = useState(false);
  const dispatch = useAppDispatch();

  const verifyIfUserIsDm = async () => {
    try {
      const token = localStorage.getItem('Segredos Da Fúria');
      if (token) {
        const decode: { email: string } = jwtDecode(token);
        const db = getFirestore(firebaseConfig);
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const sessionDoc = userQuerySnapshot.docs[0];
        const sessionData = sessionDoc.data();
        if (decode.email === sessionData.dm) {
          setOptionRadio('manual');
          setDm(decode.email === sessionData.dm);
        } else {
          setOptionRadio('automated');
        }
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      }
		} catch (error) {
			window.alert(`Erro ao obter a lista de jogadores: ` + error);
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
          ? <AutomatedRoll session={ session } />
          : <ManualRoll session={ session } />
        }
      </div>
  )
}