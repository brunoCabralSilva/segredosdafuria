'use client'
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IoAdd, IoClose } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import dataRituals from '../../data/rituals.json';
import ItemRituals from "./itemRituals";
import { authenticate, signIn } from "@/firebase/login";
import { useRouter } from "next/navigation";

export default function RitualSheet(props: { session: string }) {
  const { session } = props;
  const [showAllRituals, setShowAllRituals] = useState<boolean>(false);
  const [ritualsAdded, setRitualsAdded] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    generateDataForRituals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDataForRituals = async () => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setRitualsAdded(player.data.rituals);
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

  return(
    <div className="flex flex-col w-full">
      <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
        <div className="flex flex-col w-full">
          <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
            <div className="relative border-2 border-white mt-1 p-2 flex justify-between items-center mb-2 bg-black">
              <div
                className="mt-2 pb-2 text-white w-full cursor-pointer flex items-center justify-center"
              >
                {
                !showAllRituals
                ? <span className="text-center w-full text-sm">Meus Rituais</span>
                : <span className="text-center w-full text-sm">Adicionar Novos Rituais</span>
                }
              </div>
              <button
                type="button"
                className="absolute right-3 p-1 border-2 border-white bg-white text-black"
                onClick={ () => {
                  setShowAllRituals(!showAllRituals);
                  generateDataForRituals();
                }}
              >
                { 
                  !showAllRituals
                  ? <IoAdd
                      className="text-black text-xl"
                    />
                  : <IoClose className="text-black text-xl" />
                }
              </button>
            </div>
            <div className="">
              {
                !showAllRituals 
                ? <div className="">
                    { 
                      ritualsAdded.length > 0 && ritualsAdded.map((item, index) => (
                        <ItemRituals
                          session={session}
                          key={ index }
                          index={ index }
                          ritual={ item }
                          remove={true}
                          generateDataForRituals={ () => generateDataForRituals() }
                        />
                      ))
                    }
                  </div>
                : <div>
                    {
                      dataRituals.map((ritual, index) => (
                        <ItemRituals
                          session={session}
                          key={ index }
                          index={ index }
                          ritual={ ritual }
                          remove={false}
                        />
                      ))
                    }
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}