import Image from "next/image";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { ITypeGift } from "../../interface";
import { useState } from "react";
import { actionFeedback, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Feedback from "../feedback";
import { MdDelete } from "react-icons/md";
import { IoArrowUpCircleSharp } from "react-icons/io5";
import { FaDiceD20 } from "react-icons/fa";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";

export default function ItemGiftAdded(props: any) {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const { index, dataGift, session } = props;
  const [showGift, setShowGift] = useState<boolean>(false);

  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guarda do Cervo';
      case 'ghost council': return 'Conselho Fantasma';
      case 'galestalkers': return 'Perseguidores da Tempestade';
      case 'glass walkers': return 'Andarilhos do Asfalto';
      case 'bone gnawers': return 'Roedores de Ossos';
      case 'shadow lords': return 'Senhores das Sombras';
      case 'children of gaia': return 'Filhos de Gaia';
      case 'red talons': return 'Garras Vermelhas';
      default: return str.charAt(0).toUpperCase() + str.slice(1);;
    }
  };

  const removeGift = async () => {
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
        const filterGift = player.data.gifts.filter((item: any) => item.gift !== dataGift.gift);
        player.data.gifts = filterGift;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        const docRef = userQuerySnapshot.docs[0].ref;
        await updateDoc(docRef, { players: [...playersFiltered, player] });
        setShowGift(false);
        window.alert(`Dom '${dataGift.giftPtBr}' removido com sucesso!`)
      } catch (error) {
        window.alert('Erro ao atualizar valor: (' + error + ')');
      }
    }
    props.generateDataForGifts();
  };

  if(showGift) return (
    <section
      key={index} className="mb-2 relative min-h-screen"
    >
      <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 text-white border-2 border-white relative">
        <div className="flex flex-col justify-center">
          <div className="relative text-white flex w-full justify-center pb-5">
            { 
              dataGift.belonging.map((trybe: ITypeGift, index: number) => (
                <Image
                  key={ index }
                  src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
                  alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
                  className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
                  width={ 1200 }
                  height={ 800 }
                />
              ))
            }
          </div>
          <h1 className="text-center text-sm font-bold w-full">
            {`${ dataGift.giftPtBr } (${ dataGift.gift }) - ${ dataGift.renown }`}
          </h1>
          <hr className="w-full my-4" />
        </div>
        <p>
          <span className="text-sm pr-1">Pertencente a:</span>
          { 
            dataGift.belonging.map((trybe: ITypeGift, index: number) => (
              <span className="text-sm font-normal" key={ index }>
                { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                { index === dataGift.belonging.length -1 ? '.' : ', ' }
              </span>
            ))
          }
        </p>
        <p className="pt-1">
          <span className="text-sm font-bold pr-1">Fonte:</span>
          <span className="text-sm font-normal">{ dataGift.book }, pg. { dataGift.page }.</span>
        </p>
        <p className="pt-1">
          <span className="text-sm font-bold pr-1">Custo:</span>
          <span className="text-sm font-normal">{ dataGift.cost }.</span>
        </p>
        <p className="pt-1">
          <span className="text-sm font-bold pr-1">Ação:</span>
          <span className="text-sm font-normal">{ dataGift.action }.</span>
        </p>
        { dataGift.pool !== "" &&
          <p className="pt-1">
            <span className="text-sm font-bold pr-1">Parada de Dados:</span>
            <span className="text-sm font-normal">{ dataGift.pool }.</span></p>
        }
        { dataGift.duration !== "" &&
          <p className="pt-1">
            <span className="text-sm font-bold pr-1">Duração:</span>
            <span className="text-sm font-normal">{ dataGift.duration }.</span>
          </p>
        }
        <p className="pt-1 text-justify">
          <span className="text-sm font-bold pr-1">Descrição:</span>
          <span className="text-sm font-normal">{ dataGift.descriptionPtBr }</span>
        </p>
        <p className="pt-1 text-justify mt-2">
          <span className="text-sm font-bold pr-1">Sistema:</span>
          <span className="text-sm font-normal">{ dataGift.systemPtBr }</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between">
        <button
          type="button"
          className={`text-sm pb-3 ${!slice.simplify ? 'w-full text-center text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
          onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
        >
          Enviar Feedback
        </button>
        {
          slice.feedback.show && <Feedback title={ dataGift.gift } /> 
        }
        </div>
      </article>
      <div className="absolute top-0 right-0 text-black flex p-2 gap-3">
        <button
          type="button"
        >
          <FaDiceD20 className="text-2xl text-white" />
        </button>
        <button
          type="button"
          onClick={ removeGift }
        >
          <MdDelete className="text-3xl text-white" />
        </button>
        <button
          type="button"
          onClick={ () => setShowGift(false) }
        >
          <IoArrowUpCircleSharp className="text-3xl text-white" />
        </button>
      </div>
    </section>
  );
  return (
    <button
      className="border-2 border-white mb-2 p-2 py-3 w-full hover:bg-black transition-colors"
      type="button"
      onClick={() => setShowGift(true)}
    >
      <div className="relative flex w-full justify-center pb-2">
        { 
          dataGift.belonging.map((trybe: ITypeGift, index: number) => (
            <Image
              key={ index }
              src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
              alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
              className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
              width={ 1200 }
              height={ 800 }
            />
          ))
        }
      </div>
      <h1 className="font-bold text-white text-normal text-center w-full text-sm">
        {dataGift.giftPtBr}
      </h1>
    </button>
  );
}