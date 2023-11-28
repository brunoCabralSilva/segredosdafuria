import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IoAdd, IoClose } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import dataRituals from '../../data/rituals.json';
import ItemRituals from "./itemRituals";

export default function RitualSheet() {
  const [showAllRituals, setShowAllRituals] = useState<boolean>(false);
  const [ritualsAdded, setRitualsAdded] = useState<any[]>([]);

  useEffect(() => {
    generateDataForRituals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const generateDataForRituals = async () => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userData = userQuerySnapshot.docs[0].data();
          setRitualsAdded((userData.characterSheet[0].data.rituals))
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor do Ritual: ' + error);
      }
    }
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
        <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
          <div className="w-full h-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
            <div className="mt-1 p-2 bg-white flex justify-between items-center mb-2">
              <div
                className="text-black mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
              >
                {
                !showAllRituals
                ? <span>Rituais adicionados</span>
                : <span>Escolha um ou mais Rituais para serem adicionados</span>
                }
              </div>
              <button
                type="button"
                className="p-1 border-2 border-black"
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
            <div className="h-full">
              {
                !showAllRituals 
                ? <div className="">
                    { 
                      ritualsAdded.length > 0 && ritualsAdded.map((item, index) => (
                        <ItemRituals
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