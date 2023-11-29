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
    <div className="flex flex-col w-full">
      <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
        <div className="flex flex-col w-full sm:pr-2">
          <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
            <div className="relative border-2 border-white mt-1 p-2 flex justify-between items-center mb-2">
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
                className="sm:absolute right-3 p-1 border-2 border-white bg-white text-black"
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