'use client'
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IoAdd, IoClose } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import dataRituals from '../../data/rituals.json';
import ItemRituals from "./itemRituals";

export default function RitualSheet(props: { session: string }) {
  const { session } = props;
  const [showAllRituals, setShowAllRituals] = useState<boolean>(false);
  const [ritualsAdded, setRitualsAdded] = useState<any[]>([]);

  useEffect(() => {
    generateDataForRituals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDataForRituals = async () => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setRitualsAdded(player.data.rituals);
      } catch (error) {
        window.alert('Erro ao obter valor do Ritual: ' + error);
      }
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