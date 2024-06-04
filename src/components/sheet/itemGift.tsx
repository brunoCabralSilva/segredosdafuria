'use client'
import { updateDoc } from "firebase/firestore";
import { ITypeGift } from "../../interface";
import { useState } from "react";
import { actionFeedback, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoAddCircle, IoArrowUpCircleSharp } from "react-icons/io5";
import { capitalizeFirstLetter } from "@/functions/utilities";
import { getUserAndDataByIdSession } from "@/firebase/sessions";
import Image from 'next/image';
import Feedback from "../feedback";

export default function ItemGift(props: any) {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const { index, dataGift } = props;
  const [showGift, setShowGift] = useState<boolean>(false);

  const addGift = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      const filterGift = player.data.gifts.find((item: any) => item.gift === dataGift.gift);
      if (filterGift) {
        window.alert("Este dom já está cadastrado na sua Ficha.")
      } else {
        player.data.gifts = [...player.data.gifts, dataGift];
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
        setShowGift(false);
        window.alert(`Dom '${dataGift.giftPtBr}' adicionado com sucesso!`)
      }
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
    props.generateDataForGifts();
  };

  if(showGift) return (
    <section key={index} className="mb-2 relative min-h-screen">
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
          <h1 className="text-center font-bold w-full">
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
          onClick={ () => addGift() }
        >
          <IoAddCircle className="text-3xl text-white" />
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
      <h1 className="font-bold text-white text-normal text-center w-full">
        {`${ dataGift.giftPtBr } (${ dataGift.gift }) - ${ dataGift.renown }`}
      </h1>
      <div className="flex items-center justify-center">
      </div>
      <p className="w-full text-center">
        { 
          dataGift.belonging.map((trybe: ITypeGift, index: number) => (
            <span className="text-white text-sm" key={ index }>
              { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
              { index === dataGift.belonging.length -1 ? '' : ', ' }
            </span>
          ))
        }
      </p>
    </button>
  );
}