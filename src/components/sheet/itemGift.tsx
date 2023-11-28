import Image from "next/image";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { ITypeGift } from "../../../interface";
import { useState } from "react";
import { actionFeedback, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Feedback from "../feedback";
import { IoAddCircle, IoArrowUpCircleSharp } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";

export default function ItemGift(props: any) {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const { index, dataGift } = props;
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

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const addGift = async () => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userData = userQuerySnapshot.docs[0].data();
          if (userData.characterSheet && userData.characterSheet.length > 0) {
            const filterGift = userData.characterSheet[0].data.gifts.find((item: any) => item.gift === dataGift.gift);
            if (filterGift) {
              window.alert("Este dom já está cadastrado na sua Ficha.")
            } else {
              userData.characterSheet[0].data.gifts = [...userData.characterSheet[0].data.gifts, dataGift];
              await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
              setShowGift(false);
              window.alert(`Dom '${dataGift.giftPtBr}' adicionado com sucesso!`)
            }
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar Dom: (' + error + ')');
      }
    }
  };

  if(showGift) return (
    <section key={index} className="bg-white mb-2 relative min-h-screen">
      <article className="w-full h-full px-4 pb-4 pt-10 sm:p-10 bg-white text-black relative">
        <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
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
          <h1 className="font-bold text-lg text-center sm:text-left w-full">
            {`${ dataGift.giftPtBr } (${ dataGift.gift }) - ${ dataGift.renown }`}
          </h1>
          <hr className="w-10/12 my-4 sm:my-2" />
        </div>
        <p>
          <span className="font-bold pr-1">Pertencente a:</span>
          { 
            dataGift.belonging.map((trybe: ITypeGift, index: number) => (
              <span key={ index }>
                { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                { index === dataGift.belonging.length -1 ? '.' : ', ' }
              </span>
            ))
          }
        </p>
        <p className="pt-1">
          <span className="font-bold pr-1">Fonte:</span>
          { dataGift.book }, pg. { dataGift.page }.
        </p>
        <p className="pt-1">
          <span className="font-bold pr-1">Custo:</span>
          { dataGift.cost }.
        </p>
        <p className="pt-1">
          <span className="font-bold pr-1">Ação:</span>
          { dataGift.action }.
        </p>
        { dataGift.pool !== "" &&
          <p className="pt-1">
            <span className="font-bold pr-1">Parada de Dados:</span>
            { dataGift.pool }.
          </p>
        }
        { dataGift.duration !== "" &&
          <p className="pt-1">
            <span className="font-bold pr-1">Duração:</span>
            { dataGift.duration }.
          </p>
        }
        <p className="pt-1 text-justify">
          <span className="font-bold pr-1">Descrição:</span>
          { dataGift.descriptionPtBr }
        </p>
        <p className="pt-1 text-justify">
          <span className="font-bold pr-1">Sistema:</span>
          { dataGift.systemPtBr }
        </p>
        <p className="pt-1 text-justify">
          <span className="font-bold pr-1">Description (original):</span>
          { dataGift.description }
        </p>
        <p className="pt-1 text-justify">
          <span className="font-bold pr-1">System (original):</span>
          { dataGift.system }
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between">
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
        <button
          type="button"
          className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
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
          onClick={ () => addGift() }
        >
          <IoAddCircle className="text-3xl" />
        </button>
        <button
          type="button"
          onClick={ () => setShowGift(false) }
        >
          <IoArrowUpCircleSharp className="text-3xl" />
        </button>
      </div>
    </section>
  );
  return (
    <button
      className="bg-white mb-2 p-2 py-3 w-full"
      type="button"
      onClick={() => setShowGift(true)}
    >
      <div className=" relative text-white flex w-full justify-center pb-2">
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
      <h1 className="font-bold text-lg text-center w-full">
        {`${ dataGift.giftPtBr } (${ dataGift.gift }) - ${ dataGift.renown }`}
      </h1>
      <div className="flex items-center justify-center">
        <hr className="w-10/12 my-1 " />
      </div>
      <p className="w-full text-center">
        <span className="w-full font-bold pr-1 text-center">Pertencente a:</span>
        { 
          dataGift.belonging.map((trybe: ITypeGift, index: number) => (
            <span key={ index }>
              { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
              { index === dataGift.belonging.length -1 ? '' : ', ' }
            </span>
          ))
        }
      </p>
    </button>
  );
}