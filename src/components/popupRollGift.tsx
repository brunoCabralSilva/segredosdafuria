'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupGiftRoll, useSlice } from "@/redux/slice";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MechanicGift } from "./sheet/functionGifts";

export default function PopupRollGift() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

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

  return(
    <div className="w-full overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
      <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer"
          onClick={() => dispatch(actionPopupGiftRoll({
            show: false,
            gift: { session: '', data: '' },
          }))}
        />
      </div>
      <div className="flex flex-col justify-center w-full">
        <div className="relative text-white flex w-full justify-center pb-5">
          { 
            slice.showPopupGiftRoll.gift.data.belonging.map((trybe: any, index: number) => (
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
        <h1 className="text-center text-sm font-bold w-full text-white">
          {`${ slice.showPopupGiftRoll.gift.data.giftPtBr } (${ slice.showPopupGiftRoll.gift.data.gift }) - ${ slice.showPopupGiftRoll.gift.data.renown }`}
        </h1>
        <div className="flex items-center justify-center">
          <hr className="w-full m-4" />
        </div>
      </div>
      <div className="pb-3 px-5 w-full">
        <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
          <p className="font-normal text-white w-full pb-3">
            Custo: { slice.showPopupGiftRoll.gift.data.cost }
          </p>
          <p className="font-normal text-white w-full pb-3">
            Ação: { slice.showPopupGiftRoll.gift.data.action }
          </p>
          <p className="font-normal text-white w-full pb-3">
            Parada de Dados: { slice.showPopupGiftRoll.gift.data.pool }
          </p>
          <p className="font-normal text-white w-full pb-3">
            Duração: { slice.showPopupGiftRoll.gift.data.duration }
          </p>
        </label>
      </div>
      <MechanicGift
        nameGift={slice.showPopupGiftRoll.gift.data.gift}
      />
    </div>
  );
}