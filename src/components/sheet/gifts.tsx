import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IoAdd, IoClose } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import dataGifts from '../../data/gifts.json';
import ItemGift from "./itemGift";
import ItemGiftAdded from "./itemGiftAdded";

export default function GiftsSheet() {
  const [showAllGifts, setShowAllGifts] = useState<boolean>(false);
  const [totalRenown, setTotalRenown] = useState<number>(0);
  const [trybe, setTrybe] = useState<string>('');
  const [auspice, setAuspice] = useState<string>('');
  const [giftsAdded, setGiftsAdded] = useState<any[]>([]);

  useEffect(() => {
    generateDataForGifts();
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

  const generateDataForGifts = async () => {
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
            const wayElement = userData.characterSheet[0].data;
            setTotalRenown(Number(wayElement.renown.honor) + Number(wayElement.renown.glory + Number(wayElement.renown.wisdom)));
            setTrybe(userData.characterSheet[0].data.trybe);
            setAuspice(userData.characterSheet[0].data.auspice);
            setGiftsAdded((userData.characterSheet[0].data.gifts))
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor do atributo: ' + error);
      }
    }
  };

  const returnListOfGifts = () => {
    let listGifts = dataGifts.filter((gift) => {
      const belonging = gift.belonging.filter((belong) => (belong.type === 'global' || belong.type === trybe || belong.type === auspice) && belong.totalRenown <= totalRenown);
      if (belonging.length > 0) return gift;
      return null;
    });

    return (listGifts.map((dataGift, index) => (
      <ItemGift
        key={ index }
        index={ index }
        dataGift={ dataGift }
      />
    )));
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
        <div className="mt-1 p-2 bg-white flex justify-between items-center mb-2">
          <div
            className="text-black mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
          >
            {
            !showAllGifts
            ? <span>Dons adicionados</span>
            : <span>Escolha um ou mais dons para serem adicionados</span>
            }
          </div>
          <button
            type="button"
            className="p-1 border-2 border-black"
            onClick={ () => {
              setShowAllGifts(!showAllGifts);
              generateDataForGifts();
            }}
          >
            { 
              !showAllGifts
              ? <IoAdd
                  className="text-black text-xl"
                />
              : <IoClose className="text-black text-xl" />
            }
          </button>
        </div>
        <div className="h-full">
          {
            !showAllGifts 
            ? <div className="">
                { 
                  giftsAdded.length > 0 && giftsAdded.map((item, index) => (
                    <ItemGiftAdded
                      key={ index }
                      index={ index }
                      dataGift={ item }
                      generateDataForGifts={ generateDataForGifts }
                    />
                  ))
                }
              </div>
            : <div>{ returnListOfGifts() }</div>
          }
        </div>
      </div>
    </div>
  );
}