'use client'
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IoAdd, IoClose } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import dataGifts from '../../data/gifts.json';
import ItemGift from "./itemGift";
import ItemGiftAdded from "./itemGiftAdded";

export default function GiftsSheet(props: { session: string }) {
  const { session } = props;
  const [showAllGifts, setShowAllGifts] = useState<boolean>(false);
  const [totalRenown, setTotalRenown] = useState<number>(0);
  const [trybe, setTrybe] = useState<string>('');
  const [auspice, setAuspice] = useState<string>('');
  const [giftsAdded, setGiftsAdded] = useState<any[]>([]);

  useEffect(() => {
    generateDataForGifts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDataForGifts = async () => {
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
        setTotalRenown(Number(player.data.honor) + Number(player.data.glory + Number(player.data.wisdom)));
        setTrybe(player.data.trybe);
        setAuspice(player.data.auspice);
        setGiftsAdded((player.data.gifts))
        console.log(player.data.gifts);
      } catch (error) {
        window.alert('Erro ao obter valores do dom: ' + error);
      }
    }
  };

  const returnListOfGifts = () => {
    let listGifts = dataGifts.filter((gift) => {
      const belonging = gift.belonging.filter((belong) => (belong.type === 'global' || belong.type === trybe || belong.type === auspice) && belong.totalRenown <= totalRenown);
      if (belonging.length > 0) return gift;
      return null;
    });

    if (listGifts.length === 0) window.alert('É necessário investir pelo menos um ponto em algum Renome para que sejam sugeridos dons.')

    return (listGifts.map((dataGift, index) => (
      <ItemGift
        session={ session }
        key={ index }
        index={ index }
        dataGift={ dataGift }
      />
    )));
  };

  return(
    <div className="flex flex-col w-full">
      <div className="w-full mb-2 flex-col items-start justify-center font-bold relative">
        <div className="mt-1 p-2 flex justify-between items-center mb-2 border-white border-2 bg-black">
          <div
            className="text-white mt-2 pb-2 w-full flex-col items-center justify-center text-center"
          >
            {
            !showAllGifts
            ? <span className="text-sm">Meus Dons</span>
            : <span className="text-sm">Adicionar Novos Dons</span>
            }
          </div>
          <button
            type="button"
            className="p-1 border-2 border-white bg-white absolute right-3"
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
        <div className="">
          {
            !showAllGifts 
            ? <div className="">
                { 
                  giftsAdded.length > 0 && giftsAdded.map((item, index) => (
                    <ItemGiftAdded
                      key={ index }
                      index={ index }
                      dataGift={ item }
                      session={ session }
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