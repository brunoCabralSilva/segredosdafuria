import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Gift(props: { gift: any, index: number, length: number }) {
  const [showGift, setShowGift] = useState(false);
  const { gift, index, length } = props;
  const { dataSheet, sessionId, email, setShowMessage } = useContext(contexto);

  const registerGift = async (gift: any) => {
    if (dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr))
      dataSheet.gifts = dataSheet.gifts.filter((item: any) => item.giftPtBr !== gift.giftPtBr)
    else dataSheet.gifts.push(gift);
    await updateDataPlayer(sessionId, email, dataSheet, setShowMessage);
  }

  return(
    <div className={`${dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr) ? 'bg-black border-red-500': 'bg-gray-whats-dark border-white'} border-2 ${ index === length - 1 ? '' : 'mb-3'}`}>
      <button
        type="button"
        onClick={ () => setShowGift(!showGift) }
        className={`w-full flex items-start justify-between px-4 pt-4 ${!showGift && 'pb-4'}`}
      >
        <div className="capitalize text-base sm:text-lg font-bold flex flex-col w-full text-left">
          <div>
            { gift.giftPtBr } - { 
            gift.belonging.map((belong: { type: string, totalRenown: number }, index: number) => (
              <span key={ index } className="capitalize">
                { capitalizeFirstLetter(belong.type) } ({ belong.totalRenown })
                { index === gift.belonging.length - 1 ? '' : ', ' }
              </span>
            ))}
          </div>
        </div>
        <div>
          { 
            showGift
            ? <IoIosArrowUp className="text-xl"  />
            : <IoIosArrowDown className="text-xl" />
          }
        </div>
      </button>
      {
        showGift &&
        <div className="px-4 pb-4">
          <span className="text-lg">({ gift.gift }) </span>
          <p className="pt-4">
          <span className="pr-1 font-bold">Ação:</span>
            { gift.action }.
          </p>
          <div>
            <span className="pr-1 font-bold">Renome:</span>
            { gift.renown }.
          </div>
          <div>
            <span className="pr-1 font-bold">Custo:</span>
            { gift.cost }.
          </div>
          {
            gift.pool !== '' &&
            <div>
              <span className="pr-1 font-bold">Teste:</span>
              { gift.pool }.
            </div>
          }
          <div className="pt-2">
            <span className="pr-1 font-bold">Descrição:</span>
            { gift.descriptionPtBr }
          </div>
          <div className="pt-2">
            <span className="pr-1 font-bold">Sistema:</span>
            { gift.systemPtBr }
          </div>
          {
            gift.duration !== '' &&
            <div className="pt-2">
              <span className="pr-1 font-bold">Duração:</span>
              { gift.duration }.
            </div>
          }
          <button
            type="button"
            className="mt-4 px-2 p-1 border-2 border-white bg-white hover:bg-black hover:border-red-500 hover:text-white transition-colors duration-500 right-3 text-black font-bold"
            onClick={ () => { registerGift(gift)}}
            >
            {
              dataSheet.gifts.find((item: any) => item.giftPtBr === gift.giftPtBr)
              ? 'Remover'
              : 'Adicionar'
            }
          </button>
        </div>
      }
    </div>
  );
}